import { useMemo } from "react";
import { useSearchParams, Link } from "react-router";
import { useProductStore } from "@/store/useProductStore";
import { searchProducts } from "@/lib/search";
import ProductCard from "@/components/ui/ProductCard";
import { useSeo } from "@/lib/seo";

export default function Search() {
  const [params] = useSearchParams();
  const query = params.get("q") ?? "";
  const products = useProductStore((s) => s.products);

  useSeo({ title: query ? `Search: ${query}` : "Search" });

  const results = useMemo(() => searchProducts(products, query), [products, query]);

  return (
    <div className="min-h-screen bg-ivory pt-10 pb-24">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="mb-10 border-b border-border pb-6">
          <p className="text-xs uppercase tracking-widest text-charcoal/50 font-bold mb-2">Search results</p>
          <h1 className="text-3xl sm:text-4xl font-serif text-forest">
            {query ? <>“{query}”</> : "Start typing to search"}
          </h1>
          {query && (
            <p className="text-sm text-charcoal/60 mt-2 font-body">
              {results.length} {results.length === 1 ? "result" : "results"}
            </p>
          )}
        </div>

        {query && results.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-serif text-forest mb-2">No matches for “{query}”</h2>
            <p className="text-charcoal/60 mb-6">Try a different term, or browse our collections.</p>
            <Link to="/new-arrivals" className="text-xs uppercase tracking-widest font-bold border-b border-gold hover:text-gold transition-colors pb-1">
              Shop New Arrivals
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {results.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
