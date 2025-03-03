import { create } from 'zustand';
import { CartItem, Product } from '../types';

interface CartState {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  
  addToCart: (product) => {
    set((state) => {
      const existingItem = state.items.find(item => item.id === product.id);
      
      if (existingItem) {
        return {
          items: state.items.map(item => 
            item.id === product.id 
              ? { ...item, quantity: item.quantity + 1 } 
              : item
          )
        };
      } else {
        return {
          items: [...state.items, { ...product, quantity: 1 }]
        };
      }
    });
  },
  
  removeFromCart: (productId) => {
    set((state) => ({
      items: state.items.filter(item => item.id !== productId)
    }));
  },
  
  updateQuantity: (productId, quantity) => {
    set((state) => ({
      items: state.items.map(item => 
        item.id === productId 
          ? { ...item, quantity: Math.max(1, quantity) } 
          : item
      )
    }));
  },
  
  clearCart: () => {
    set({ items: [] });
  },
  
  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },
  
  getTotalPrice: () => {
    return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
}));