import { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router";
import { CATEGORIES } from "@/data/site";
import { useProductStore } from "@/store/useProductStore";
import ProductCard from "@/components/ui/ProductCard";
import { SlidersHorizontal, X } from "lucide-react";
import { useSeo } from "@/lib/seo";

const PRICE_BUCKETS = [
  { label: "Under ₹5,000", test: (p: number) => p < 5000 },
  { label: "₹5,000 – ₹10,000", test: (p: number) => p >= 5000 && p < 10000 },
  { label: "₹10,000 – ₹20,000", test: (p: number) => p >= 10000 && p < 20000 },
  { label: "₹20,000 & above", test: (p: number) => p >= 20000 },
];

const PAGE_SIZE = 12;

export default function Category() {
  const { pathname } = useLocation();
  const name = pathname.replace("/", ""); // e.g. "sarees" or "new-arrivals"
  const [sortBy, setSortBy] = useState("featured");

  const formatName = (slug: string) =>
    slug.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

  const formattedName = name ? formatName(name) : "Shop All";
  const categoryDetails = CATEGORIES.find((c) => c.name.toLowerCase() === formattedName.toLowerCase());

  useSeo({
    title: formattedName,
    description: categoryDetails?.blurb
      ? `${formattedName} — ${categoryDetails.blurb}. Shop the Sanskruti ${formattedName} collection.`
      : `Shop the Sanskruti ${formattedName} collection.`,
  });

  const allProducts = useProductStore((state) => state.products);

  const baseProducts = useMemo(
    () =>
      allProducts.filter((p) =>
        name === "new-arrivals"
          ? p.newArrival
          : name === "best-sellers"
            ? p.bestSeller
            : p.category.toLowerCase() === formattedName.toLowerCase()
      ),
    [allProducts, name, formattedName]
  );

  // Facets derived from the products actually in this category.
  const fabricOptions = useMemo(
    () => Array.from(new Set(baseProducts.map((p) => p.fabric).filter(Boolean))).sort(),
    [baseProducts]
  );
  const sizeOptions = useMemo(
    () => Array.from(new Set(baseProducts.flatMap((p) => p.sizes))).sort(),
    [baseProducts]
  );

  // Filter state
  const [priceBuckets, setPriceBuckets] = useState<Set<number>>(new Set());
  const [fabrics, setFabrics] = useState<Set<string>>(new Set());
  const [sizes, setSizes] = useState<Set<string>>(new Set());
  const [inStockOnly, setInStockOnly] = useState(false);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Reset filters + pagination when the category changes.
  useEffect(() => {
    setPriceBuckets(new Set());
    setFabrics(new Set());
    setSizes(new Set());
    setInStockOnly(false);
    setVisible(PAGE_SIZE);
  }, [name]);

  const toggle = <T,>(set: Set<T>, value: T) => {
    const next = new Set(set);
    next.has(value) ? next.delete(value) : next.add(value);
    return next;
  };

  const filtered = useMemo(() => {
    const result = baseProducts.filter((p) => {
      if (inStockOnly && !p.inStock) return false;
      if (fabrics.size && !fabrics.has(p.fabric)) return false;
      if (sizes.size && !p.sizes.some((s) => sizes.has(s))) return false;
      if (priceBuckets.size) {
        const matches = Array.from(priceBuckets).some((idx) => PRICE_BUCKETS[idx].test(p.price));
        if (!matches) return false;
      }
      return true;
    });

    return result.sort((a, b) => {
      if (sortBy === "low-to-high") return a.price - b.price;
      if (sortBy === "high-to-low") return b.price - a.price;
      if (sortBy === "newest") return (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0);
      return 0;
    });
  }, [baseProducts, inStockOnly, fabrics, sizes, priceBuckets, sortBy]);

  // Reset pagination whenever filters/sort change the result set.
  useEffect(() => setVisible(PAGE_SIZE), [filtered.length, sortBy]);

  const activeFilterCount = priceBuckets.size + fabrics.size + sizes.size + (inStockOnly ? 1 : 0);
  const clearAll = () => {
    setPriceBuckets(new Set());
    setFabrics(new Set());
    setSizes(new Set());
    setInStockOnly(false);
  };

  const FilterPanel = (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-widest text-forest">Filters</h2>
        {activeFilterCount > 0 && (
          <button onClick={clearAll} className="text-xs text-charcoal/50 hover:text-gold uppercase tracking-widest font-bold">
            Clear ({activeFilterCount})
          </button>
        )}
      </div>

      {/* Price */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-charcoal/50 mb-3">Price</p>
        <div className="space-y-2">
          {PRICE_BUCKETS.map((b, idx) => (
            <label key={b.label} className="flex items-center gap-2 text-sm text-charcoal/80 cursor-pointer">
              <input
                type="checkbox"
                checked={priceBuckets.has(idx)}
                onChange={() => setPriceBuckets((s) => toggle(s, idx))}
                className="accent-forest w-4 h-4"
              />
              {b.label}
            </label>
          ))}
        </div>
      </div>

      {/* Fabric */}
      {fabricOptions.length > 0 && (
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-charcoal/50 mb-3">Fabric</p>
          <div className="space-y-2">
            {fabricOptions.map((f) => (
              <label key={f} className="flex items-center gap-2 text-sm text-charcoal/80 cursor-pointer">
                <input
                  type="checkbox"
                  checked={fabrics.has(f)}
                  onChange={() => setFabrics((s) => toggle(s, f))}
                  className="accent-forest w-4 h-4"
                />
                {f}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Size */}
      {sizeOptions.length > 0 && (
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-charcoal/50 mb-3">Size</p>
          <div className="flex flex-wrap gap-2">
            {sizeOptions.map((s) => (
              <button
                key={s}
                onClick={() => setSizes((prev) => toggle(prev, s))}
                className={`px-3 py-1.5 border text-xs font-semibold uppercase tracking-wider transition-colors ${
                  sizes.has(s) ? "border-forest bg-forest text-ivory" : "border-border text-charcoal hover:border-forest"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Availability */}
      <label className="flex items-center gap-2 text-sm text-charcoal/80 cursor-pointer">
        <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} className="accent-forest w-4 h-4" />
        In stock only
      </label>
    </div>
  );

  return (
    <div className="min-h-screen bg-ivory pt-10 pb-24">
      {/* Category Header */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 mb-12 text-center">
        <h1 className="text-4xl lg:text-5xl font-serif text-forest mb-4">{formattedName}</h1>
        {categoryDetails?.blurb && (
          <p className="text-charcoal/70 uppercase tracking-widest text-sm font-body">{categoryDetails.blurb}</p>
        )}
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 flex gap-10">
        {/* Sidebar (desktop) */}
        <aside className="hidden lg:block w-60 flex-none">{FilterPanel}</aside>

        {/* Grid */}
        <main className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-8 border-b border-border pb-4 gap-4">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-forest"
            >
              <SlidersHorizontal size={16} /> Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
            </button>
            <span className="hidden lg:inline text-sm text-charcoal/60 font-body uppercase tracking-widest">
              {filtered.length} products
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-sm p-2 outline-none font-body uppercase tracking-widest text-forest cursor-pointer"
            >
              <option value="featured">Sort by: Featured</option>
              <option value="low-to-high">Price: Low to High</option>
              <option value="high-to-low">Price: High to Low</option>
              <option value="newest">Newest Arrivals</option>
            </select>
          </div>

          {filtered.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {filtered.slice(0, visible).map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>

              {visible < filtered.length && (
                <div className="mt-12 text-center">
                  <button
                    onClick={() => setVisible((v) => v + PAGE_SIZE)}
                    className="border border-forest text-forest px-10 py-3.5 uppercase tracking-[0.15em] font-bold text-xs hover:bg-forest hover:text-ivory transition-colors"
                  >
                    Load More ({filtered.length - visible} left)
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <h2 className="text-2xl font-serif text-forest mb-2">No products found</h2>
              <p className="text-charcoal/60">
                {activeFilterCount > 0 ? "Try adjusting your filters." : "We are restocking soon! Check back later."}
              </p>
              {activeFilterCount > 0 && (
                <button onClick={clearAll} className="mt-4 text-xs uppercase tracking-widest font-bold border-b border-gold hover:text-gold">
                  Clear filters
                </button>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Mobile filter drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-[85vw] max-w-sm bg-ivory p-6 overflow-y-auto">
            <div className="flex justify-end mb-4">
              <button onClick={() => setMobileFiltersOpen(false)} aria-label="Close filters">
                <X size={24} />
              </button>
            </div>
            {FilterPanel}
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="mt-8 w-full bg-forest text-ivory py-3.5 uppercase tracking-[0.15em] font-bold text-xs"
            >
              Show {filtered.length} results
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
