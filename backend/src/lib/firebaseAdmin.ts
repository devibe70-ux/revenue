import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import * as path from 'path';
import * as fs from 'fs';

// Initialize Firebase Admin SDK using a serviceAccountKey.json file
export function initFirebaseAdmin() {
  if (getApps().length === 0) {
    try {
      // Path to the service account key inside the backend folder
      const serviceAccountPath = path.resolve(__dirname, '../../serviceAccountKey.json');
      
      if (!fs.existsSync(serviceAccountPath)) {
          console.error('ERROR: Could not find serviceAccountKey.json at', serviceAccountPath);
          console.error('Please download it from Firebase Console and place it in the root of the backend folder.');
          return;
      }

      const serviceAccount = require(serviceAccountPath);

      initializeApp({
        credential: cert(serviceAccount)
      });
      console.log('Firebase Admin initialized successfully from serviceAccountKey.json');
    } catch (error) {
      console.error('Failed to initialize Firebase Admin:', error);
    }
  }
}

// We lazily initialize Firestore so it does not throw immediately on import
export const db = new Proxy({}, {
    get: (target, prop) => {
        if (getApps().length === 0) return undefined;
        const firestore = getFirestore();
        return firestore[prop as keyof typeof firestore];
    }
}) as any; // Cast as any because TS proxy typing can be tricky with firestore

export const auth = new Proxy({}, {
    get: (target, prop) => {
        if (getApps().length === 0) return undefined;
        const authService = getAuth();
        return authService[prop as keyof typeof authService];
    }
}) as any;
