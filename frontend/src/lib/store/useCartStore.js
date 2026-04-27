import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * useCartStore
 * 
 * Manages the shopping cart state.
 * Features: Add to cart, remove from cart, update quantity, and clear cart.
 * Persists to localStorage.
 */
export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      // Getters
      getTotalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
      getTotalPrice: () => get().items.reduce((total, item) => total + (item.price * item.quantity), 0),

      // Actions
      addItem: (product) => set((state) => {
        const existingItem = state.items.find(item => item._id === product._id);
        
        if (existingItem) {
          return {
            items: state.items.map(item => 
              item._id === product._id 
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          };
        }
        
        return { items: [...state.items, { ...product, quantity: 1 }] };
      }),

      removeItem: (productId) => set((state) => ({
        items: state.items.filter(item => item._id !== productId)
      })),

      updateQuantity: (productId, quantity) => set((state) => ({
        items: state.items.map(item => 
          item._id === productId 
            ? { ...item, quantity: Math.max(1, quantity) }
            : item
        )
      })),

      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage',
    }
  )
);
