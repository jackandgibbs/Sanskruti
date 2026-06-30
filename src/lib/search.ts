import { useEffect, useState } from "react";
import type { Product } from "@/data/site";

/** Case-insensitive match across name, category and fabric, optionally scoped to a category. */
export function searchProducts(products: Product[], query: string, category = "All Categories"): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return products.filter((p) => {
    const inCategory = category === "All Categories" || p.category.toLowerCase() === category.toLowerCase();
    if (!inCategory) return false;
    return (
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.fabric && p.fabric.toLowerCase().includes(q))
    );
  });
}

/** Debounce any fast-changing value (e.g. a search box) by `delay` ms. */
export function useDebounced<T>(value: T, delay = 250): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}
