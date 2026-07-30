'use client';

import { useEffect, useState } from 'react';
import type { User } from 'firebase/auth';

import { useAuth } from '../provider';

const MOCK_USER_KEY = 'financeai_mock_user';

function getMockUser(): User | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(MOCK_USER_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as User;
  } catch {
    return null;
  }
}

export function setMockUser(user: User | null) {
  if (typeof window === 'undefined') return;
  if (user) {
    localStorage.setItem(MOCK_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(MOCK_USER_KEY);
  }
}

export function useUser() {
  const auth = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [initialising, setInitialising] = useState(true);

  useEffect(() => {
    if (auth) {
      const unsubscribe = auth.onAuthStateChanged(
        (fbUser) => {
          setUser(fbUser);
          setInitialising(false);
        },
        () => {
          setInitialising(false);
        }
      );
      return () => unsubscribe();
    }

    const mockUser = getMockUser();
    setUser(mockUser);
    setInitialising(false);
  }, [auth]);

  return {
    user,
    initialising,
  };
}
