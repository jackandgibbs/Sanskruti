import { useEffect, useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { fetchProducts } from "@/lib/products";
import { Product } from "@/data/site";

interface SeoAudit {
   product: Product;
   score: number;
   issues: string[];
}

export default function AdminSeoReport() {
  const [audits, setAudits] = useState<SeoAudit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const prodData = await fetchProducts();
        const results = (prodData as any[]).map(p => {
           let score = 100;
           const issues: string[] = [];
           
           if (!p.metaTitle) { score -= 30; issues.push("Missing Meta Title"); }
           else if (p.metaTitle.length > 60) { score -= 10; issues.push("Meta Title too long (>60 chars)"); }
           
           if (!p.metaDesc) { score -= 30; issues.push("Missing Meta Description"); }
           else if (p.metaDesc.length < 50) { score -= 15; issues.push("Meta Desc too short (<50 chars)"); }
           else if (p.metaDesc.length > 160) { score -= 10; issues.push("Meta Desc too long (>160 chars)"); }
           
           if (!p.image) { score -= 20; issues.push("Missing Main Image"); }
           if (!p.hoverImage) { score -= 10; issues.push("Missing Hover Image"); }
           
           if (p.description && p.description.length < 100) { score -= 10; issues.push("Product description is thin"); }

           return { product: p as Product, score: Math.max(0, score), issues };
        });
        
        setAudits(results.sort((a, b) => a.score - b.score));
      } catch (err) {
        console.error("Failed to load SEO report:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-10 pb-20">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <h1 className="text-5xl font-heading text-[#1a3326] tracking-tight">SEO Health Report</h1>
        <p className="text-charcoal/60 mt-3 text-lg font-medium tracking-wide">Automated audit of your product catalog's search engine optimization.</p>
      </motion.header>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 p-10 overflow-hidden"
      >
        {loading ? (
           <div className="text-center py-20 text-charcoal/40 font-medium tracking-wide">Running SEO Audit...</div>
        ) : (
           <table className="w-full text-left">
              <thead className="bg-[#1a3326] text-ivory/90 text-sm tracking-widest uppercase">
                 <tr>
                    <th className="p-6 font-medium">Product</th>
                    <th className="p-6 font-medium">SEO Score</th>
                    <th className="p-6 font-medium">Detected Issues</th>
                    <th className="p-6 font-medium text-right">Action</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                 {audits.length === 0 ? (
                    <tr>
                       <td colSpan={4} className="p-12 text-center text-gray-500 font-medium">No products found.</td>
                    </tr>
                 ) : (
                    audits.map(({ product, score, issues }) => (
                       <tr key={product.id} className="hover:bg-white/80 transition-colors">
                          <td className="p-6">
                             <span className="font-heading text-lg text-[#1a3326] block">{product.name}</span>
                             <span className="text-xs text-charcoal/40 font-bold uppercase tracking-wider">{product.category}</span>
                          </td>
                          <td className="p-6">
                             <div className="flex items-center gap-3">
                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                   <div className={`h-2 rounded-full ${score >= 80 ? 'bg-green-500' : score >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${score}%` }}></div>
                                </div>
                                <span className={`font-bold ${score >= 80 ? 'text-green-700' : score >= 50 ? 'text-amber-700' : 'text-red-700'}`}>{score}/100</span>
                             </div>
                          </td>
                          <td className="p-6">
                             {issues.length === 0 ? (
                                <span className="text-green-600 text-sm font-medium">Perfect! ✨</span>
                             ) : (
                                <ul className="list-disc list-inside text-sm text-red-600/80">
                                   {issues.map((iss, i) => <li key={i}>{iss}</li>)}
                                </ul>
                             )}
                          </td>
                          <td className="p-6 text-right">
                             <Link to={`/admin/products/edit/${product.id}`} className="text-gold hover:text-forest transition-colors font-bold text-xs uppercase tracking-widest">
                                Fix Issues
                             </Link>
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
