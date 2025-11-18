import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

import {
  useFirebase,
  useFirebaseApp,
  useFirestore,
  useAuth,
  FirebaseProvider,
} from './provider';
import { useCollection } from './firestore/use-collection';
import { useDoc } from './firestore/use-doc';
import { useUser } from './auth/use-user';

// The full Firebase SDK
export * from 'firebase/app';
export * from 'firebase/auth';
export * from 'firebase/firestore';

export function initializeFirebase(): {
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
} {
  const apps = getApps();
  const firebaseApp =
    apps.length === 0 ? initializeApp(firebaseConfig) : apps[0];
  const auth = getAuth(firebaseApp);
  const firestore = getFirestore(firebaseApp);
  return { firebaseApp, auth, firestore };
}

export {
  useFirebase,
  useFirebaseApp,
  useFirestore,
  useAuth,
  FirebaseProvider,
  useCollection,
  useDoc,
  useUser,
};
