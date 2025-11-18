'use client';

import { useEffect, useState } from 'react';
import type { User } from 'firebase/auth';

import { useAuth } from '../provider';

export function useUser() {
  const auth = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [initialising, setInitialising] = useState(true);

  useEffect(() => {
    if (!auth) {
      setInitialising(false);
      return;
    }

    const unsubscribe = auth.onAuthStateChanged(
      (user) => {
        setUser(user);
        setInitialising(false);
      },
      (error) => {
        console.error('Auth state change error:', error);
        setInitialising(false);
      }
    );

    return () => unsubscribe();
  }, [auth]);

  return {
    user,
    initialising,
  };
}
