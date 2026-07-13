"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  signOut,
  sendPasswordResetEmail,
  updateProfile as firebaseUpdateProfile,
  onAuthStateChanged,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
} from "firebase/firestore";
import { auth, db, isConfigured } from "@/lib/firebase";
import { UserProfile, Workspace } from "@/types";

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  activeWorkspace: Workspace | null;
  loading: boolean;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithGitHub: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  switchWorkspace: (workspaceId: string) => Promise<void>;
  updateProfile: (displayName: string, photoURL?: string | null) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper to provision user document and a default workspace
  const provisionUser = async (fbUser: FirebaseUser, customName?: string) => {
    const userDocRef = doc(db, "users", fbUser.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      // 1. Create a workspace
      const workspaceId = `ws_${Math.random().toString(36).substring(2, 11)}`;
      const workspaceRef = doc(db, "workspaces", workspaceId);
      
      const newWorkspace: Workspace = {
        id: workspaceId,
        name: `${customName || fbUser.displayName || fbUser.email?.split("@")[0] || "My"}'s Workspace`,
        slug: `ws-${Math.random().toString(36).substring(2, 7)}`,
        ownerId: fbUser.uid,
        members: {
          [fbUser.uid]: {
            role: "owner",
            invitedAt: new Date(),
            joinedAt: new Date(),
          },
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await setDoc(workspaceRef, newWorkspace);

      // 2. Create the user profile
      const newProfile: UserProfile = {
        uid: fbUser.uid,
        email: fbUser.email || "",
        displayName: customName || fbUser.displayName || fbUser.email?.split("@")[0] || "User",
        photoURL: fbUser.photoURL,
        createdAt: new Date(),
        updatedAt: new Date(),
        activeWorkspaceId: workspaceId,
      };

      await setDoc(userDocRef, newProfile);
    }
  };

  useEffect(() => {
    if (!isConfigured) {
      Promise.resolve().then(() => setLoading(false));
      return;
    }

    const unsubscribeAuth = onAuthStateChanged(auth, async (fbUser) => {
      setUser(fbUser);

      if (fbUser) {
        try {
          // Provision default user/workspace if metadata is missing in Firestore
          await provisionUser(fbUser);
        } catch (err) {
          console.error("Error provisioning user profile:", err);
        }
      } else {
        setProfile(null);
        setActiveWorkspace(null);
        Promise.resolve().then(() => setLoading(false));
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Listen to User Profile changes in Firestore
  useEffect(() => {
    if (!user) return;

    const userDocRef = doc(db, "users", user.uid);
    const unsubscribeProfile = onSnapshot(
      userDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const profileData = docSnap.data() as UserProfile;
          setProfile(profileData);
        }
      },
      (err) => {
        console.error("Firestore user profile subscription error:", err);
      }
    );

    return () => unsubscribeProfile();
  }, [user]);

  // Listen to Active Workspace changes in Firestore
  useEffect(() => {
    if (!profile?.activeWorkspaceId) {
      if (user && profile === null) {
        // Still loading user data
      } else {
        Promise.resolve().then(() => setLoading(false));
      }
      return;
    }

    const wsRef = doc(db, "workspaces", profile.activeWorkspaceId);
    const unsubscribeWorkspace = onSnapshot(
      wsRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setActiveWorkspace(docSnap.data() as Workspace);
        }
        Promise.resolve().then(() => setLoading(false));
      },
      (err) => {
        console.error("Firestore workspace subscription error:", err);
        Promise.resolve().then(() => setLoading(false));
      }
    );

    return () => unsubscribeWorkspace();
  }, [profile, user]);

  const loginWithEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUpWithEmail = async (email: string, password: string, name: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await firebaseUpdateProfile(cred.user, { displayName: name });
    await provisionUser(cred.user, name);
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const loginWithGitHub = async () => {
    const provider = new GithubAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const switchWorkspace = async (workspaceId: string) => {
    if (!user) return;
    const userDocRef = doc(db, "users", user.uid);
    await setDoc(userDocRef, { activeWorkspaceId: workspaceId }, { merge: true });
  };

  const updateProfile = async (displayName: string, photoURL?: string | null) => {
    if (!user) return;
    await firebaseUpdateProfile(user, { displayName, photoURL: photoURL || undefined });
    const userDocRef = doc(db, "users", user.uid);
    await setDoc(
      userDocRef,
      {
        displayName,
        photoURL: photoURL || null,
        updatedAt: new Date(),
      },
      { merge: true }
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        activeWorkspace,
        loading,
        loginWithEmail,
        signUpWithEmail,
        loginWithGoogle,
        loginWithGitHub,
        logout,
        resetPassword,
        switchWorkspace,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
