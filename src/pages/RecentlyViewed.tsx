import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import { useRecentlyViewed } from "@/lib/recentlyViewed";
import { formatINR } from "@/lib/utils";
import { useSeo } from "@/lib/seo";

export default function RecentlyViewed() {
  const items = useRecentlyViewed();
  useSeo({ title: "Recently Viewed" });

  return (
    <div className="min-h-screen bg-ivory pt-8 pb-24">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-charcoal/50 hover:text-forest transition-colors mb-4">
            <ArrowLeft size={14} /> Your Account
          </Link>
          <h1 className="text-3xl sm:text-4xl font-serif text-forest">Recently Viewed</h1>
        </div>

        {items.length === 0 ? (
          <div className="bg-white p-12 text-center border border-border">
            <p className="text-forest font-serif text-xl mb-4">You haven't viewed any products yet</p>
            <Link to="/new-arrivals" className="text-xs uppercase tracking-widest font-bold border-b border-gold hover:text-gold transition-colors pb-1">
              Start Browsing
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {items.map((p) => (
              <Link key={p.id} to={`/product/${p.id}`} className="group block">
                <div className="aspect-[3/4] bg-white overflow-hidden mb-3">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <h3 className="text-sm font-medium text-charcoal line-clamp-1">{p.name}</h3>
                <p className="text-[0.68rem] uppercase tracking-[0.14em] text-charcoal/50 mt-0.5">{p.category}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-semibold text-charcoal">{formatINR(p.price)}</span>
                  {p.mrp && <span className="text-xs text-charcoal/40 line-through">{formatINR(p.mrp)}</span>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
