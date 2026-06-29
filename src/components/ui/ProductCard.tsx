import { motion } from "motion/react";
import { Link } from "react-router";
import type { Product } from "@/data/site";
import { cn, formatINR } from "@/lib/utils";

type Props = {
  product: Product;
  index?: number;
};

const FlowerMandala = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <g transform="translate(50 50)">
      <ellipse cx="0" cy="0" rx="45" ry="15" transform="rotate(0)" />
      <ellipse cx="0" cy="0" rx="45" ry="15" transform="rotate(45)" />
      <ellipse cx="0" cy="0" rx="45" ry="15" transform="rotate(90)" />
      <ellipse cx="0" cy="0" rx="45" ry="15" transform="rotate(135)" />
      <circle cx="0" cy="0" r="8" fill="currentColor" opacity="0.5" />
    </g>
  </svg>
);

export default function ProductCard({ product, index = 0 }: Props) {
  const discount = product.mrp
    ? Math.round((1 - product.price / product.mrp) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Link
        to={`/product/${product.id}`}
        className="group block"
      >
        {/* Image with Theme Frame */}
        <div className="product-img-wrap aspect-[3/4] bg-ivory relative border-[6px] border-ivory p-1.5 overflow-hidden">
          {/* Inner image container */}
          <div className="relative w-full h-full">
            <img
              src={product.image}
              alt={product.name}
              className="img-main h-full w-full object-cover"
              loading="lazy"
            />
            <img
              src={product.hoverImage}
              alt={`${product.name} hover`}
              className="img-hover h-full w-full object-cover"
              loading="lazy"
            />

            {/* Theme Overlays */}
            <div className="absolute inset-0 pointer-events-none z-10 p-2 sm:p-3">
              {/* Subtle Gold Borders */}
              <div className="absolute top-2 left-0 right-0 h-[1px] bg-gold/40"></div>
              <div className="absolute bottom-2 left-0 right-0 h-[1px] bg-gold/40"></div>
              
              {/* Flower Mandalas */}
              <FlowerMandala className="absolute top-4 right-4 w-12 h-12 text-gold opacity-60" />
              <FlowerMandala className="absolute bottom-4 left-4 w-12 h-12 text-gold opacity-60" />
            </div>

            {/* Discount/Tag badge (Top Left) */}
            {discount > 0 ? (
              <span className="absolute top-4 left-0 z-20 bg-[#cca341] text-white text-[0.7rem] font-bold uppercase tracking-wider px-3 py-1.5 shadow-sm">
                {discount}% OFF
              </span>
            ) : product.tag ? (
              <span className="absolute top-4 left-0 z-20 bg-[#cca341] text-white text-[0.7rem] font-bold uppercase tracking-wider px-3 py-1.5 shadow-sm">
                {product.tag}
              </span>
            ) : null}

            {/* Quick Shop overlay */}
            <div
              className={cn(
                "absolute inset-x-0 bottom-0 z-20 flex items-center justify-center pb-6 pt-12",
                "bg-gradient-to-t from-black/60 to-transparent",
                "opacity-0 translate-y-4 transition-all duration-300 ease-out",
                "group-hover:opacity-100 group-hover:translate-y-0"
              )}
            >
              <span className="bg-white text-charcoal text-[0.68rem] font-bold uppercase tracking-[0.18em] px-6 py-2.5 cursor-pointer hover:bg-forest hover:text-ivory transition-colors duration-200 shadow-lg">
                Quick Shop
              </span>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="mt-3 space-y-1">
          {/* Name */}
          <h3 className="text-[0.82rem] font-medium text-charcoal line-clamp-1">
            {product.name}
          </h3>

          {/* Category */}
          <p className="text-[0.68rem] uppercase tracking-[0.14em] text-muted">
            {product.category}
          </p>

          {/* Price row */}
          <div className="flex items-center gap-2 pt-0.5">
            <span className="text-[0.85rem] font-semibold text-charcoal">
              {formatINR(product.price)}
            </span>
            {product.mrp && (
              <>
                <span className="text-[0.75rem] text-muted line-through">
                  {formatINR(product.mrp)}
                </span>
                <span className="text-[0.68rem] font-semibold text-gold">
                  {discount}% OFF
                </span>
              </>
            )}
          </div>

          {/* Rating */}
          {product.rating > 0 && (
            <div className="flex items-center gap-1.5 pt-0.5">
              <span className="text-[0.72rem] text-gold">
                {Array.from({ length: 5 })
                  .map((_, i) => (i < Math.round(product.rating) ? "★" : "☆"))
                  .join("")}
              </span>
              <span className="text-[0.65rem] text-muted">
                ({product.reviews})
              </span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
