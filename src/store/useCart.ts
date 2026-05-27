import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Artwork, CartItem } from '@/types';

interface CartState {
  cartItems: CartItem[];
  isOpen: boolean;
  addToCart: (artwork: Artwork, quantity?: number) => void;
  removeFromCart: (artworkId: string) => void;
  updateQuantity: (artworkId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: (isOpen?: boolean) => void;
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      cartItems: [],
      isOpen: false,
      addToCart: (artwork, quantity = 1) =>
        set((state) => {
          const existingItem = state.cartItems.find(
            (item) => item.artwork.id === artwork.id
          );
          if (existingItem) {
            return {
              cartItems: state.cartItems.map((item) =>
                item.artwork.id === artwork.id
                  ? { ...item, quantity: Math.min(item.quantity + quantity, artwork.stock) }
                  : item
              ),
              isOpen: true,
            };
          }
          return {
            cartItems: [...state.cartItems, { artwork, quantity }],
            isOpen: true,
          };
        }),
      removeFromCart: (artworkId) =>
        set((state) => ({
          cartItems: state.cartItems.filter((item) => item.artwork.id !== artworkId),
        })),
      updateQuantity: (artworkId, quantity) =>
        set((state) => ({
          cartItems: state.cartItems.map((item) =>
            item.artwork.id === artworkId
              ? { ...item, quantity: Math.min(Math.max(quantity, 1), item.artwork.stock) }
              : item
          ),
        })),
      clearCart: () => set({ cartItems: [] }),
      toggleCart: (isOpen) =>
        set((state) => ({ isOpen: isOpen !== undefined ? isOpen : !state.isOpen })),
    }),
    {
      name: 'raaga-cart-storage',
      partialize: (state) => ({ cartItems: state.cartItems }),
    }
  )
);
