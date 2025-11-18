'use client';

import {
  doc,
  onSnapshot,
  type DocumentReference,
  type DocumentData,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';

import { useFirestore } from '../provider';

interface UseDocOptions {
  deps?: any[];
}

export function useDoc<T = DocumentData>(
  path: string | null | undefined,
  options?: UseDocOptions
) {
  const firestore = useFirestore();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const deps = options?.deps || [];

  useEffect(() => {
    if (!firestore || !path) {
      setLoading(false);
      return;
    }

    const docRef = doc(firestore, path) as DocumentReference<T>;

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setData({ ...snapshot.data(), id: snapshot.id });
        } else {
          setData(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error(`Error fetching document ${path}:`, err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [firestore, path, ...deps]);

  return { data, loading, error };
}
