
'use client';

import {
  collection,
  onSnapshot,
  query,
  where,
  type CollectionReference,
  type DocumentData,
  type Query,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';

import { useFirestore } from '../provider';

interface UseCollectionOptions {
  deps?: any[];
}

export function useCollection<T = DocumentData>(
  path: string | null | undefined,
  options?: UseCollectionOptions
) {
  const firestore = useFirestore();
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const deps = options?.deps || [];

  useEffect(() => {
    if (!firestore || !path) {
      setLoading(false);
      return;
    }

    const collectionRef = collection(firestore, path) as CollectionReference<T>;
    const unsubscribe = onSnapshot(
      collectionRef,
      (snapshot) => {
        const result: T[] = [];
        snapshot.forEach((doc) => {
          result.push({ ...doc.data(), id: doc.id });
        });
        setData(result);
        setLoading(false);
      },
      (err) => {
        console.error(`Error fetching collection ${path}:`, err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [firestore, path, ...deps]);

  return { data, loading, error };
}

export function useCollectionQuery<T = DocumentData>(
  collectionPath: string | null | undefined,
  field: string,
  value: any,
  options?: UseCollectionOptions
) {
  const firestore = useFirestore();
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const deps = options?.deps || [];

  useEffect(() => {
    if (!firestore || !collectionPath) {
      setLoading(false);
      return;
    }

    const collectionRef = collection(firestore, collectionPath);
    const q = query(collectionRef, where(field, '==', value)) as Query<T>;

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const result: T[] = [];
        snapshot.forEach((doc) => {
          result.push({ ...doc.data(), id: doc.id });
        });
        setData(result);
        setLoading(false);
      },
      (err) => {
        console.error(
          `Error fetching collection query ${collectionPath}:`,
          err
        );
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [firestore, collectionPath, field, value, ...deps]);

  return { data, loading, error };
}
