import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
// Make sure to add these to your .env file
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase only once, and gracefully handle missing keys during SSG build
const app = getApps().length === 0 && firebaseConfig.apiKey 
  ? initializeApp(firebaseConfig) 
  : getApps().length > 0 ? getApps()[0] : null;

// Only initialize services if app was successfully created
export const db = app ? getFirestore(app) : null as any;
export const auth = app ? getAuth(app) : null as any;
