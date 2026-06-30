import { useEffect, useState } from "react";
import type { Product } from "@/data/site";

const KEY = "sanskruti-recently-viewed";
const MAX = 12;

type Snapshot = Pick<Product, "id" | "name" | "price" | "image" | "hoverImage" | "category" | "mrp">;

function read(): Snapshot[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

/** Record a viewed product (most-recent first, de-duplicated, capped). */
export function recordView(p: Product) {
  const snap: Snapshot = {
    id: p.id,
    name: p.name,
    price: p.price,
    mrp: p.mrp,
    image: p.image,
    hoverImage: p.hoverImage,
    category: p.category,
  };
  const next = [snap, ...read().filter((x) => x.id !== p.id)].slice(0, MAX);
  localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("recently-viewed-changed"));
}

/** Reactive list of recently-viewed products, optionally excluding one id. */
export function useRecentlyViewed(excludeId?: string): Snapshot[] {
  const [items, setItems] = useState<Snapshot[]>([]);
  useEffect(() => {
    const refresh = () => setItems(read());
    refresh();
    window.addEventListener("recently-viewed-changed", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("recently-viewed-changed", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);
  return excludeId ? items.filter((i) => i.id !== excludeId) : items;
}

/** Analyze recently viewed items to determine the user's favorite category. */
export function getFavoriteCategory(): string | null {
  const items = read();
  if (items.length === 0) return null;
  
  const categoryCounts: Record<string, number> = {};
  items.forEach(item => {
    if (item.category) {
      categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
    }
  });
  
  const sorted = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);
  return sorted.length > 0 ? sorted[0][0] : null;
}
