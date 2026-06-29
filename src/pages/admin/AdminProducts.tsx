import { useState, useEffect } from "react";
import { Product } from "@/data/site";
import { Link } from "react-router";
import { motion } from "motion/react";

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3001/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch products from backend:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-10">
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex justify-between items-end"
      >
        <div>
          <h1 className="text-5xl font-heading text-[#1a3326] tracking-tight">Product Inventory</h1>
          <p className="text-charcoal/60 mt-3 text-lg font-medium tracking-wide">Manage your luxury boutique collection.</p>
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
          <div className="p-20 text-center text-charcoal/50 font-medium tracking-wide">Loading inventory...</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-[#1a3326] text-ivory/90 text-sm tracking-widest uppercase">
              <tr>
                <th className="p-6 font-medium">Product</th>
                <th className="p-6 font-medium">Category</th>
                <th className="p-6 font-medium">Price</th>
                <th className="p-6 font-medium">Status</th>
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
                products.map((product) => (
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
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                        product.inStock ? "bg-green-100/50 text-green-700 border border-green-200" : "bg-red-100/50 text-red-700 border border-red-200"
                      }`}>
                        {product.inStock ? "In Stock" : "Out of Stock"}
                      </span>
                    </td>
                    <td className="p-6 text-right">
                      <Link to={`/admin/products/edit/${product.id}`} className="text-gold hover:text-forest transition-colors font-bold text-xs uppercase tracking-widest mr-5">
                        Edit
                      </Link>
                      <button className="text-red-500 hover:text-red-700 transition-colors font-bold text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </motion.div>
    </div>
  );
}
