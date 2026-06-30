import { create } from "zustand";
import { Product } from "@/data/site";
import { useAuthStore } from "./useAuthStore";
import {
  Lookbook,
  fetchLookbooks,
  ensureDefaultLookbook,
  createLookbook as dbCreate,
  deleteLookbook as dbDelete,
  addLookbookItem,
  removeLookbookItem,
} from "@/lib/lookbooks";

export type { Lookbook };

interface LookbookState {
  lookbooks: Lookbook[];
  loading: boolean;
  /** Load lookbooks for a signed-in user (creates the default if needed). */
  loadForUser: (userId: string) => Promise<void>;
  /** Clear in-memory lookbooks (on sign-out). Does not delete server data. */
  clear: () => void;
  /** Returns false if a lookbook with that name already exists. */
  createLookbook: (name: string) => Promise<boolean>;
  deleteLookbook: (id: string) => Promise<void>;
  addItemToLookbook: (lookbookId: string, product: Product) => Promise<void>;
  removeItemFromLookbook: (lookbookId: string, productId: string) => Promise<void>;
}

const uid = () => useAuthStore.getState().user?.id ?? null;

export const useLookbookStore = create<LookbookState>((set, get) => ({
  lookbooks: [],
  loading: false,

  loadForUser: async (userId) => {
    set({ loading: true });
    try {
      await ensureDefaultLookbook(userId);
      const lookbooks = await fetchLookbooks(userId);
      set({ lookbooks, loading: false });
    } catch (err) {
      console.error("Failed to load lookbooks", err);
      set({ loading: false });
    }
  },

  clear: () => set({ lookbooks: [] }),

  createLookbook: async (name) => {
    const userId = uid();
    if (!userId) return false;
    if (get().lookbooks.some((l) => l.name.toLowerCase() === name.toLowerCase())) {
      return false;
    }
    const id = await dbCreate(userId, name);
    set((state) => ({
      lookbooks: [...state.lookbooks, { id, name, items: [], createdAt: Date.now() }],
    }));
    return true;
  },

  deleteLookbook: async (id) => {
    const prev = get().lookbooks;
    set({ lookbooks: prev.filter((l) => l.id !== id) }); // optimistic
    try {
      await dbDelete(id);
    } catch (err) {
      set({ lookbooks: prev }); // revert
      throw err;
    }
  },

  addItemToLookbook: async (lookbookId, product) => {
    const prev = get().lookbooks;
    set({
      lookbooks: prev.map((lb) =>
        lb.id === lookbookId && !lb.items.some((i) => i.id === product.id)
          ? { ...lb, items: [...lb.items, product] }
          : lb
      ),
    });
    try {
      await addLookbookItem(lookbookId, product);
    } catch (err) {
      set({ lookbooks: prev });
      throw err;
    }
  },

  removeItemFromLookbook: async (lookbookId, productId) => {
    const prev = get().lookbooks;
    set({
      lookbooks: prev.map((lb) =>
        lb.id === lookbookId
          ? { ...lb, items: lb.items.filter((i) => i.id !== productId) }
          : lb
      ),
    });
    try {
      await removeLookbookItem(lookbookId, productId);
    } catch (err) {
      set({ lookbooks: prev });
      throw err;
    }
  },
}));
