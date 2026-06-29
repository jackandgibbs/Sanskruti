import { Link } from "react-router";
import type { Product } from "@/data/site";
import SectionHeading from "@/components/ui/SectionHeading";
import ProductCard from "@/components/ui/ProductCard";

type Props = {
  eyebrow: string;
  title: string;
  subtitle: string;
  products: Product[];
  to: string;
};

export default function ProductRail({
  eyebrow,
  title,
  subtitle,
  products,
  to,
}: Props) {
  const visible = products.slice(0, 4);

  return (
    <section className="section-spacing">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
          {visible.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link to={to} className="btn-outline">
            View All
          </Link>
        </div>
      </div>
    </section>
  );
}
