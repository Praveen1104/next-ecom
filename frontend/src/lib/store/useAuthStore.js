import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * useAuthStore
 * 
 * Manages user authentication state, tokens, and profile information.
 * Persists to localStorage to maintain session across reloads.
 */
export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      // Actions
      login: (userData, token) => set({ 
        user: userData, 
        token: token, 
        isAuthenticated: true 
      }),

      logout: () => set({ 
        user: null, 
        token: null, 
        isAuthenticated: false 
      }),

      updateUser: (updatedData) => set((state) => ({
        user: { ...state.user, ...updatedData }
      })),
    }),
    {
      name: 'auth-storage', // name of the item in the storage (must be unique)
    }
  )
);
