import { create } from "zustand";
import { Product, PRODUCTS } from "@/data/site";
import { fetchProducts } from "@/lib/products";

// The storefront historically rendered a hard-coded mock catalog (src/data/site.ts)
// while the admin panel wrote real rows to Supabase — so admin-created products
// never showed up on the store. This store bridges the two: it paints instantly
// from the mock catalog (also the offline / not-configured fallback) and then,
// once Supabase responds, swaps in the real products if any exist.

interface ProductState {
  products: Product[];
  /** True once the Supabase fetch has settled (success or failure). */
  loaded: boolean;
  loading: boolean;
  init: () => Promise<void>;
}

/** Map a camelCase row from `fetchProducts()` to the storefront `Product` shape. */
function toStorefrontProduct(p: any): Product {
  // The DB stores `sizes`/`tags` as comma-separated (or JSON) strings; the
  // storefront expects real arrays.
  const sizes = Array.isArray(p.sizes)
    ? p.sizes
    : typeof p.sizes === "string"
      ? p.sizes.split(",").map((s: string) => s.trim()).filter(Boolean)
      : [];

  const price = Number(p.price) || 0;
  const mrpRaw = p.mrp != null ? Number(p.mrp) : undefined;
  const mrp = mrpRaw && mrpRaw > price ? mrpRaw : undefined;

  let galleryImages: string[] = [];
  if (p.galleryImages) {
    try {
      const parsed = JSON.parse(p.galleryImages);
      if (Array.isArray(parsed)) galleryImages = parsed;
    } catch (e) {}
  }

  return {
    id: p.id,
    name: p.name,
    category: p.category,
    price,
    mrp,
    rating: Number(p.rating) || 0,
    reviews: Number(p.reviews) || 0,
    fabric: p.fabric ?? "",
    sizes,
    image: p.image ?? "",
    hoverImage: p.hoverImage || p.image || "",
    galleryImages,
    tag: mrp ? `${Math.round((1 - price / mrp) * 100)}% OFF` : undefined,
    inStock: p.inStock ?? true,
    stockCount: p.stockCount != null ? Number(p.stockCount) : undefined,
    bestSeller: p.bestSeller ?? false,
    newArrival: p.newArrival ?? false,
    sku: p.sku ?? undefined,
    description: p.description ?? undefined,
  };
}

let initStarted = false;

export const useProductStore = create<ProductState>((set) => ({
  products: PRODUCTS, // mock fallback for instant paint / demo / offline
  loaded: false,
  loading: false,

  init: async () => {
    if (initStarted) return;
    initStarted = true;
    set({ loading: true });
    try {
      const rows = await fetchProducts();
      // Only replace the mock catalog when the DB actually has products, so a
      // fresh/demo install still renders a populated storefront.
      if (rows && rows.length > 0) {
        set({ products: rows.map(toStorefrontProduct) });
      }
    } catch (err) {
      console.error("Failed to load storefront products; using mock catalog.", err);
    } finally {
      set({ loaded: true, loading: false });
    }
  },
}));
