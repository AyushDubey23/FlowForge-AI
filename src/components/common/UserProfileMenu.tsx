"use client";

import React, { useState, useRef } from "react";
import { useAuth } from "@/features/auth/context/AuthContext";
import { storage } from "@/lib/firebase";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { LogOut, Settings, Check, Loader2, Upload, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const UserProfileMenu: React.FC = () => {
  const { profile, logout, updateProfile } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [displayName, setDisplayName] = useState(profile?.displayName || "");
  const [photoURL, setPhotoURL] = useState(profile?.photoURL || "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    // Validate size (< 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File is too large. Max size is 5MB.");
      return;
    }

    try {
      setError(null);
      setUploading(true);
      const avatarRef = storageRef(storage, `users/${profile.uid}/avatar.png`);
      await uploadBytes(avatarRef, file);
      const downloadURL = await getDownloadURL(avatarRef);
      setPhotoURL(downloadURL);
    } catch (err) {
      console.error("Storage upload failed:", err);
      setError("Failed to upload image. (Ensure Storage bucket is set up)");
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) return;

    try {
      setError(null);
      setSaving(true);
      await updateProfile(displayName.trim(), photoURL.trim() || null);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setModalOpen(false);
      }, 1000);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Failed to update profile";
      setError(errMsg);
    } finally {
      setSaving(false);
    }
  };

  if (!profile) return null;

  const initialLetter = profile.displayName ? profile.displayName.charAt(0).toUpperCase() : "?";

  return (
    <div className="relative font-sans">
      {/* Dropdown Menu Trigger */}
      <button
        onClick={() => setDropdownOpen((prev) => !prev)}
        className="flex items-center gap-2.5 w-full p-2 rounded-lg border border-transparent hover:border-border hover:bg-zinc-900/60 transition-all text-left"
      >
        <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-border bg-primary/20 flex items-center justify-center">
          {profile.photoURL ? (
            <img src={profile.photoURL} alt={profile.displayName} className="h-full w-full object-cover" />
          ) : (
            <span className="text-sm font-bold text-primary">{initialLetter}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-foreground truncate leading-none mb-1">
            {profile.displayName}
          </p>
          <p className="text-[10px] text-muted-foreground truncate leading-none">
            {profile.email}
          </p>
        </div>
      </button>

      {/* User Actions Dropdown overlay */}
      {dropdownOpen && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setDropdownOpen(false)} />
          <div className="absolute bottom-full left-0 right-0 mb-1.5 bg-card border border-border rounded-lg shadow-xl py-1.5 z-30 animate-fade-in glass-panel">
            <button
              onClick={() => {
                setDropdownOpen(false);
                setDisplayName(profile.displayName || "");
                setPhotoURL(profile.photoURL || "");
                setError(null);
                setModalOpen(true);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted text-left"
            >
              <Settings className="h-3.5 w-3.5 text-muted-foreground" />
              Profile Settings
            </button>
            <div className="border-t border-border/80 my-1" />
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-destructive hover:bg-destructive/10 text-left"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign Out
            </button>
          </div>
        </>
      )}

      {/* Profile Settings Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-40 animate-fade-in">
          <div className="w-full max-w-sm border border-border bg-card rounded-xl p-6 shadow-2xl glass-panel relative">
            <h3 className="text-base font-bold text-foreground mb-1">Profile Settings</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Update your account details and profile image.
            </p>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              {error && (
                <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive font-medium flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Avatar Selector/Upload widget */}
              <div className="flex items-center gap-4 py-2">
                <div className="relative h-16 w-16 overflow-hidden rounded-full border border-border bg-primary/20 flex items-center justify-center">
                  {photoURL ? (
                    <img src={photoURL} alt="Preview" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold text-primary">{initialLetter}</span>
                  )}
                  {uploading && (
                    <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
                      <Loader2 className="h-4 w-4 animate-spin text-white" />
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs flex gap-1.5"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading || saving}
                  >
                    <Upload className="h-3.5 w-3.5" />
                    Upload Image
                  </Button>
                  <p className="text-[10px] text-muted-foreground">
                    Square PNG/JPG, max 5MB.
                  </p>
                </div>
              </div>

              <Input
                label="Display Name"
                placeholder="Ayush"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                disabled={saving}
                required
              />

              <Input
                label="Avatar URL (Optional fallback)"
                placeholder="https://example.com/avatar.png"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                disabled={saving}
              />

              <div className="flex justify-end gap-2.5 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setModalOpen(false)}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={saving}
                  className="flex gap-1.5"
                >
                  {success ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      Saved
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
