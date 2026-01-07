import { cert, getApps, initializeApp, getApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

let adminAppCache: ReturnType<typeof initializeApp> | null = null;
let adminAuthCache: ReturnType<typeof getAuth> | null = null;
let adminDbCache: ReturnType<typeof getFirestore> | null = null;
let adminStorageCache: ReturnType<typeof getStorage> | null = null;

function getFirebaseAdminConfig() {
  return {
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL || '',
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n') || '',
    }),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  };
}

export function getAdminApp() {
  if (!adminAppCache) {
    const config = getFirebaseAdminConfig();
    adminAppCache = getApps().length === 0 ? initializeApp(config, 'admin') : getApp('admin');
  }
  return adminAppCache;
}

export function getAdminAuth() {
  if (!adminAuthCache) {
    adminAuthCache = getAuth(getAdminApp());
  }
  return adminAuthCache;
}

export function getAdminDb() {
  if (!adminDbCache) {
    adminDbCache = getFirestore(getAdminApp());
  }
  return adminDbCache;
}

export function getAdminStorage() {
  if (!adminStorageCache) {
    adminStorageCache = getStorage(getAdminApp());
  }
  return adminStorageCache;
}

// For backward compatibility
export const adminApp = undefined as any;
export const adminAuth = undefined as any;
export const adminDb = undefined as any;
export const adminStorage = undefined as any;
