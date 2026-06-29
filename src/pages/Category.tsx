import { useLocation, Link } from "react-router";
import { PRODUCTS, CATEGORIES } from "@/data/site";
import ProductCard from "@/components/ui/ProductCard";

export default function Category() {
  const { pathname } = useLocation();
  const name = pathname.replace('/', ''); // e.g. "sarees" or "new-arrivals"
  
  // Clean category name (e.g. 'new-arrivals' -> 'New Arrivals')
  const formatName = (slug: string) => 
    slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  
  const formattedName = name ? formatName(name) : "Shop All";
  const categoryDetails = CATEGORIES.find(c => c.name.toLowerCase() === formattedName.toLowerCase());

  // Filter local data
  const products = PRODUCTS.filter(p => 
    name === 'new-arrivals' ? p.newArrival :
    name === 'best-sellers' ? p.bestSeller :
    p.category.toLowerCase() === formattedName.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-ivory pt-10 pb-24">
      {/* Category Header */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 mb-12 text-center">
        <h1 className="text-4xl lg:text-5xl font-serif text-forest mb-4">{formattedName}</h1>
        {categoryDetails?.blurb && (
          <p className="text-charcoal/70 uppercase tracking-widest text-sm font-body">
            {categoryDetails.blurb}
          </p>
        )}
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Product Grid (Full Width, No Filters) */}
        <main className="w-full">
          <div className="flex justify-between items-center mb-8 border-b border-border pb-4">
            <span className="text-sm text-charcoal/60 font-body uppercase tracking-widest">{products.length} products</span>
            <select className="bg-transparent text-sm p-2 outline-none font-body uppercase tracking-widest text-forest cursor-pointer">
              <option>Sort by: Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest Arrivals</option>
            </select>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {products.map((product) => (
                <Link key={product.id} to={`/product/${product.id}`} className="block group">
                  <ProductCard product={product} />
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <h2 className="text-2xl font-serif text-forest mb-2">No products found</h2>
              <p className="text-charcoal/60">We are restocking soon! Check back later.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
