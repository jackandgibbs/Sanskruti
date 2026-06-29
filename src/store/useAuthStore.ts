import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useCartStore } from './useCartStore';
import { supabase } from '@/lib/supabase';
import type { Session } from '@supabase/supabase-js';

export type User = {
  id: string;
  customerId: string;
  firstName: string;
  lastName: string;
  username?: string;
  email?: string;
  dob?: string;
  phone?: string;
  gender?: string;
  avatarUrl?: string;
  addressStreet?: string;
  addressCity?: string;
  addressState?: string;
  addressZip?: string;
  isAdmin?: boolean;
};

interface AuthState {
  user: User | null;
  token: string | null;
  initialized: boolean;
  login: (user: User, token: string) => void;
  logout: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
  /** Bootstraps auth from the current Supabase session and keeps it in sync. */
  initAuth: () => void;
}

// Maps a row from the `profiles` table (snake_case) to our User shape (camelCase).
function profileToUser(row: any, email?: string): User {
  return {
    id: row.id,
    customerId: row.customer_id ?? '',
    firstName: row.first_name ?? '',
    lastName: row.last_name ?? '',
    username: row.username ?? undefined,
    email: row.email ?? email,
    dob: row.dob ?? undefined,
    phone: row.phone ?? undefined,
    gender: row.gender ?? undefined,
    avatarUrl: row.avatar_url ?? undefined,
    addressStreet: row.address_street ?? undefined,
    addressCity: row.address_city ?? undefined,
    addressState: row.address_state ?? undefined,
    addressZip: row.address_zip ?? undefined,
    isAdmin: row.is_admin ?? false,
  };
}

let initStarted = false;

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      initialized: false,

      login: (user, token) => set({ user, token }),

      logout: async () => {
        // Clear the cart when the user signs out
        useCartStore.getState().clearCart();
        set({ user: null, token: null });
        await supabase.auth.signOut();
      },

      updateUser: (updatedData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedData } : null,
        })),

      initAuth: () => {
        if (initStarted) return;
        initStarted = true;

        // Hydrate the store from a Supabase session (fetches the profile row).
        const hydrate = async (session: Session | null) => {
          if (!session?.user) {
            set({ user: null, token: null, initialized: true });
            return;
          }
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          set({
            token: session.access_token,
            user: profile
              ? profileToUser(profile, session.user.email)
              : // Profile row not created yet (race right after signup) — minimal fallback.
                {
                  id: session.user.id,
                  customerId: '',
                  firstName:
                    (session.user.user_metadata as any)?.first_name ?? '',
                  lastName:
                    (session.user.user_metadata as any)?.last_name ?? '',
                  email: session.user.email ?? undefined,
                },
            initialized: true,
          });
        };

        supabase.auth.getSession().then(({ data }) => hydrate(data.session));
        supabase.auth.onAuthStateChange((_event, session) => {
          // Re-hydrate on sign-in (incl. Google redirect), token refresh, sign-out.
          void hydrate(session);
          if (!session) useCartStore.getState().clearCart();
        });
      },
    }),
    {
      name: 'sanskruti-auth',
      // Only persist the user snapshot for instant paint; the live session is the
      // source of truth and re-hydrates via initAuth on load.
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);
