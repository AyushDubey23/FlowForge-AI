import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if we are running in browser and have configured keys
const isConfigured = 
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY && 
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== "PLACEHOLDER_API_KEY";

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

interface EmulatorCheck {
  _emulatorConnected?: boolean;
}

// Check if we should connect to Local Emulator (useful for local development & testing)
if (
  process.env.NODE_ENV === "development" &&
  process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "true"
) {
  const authCheck = auth as unknown as EmulatorCheck;
  const dbCheck = db as unknown as EmulatorCheck;
  const storageCheck = storage as unknown as EmulatorCheck;

  // Prevent double connection in Next.js hot-reloads
  if (!authCheck._emulatorConnected) {
    connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
    authCheck._emulatorConnected = true;
  }
  if (!dbCheck._emulatorConnected) {
    connectFirestoreEmulator(db, "localhost", 8080);
    dbCheck._emulatorConnected = true;
  }
  if (!storageCheck._emulatorConnected) {
    connectStorageEmulator(storage, "localhost", 9199);
    storageCheck._emulatorConnected = true;
  }
}

export { app, auth, db, storage, isConfigured };
