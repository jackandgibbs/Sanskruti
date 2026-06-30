import { useState, useEffect } from "react";
import { Product } from "@/data/site";
import { Link } from "react-router";
import { motion } from "motion/react";
import { toast } from "sonner";
import { fetchProducts, deleteProduct } from "@/lib/products";
import { fetchAllOrders } from "@/lib/orders";
import { subDays, isAfter, startOfDay } from "date-fns";

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [salesVelocity, setSalesVelocity] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
       try {
          const [prodData, orders] = await Promise.all([
             fetchProducts(),
             fetchAllOrders()
          ]);
          setProducts(prodData as Product[]);

          // Calculate sales velocity (units sold in last 30 days)
          const velocity: Record<string, number> = {};
          const thirtyDaysAgo = startOfDay(subDays(new Date(), 30));
          
          orders.forEach((o: any) => {
             if (o.status === "CANCELLED") return;
             if (isAfter(new Date(o.createdAt), thirtyDaysAgo)) {
                o.items?.forEach((item: any) => {
                   velocity[item.productId] = (velocity[item.productId] || 0) + item.quantity;
                });
             }
          });
          setSalesVelocity(velocity);
       } catch (err) {
          console.error("Failed to load products/orders", err);
       } finally {
          setLoading(false);
       }
    }
    load();
  }, []);

  const handleDelete = async (product: Product) => {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    setDeletingId(product.id);
    try {
      await deleteProduct(product.id);
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
      toast.success("Product deleted");
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  };

  const getStockHealth = (product: Product) => {
     if (!product.inStock || product.stockCount === 0) return { label: "Out of Stock", color: "text-red-600 bg-red-100/50 border-red-200" };
     
     const unitsSold30d = salesVelocity[product.id] || 0;
     const dailyVelocity = unitsSold30d / 30;
     
     if (dailyVelocity === 0) return { label: "In Stock (No recent sales)", color: "text-green-700 bg-green-100/50 border-green-200" };
     
     const daysRemaining = (product.stockCount || 0) / dailyVelocity;
     
     if (daysRemaining < 14) {
        return { label: `Critical: ~${daysRemaining.toFixed(0)} days left`, color: "text-red-700 bg-red-100 border-red-300 font-bold" };
     } else if (daysRemaining < 30) {
        return { label: `Low: ~${daysRemaining.toFixed(0)} days left`, color: "text-amber-700 bg-amber-100 border-amber-300" };
     }
     
     return { label: `Healthy (~${daysRemaining.toFixed(0)} days)`, color: "text-green-700 bg-green-100/50 border-green-200" };
  };

  return (
    <div className="space-y-10 pb-20">
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex justify-between items-end"
      >
        <div>
          <h1 className="text-5xl font-heading text-[#1a3326] tracking-tight">Product Inventory</h1>
          <p className="text-charcoal/60 mt-3 text-lg font-medium tracking-wide">Manage your luxury boutique collection and forecast stock.</p>
        </div>
        <Link 
          to="/admin/products/new" 
          className="bg-gradient-to-r from-forest to-[#1a3326] text-ivory px-8 py-3.5 rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 font-semibold tracking-wide"
        >
          + Add New Product
        </Link>
      </motion.header>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 overflow-hidden"
      >
        {loading ? (
          <div className="p-20 text-center text-charcoal/50 font-medium tracking-wide">Loading inventory & forecasting...</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-[#1a3326] text-ivory/90 text-sm tracking-widest uppercase">
              <tr>
                <th className="p-6 font-medium">Product</th>
                <th className="p-6 font-medium">Category</th>
                <th className="p-6 font-medium">Price</th>
                <th className="p-6 font-medium">Stock Health (30d Forecast)</th>
                <th className="p-6 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-gray-500 font-medium">
                    No products found in the database.
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                   const health = getStockHealth(product);
                   return (
                  <tr key={product.id} className="hover:bg-white/80 transition-colors group">
                    <td className="p-6 flex items-center gap-5">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-16 h-20 object-cover rounded shadow-sm"
                        />
                      ) : (
                        <div className="w-16 h-20 bg-gray-100 rounded" />
                      )}
                      <div>
                        <span className="font-heading text-lg text-[#1a3326] block">{product.name}</span>
                        {product.sku && <span className="text-xs text-charcoal/40 font-bold uppercase tracking-wider">{product.sku}</span>}
                      </div>
                    </td>
                    <td className="p-6 text-charcoal/60 font-medium">{product.category}</td>
                    <td className="p-6">
                      <span className="font-semibold text-lg text-[#1a3326]">₹{product.price.toLocaleString()}</span>
                      {product.mrp && <span className="block text-xs text-charcoal/40 line-through">₹{product.mrp.toLocaleString()}</span>}
                    </td>
                    <td className="p-6">
                      <div className="flex flex-col gap-1">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold tracking-wider inline-flex w-max border ${health.color}`}>
                          {health.label}
                        </span>
                        <span className="text-xs text-charcoal/50 font-medium pl-1">
                          Current Stock: {product.stockCount || 0}
                        </span>
                      </div>
                    </td>
                    <td className="p-6 text-right">
                      <Link to={`/admin/products/edit/${product.id}`} className="text-gold hover:text-forest transition-colors font-bold text-xs uppercase tracking-widest mr-5">
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(product)}
                        disabled={deletingId === product.id}
                        className="text-red-500 hover:text-red-700 transition-colors font-bold text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 disabled:opacity-50"
                      >
                        {deletingId === product.id ? "Deleting…" : "Delete"}
                      </button>
                    </td>
                  </tr>
                )})
              )}
            </tbody>
          </table>
        )}
      </motion.div>
    </div>
  );
}
