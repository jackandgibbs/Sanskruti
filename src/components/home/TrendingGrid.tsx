import SectionHeading from "@/components/ui/SectionHeading";
import ProductCard from "@/components/ui/ProductCard";
import { useProductStore } from "@/store/useProductStore";

export default function TrendingGrid() {
  const products = useProductStore((state) => state.products).slice(0, 8);

  return (
    <section className="section-spacing">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading
          eyebrow="TRENDING NOW"
          title="Most Loved Pieces"
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
