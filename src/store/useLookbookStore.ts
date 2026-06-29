import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/data/site';

export interface Lookbook {
  id: string;
  name: string;
  items: Product[];
  createdAt: number;
}

interface LookbookState {
  lookbooks: Lookbook[];
  createLookbook: (name: string) => void;
  deleteLookbook: (id: string) => void;
  addItemToLookbook: (lookbookId: string, product: Product) => void;
  removeItemFromLookbook: (lookbookId: string, productId: string) => void;
}

export const useLookbookStore = create<LookbookState>()(
  persist(
    (set) => ({
      lookbooks: [
        {
          id: 'default-wishlist',
          name: 'My Favorites',
          items: [],
          createdAt: Date.now(),
        }
      ],

      createLookbook: (name) => set((state) => {
        // Prevent duplicate names
        if (state.lookbooks.some(l => l.name.toLowerCase() === name.toLowerCase())) {
          return state; 
        }
        return {
          lookbooks: [
            ...state.lookbooks,
            {
              id: `lb-${Date.now()}`,
              name,
              items: [],
              createdAt: Date.now(),
            }
          ]
        };
      }),

      deleteLookbook: (id) => set((state) => ({
        lookbooks: state.lookbooks.filter(l => l.id !== id)
      })),

      addItemToLookbook: (lookbookId, product) => set((state) => ({
        lookbooks: state.lookbooks.map(lb => {
          if (lb.id === lookbookId) {
            // Avoid duplicates in the same lookbook
            if (lb.items.some(item => item.id === product.id)) {
              return lb;
            }
            return { ...lb, items: [...lb.items, product] };
          }
          return lb;
        })
      })),

      removeItemFromLookbook: (lookbookId, productId) => set((state) => ({
        lookbooks: state.lookbooks.map(lb => {
          if (lb.id === lookbookId) {
            return { ...lb, items: lb.items.filter(item => item.id !== productId) };
          }
          return lb;
        })
      })),

    }),
    {
      name: 'sanskruti-lookbooks',
    }
  )
);
