'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthStore {
  isLoggedIn: boolean;
  username: string | null;
  token: string | null;
  loginWithToken: (username: string, token: string) => void;
  logout: () => void;
  verifySession: () => Promise<boolean>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      username: null,
      token: null,

      loginWithToken: (username: string, token: string) => {
        set({ isLoggedIn: true, username, token });
      },

      logout: async () => {
        try {
          await fetch('/api/auth/verify', { method: 'POST' });
        } catch (error) {
          console.error('Logout error:', error);
        }
        set({ isLoggedIn: false, username: null, token: null });
      },

      verifySession: async () => {
        try {
          const response = await fetch('/api/auth/verify');
          if (response.ok) {
            const data = (await response.json()) as { username: string };
            set({ isLoggedIn: true, username: data.username });
            return true;
          }
        } catch (error) {
          console.error('Session verification error:', error);
        }
        set({ isLoggedIn: false, username: null, token: null });
        return false;
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
