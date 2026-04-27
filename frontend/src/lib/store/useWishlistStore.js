import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * useWishlistStore
 * 
 * Manages the user's wishlist (Save for later).
 * Features: Add to wishlist, remove from wishlist, and check if item is wishlisted.
 * Persists to localStorage.
 */
export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product) => set((state) => {
        const exists = state.items.find(item => item._id === product._id);
        if (exists) return state;
        return { items: [...state.items, product] };
      }),

      removeItem: (productId) => set((state) => ({
        items: state.items.filter(item => item._id !== productId)
      })),

      isInWishlist: (productId) => {
        return get().items.some(item => item._id === productId);
      },

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'wishlist-storage',
    }
  )
);
