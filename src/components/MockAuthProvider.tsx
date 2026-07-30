'use client';

import { useEffect } from 'react';

const MOCK_USER_KEY = 'financeai_mock_user';

export function MockAuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const existing = localStorage.getItem(MOCK_USER_KEY);
    if (!existing) {
      const mockUser = {
        uid: 'mock-user-1',
        email: 'alex.doe@example.com',
        displayName: 'Alex Doe',
      };
      localStorage.setItem(MOCK_USER_KEY, JSON.stringify(mockUser));
    }
  }, []);

  return <>{children}</>;
}
