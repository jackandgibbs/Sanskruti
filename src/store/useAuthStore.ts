import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useCartStore } from './useCartStore';

export type User = {
  id: string;
  customerId: string;
  firstName: string;
  lastName: string;
  phone: string;
  gender?: string;
  addressStreet?: string;
  addressCity?: string;
  addressState?: string;
  addressZip?: string;
};

interface AuthState {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      
      login: (user, token) => set({ user, token }),
      
      logout: () => {
        // Clear the cart when the user signs out
        useCartStore.getState().clearCart();
        set({ user: null, token: null });
      },
      
      updateUser: (updatedData) => 
        set((state) => ({ 
          user: state.user ? { ...state.user, ...updatedData } : null 
        })),
    }),
    {
      name: 'sanskruti-auth',
    }
  )
);
