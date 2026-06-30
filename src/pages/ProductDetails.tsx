import { useParams, Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { useProductStore } from "@/store/useProductStore";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { ChevronRight, Star, Truck, RefreshCw, ShieldCheck, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import ProductRail from "@/components/home/ProductRail";
import SaveToLookbookModal from "@/components/ui/SaveToLookbookModal";
import ProductReviews from "@/components/ui/ProductReviews";
import { useSeo } from "@/lib/seo";
import { recordView } from "@/lib/recentlyViewed";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  
  const products = useProductStore(state => state.products);
  const productsLoaded = useProductStore(state => state.loaded);
  const product = products.find(p => p.id === id);
  const addItem = useCartStore(state => state.addItem);

  const [selectedSize, setSelectedSize] = useState<string>("");
  const [activeImage, setActiveImage] = useState<string>(product?.image || "");
  const [isLookbookModalOpen, setIsLookbookModalOpen] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({});

  // Sync the main image once the product resolves (the catalog may load async).
  useEffect(() => {
    if (product?.image) setActiveImage(product.image);
  }, [product?.id]);

  // Track recently-viewed for the dashboard rail.
  useEffect(() => {
    if (product) recordView(product);
  }, [product?.id]);

  useSeo({
    title: product?.name,
    description: product
      ? product.description ||
        `${product.name} — ${product.fabric || "premium"} ${product.category} from Sanskruti.`
      : undefined,
    image: product?.image,
    jsonLd: product
      ? {
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          image: [product.image, product.hoverImage].filter(Boolean),
          description: product.description,
          category: product.category,
          sku: product.sku,
          brand: { "@type": "Brand", name: "Sanskruti" },
          aggregateRating:
            product.reviews > 0
              ? { "@type": "AggregateRating", ratingValue: product.rating, reviewCount: product.reviews }
              : undefined,
          offers: {
            "@type": "Offer",
            priceCurrency: "INR",
            price: product.price,
            availability: product.inStock
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
          },
        }
      : null,
  });

  // The catalog can still be loading from Supabase — don't flash "not found".
  if (!product && !productsLoaded) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-ivory">
        <p className="text-charcoal/50 font-medium tracking-wide">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-ivory text-center">
        <h1 className="text-3xl font-serif text-forest mb-4">Product Not Found</h1>
        <Link to="/" className="text-sm uppercase tracking-widest border-b border-gold hover:text-gold transition-colors">
          Return to Home
        </Link>
      </div>
    );
  }

  const images = [...new Set([product.image, product.hoverImage, ...(product.galleryImages || [])].filter(Boolean))] as string[];

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Authentication Required", {
        description: "Please log in or sign up to add items to your cart."
      });
      navigate("/auth", { state: { from: { pathname: `/product/${id}` } } });
      return;
    }

    if (!product.inStock) {
      toast.error("Out of Stock", {
        description: "This piece is currently unavailable.",
      });
      return;
    }

    if (product.sizes.length > 0 && !selectedSize) {
      toast.warning("Size Required", {
        description: "Please select a size first!"
      });
      return;
    }
    
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
      size: selectedSize || undefined,
    });
    
    toast.success("Added to Cart", {
      description: `${product.name} has been added to your cart.`
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only apply zoom on non-touch devices (hover enabled)
    if (window.matchMedia("(hover: none)").matches) return;
    
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(2.5)",
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      transformOrigin: "center center",
      transform: "scale(1)",
    });
  };

  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="min-h-screen bg-ivory pt-8 pb-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-charcoal/60 mb-8 font-body">
          <Link to="/" className="hover:text-forest">Home</Link>
          <ChevronRight size={14} />
          <Link to={`/${product.category.toLowerCase()}`} className="hover:text-forest">{product.category}</Link>
          <ChevronRight size={14} />
          <span className="text-forest truncate">{product.name}</span>
        </nav>

        {/* Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">
          
          {/* Images */}
          <div className="flex flex-col-reverse md:flex-row gap-4">
            <div className="flex md:flex-col gap-3 overflow-x-auto md:w-24 flex-none scrollbar-hide">
              {images.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImage(img)}
                  className={cn(
                    "w-20 h-24 md:w-24 md:h-32 flex-none border transition-all",
                    activeImage === img ? "border-forest" : "border-transparent hover:border-gold/50"
                  )}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            
            {/* Interactive Zoom Viewer */}
            <div 
              className="flex-1 h-[500px] md:h-[700px] bg-white overflow-hidden relative cursor-crosshair"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <img 
                src={activeImage || product.image} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-100 ease-out pointer-events-none"
                style={zoomStyle}
              />
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col py-4">
            <h1 className="text-3xl sm:text-4xl font-serif text-forest mb-2">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex text-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} />
                ))}
              </div>
              <span className="text-xs text-charcoal/60 uppercase tracking-wider">{product.reviews} Reviews</span>
            </div>

            <div className="flex items-baseline gap-4 mb-8 border-b border-border pb-8">
              <span className="text-2xl font-body font-semibold text-charcoal">₹{product.price.toLocaleString('en-IN')}</span>
              {product.mrp && (
                <span className="text-lg text-charcoal/40 line-through">₹{product.mrp.toLocaleString('en-IN')}</span>
              )}
              {product.tag && (
                <span className="text-xs font-bold text-gold uppercase tracking-wider ml-auto">{product.tag}</span>
              )}
            </div>

            <p className="text-charcoal/80 mb-8 leading-relaxed">
              {product.description || "Experience the pinnacle of elegance with this beautifully crafted piece from Sanskruti. Made with premium materials and showcasing exquisite attention to detail."}
            </p>

            {/* Stock status */}
            <div className="mb-8">
              {!product.inStock ? (
                <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-red-600">
                  <span className="w-2 h-2 rounded-full bg-red-500" /> Out of Stock
                </span>
              ) : product.stockCount != null && product.stockCount <= 5 ? (
                <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-amber-600">
                  <span className="w-2 h-2 rounded-full bg-amber-500" /> Only {product.stockCount} left — order soon
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-forest">
                  <span className="w-2 h-2 rounded-full bg-forest" /> In Stock
                </span>
              )}
            </div>

            {/* Sizes */}
            {product.sizes.length > 0 && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-bold uppercase tracking-widest text-forest">Select Size</span>
                  <button className="text-xs text-charcoal/60 uppercase tracking-widest underline hover:text-gold">Size Guide</button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "h-12 px-6 border text-sm font-semibold uppercase tracking-wider transition-all",
                        selectedSize === size 
                          ? "border-forest bg-forest text-ivory" 
                          : "border-border text-charcoal hover:border-forest"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 h-14 bg-forest text-ivory uppercase tracking-[0.2em] font-bold text-sm hover:bg-gold transition-colors disabled:bg-charcoal/30 disabled:cursor-not-allowed disabled:hover:bg-charcoal/30"
              >
                {product.inStock ? "Add to Cart" : "Out of Stock"}
              </button>
              <button 
                onClick={() => {
                  if (!user) {
                    toast.error("Authentication Required", { description: "Please log in to use Lookbooks." });
                    navigate("/auth", { state: { from: { pathname: `/product/${id}` } } });
                    return;
                  }
                  setIsLookbookModalOpen(true);
                }}
                className="w-14 h-14 border border-border flex flex-none items-center justify-center text-forest hover:border-gold hover:text-gold transition-colors"
                title="Save to Lookbook"
              >
                <Heart size={20} />
              </button>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-6 border-t border-border">
              <div className="flex flex-col items-center text-center gap-2">
                <Truck className="text-forest" size={24} strokeWidth={1.5} />
                <span className="text-xs uppercase tracking-widest text-charcoal/80 font-bold">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <RefreshCw className="text-forest" size={24} strokeWidth={1.5} />
                <span className="text-xs uppercase tracking-widest text-charcoal/80 font-bold">15-Day Returns</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <ShieldCheck className="text-forest" size={24} strokeWidth={1.5} />
                <span className="text-xs uppercase tracking-widest text-charcoal/80 font-bold">Authenticity</span>
              </div>
            </div>
            
          </div>
        </div>

        {/* Reviews */}
        <ProductReviews productId={product.id} />

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-32">
             <ProductRail
                eyebrow="You might also like"
                title="Similar Styles"
                subtitle="Complete your look with these gorgeous pieces."
                products={relatedProducts}
                to={`/${product.category.toLowerCase()}`}
              />
          </div>
        )}

        <SaveToLookbookModal 
          isOpen={isLookbookModalOpen} 
          onClose={() => setIsLookbookModalOpen(false)} 
          product={product} 
        />
      </div>
    </div>
  );
}
