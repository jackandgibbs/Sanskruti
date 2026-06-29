import { useState, useEffect } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { supabase } from "@/lib/supabase";

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<any[]>([]);

  useEffect(() => {
    // Requires the signed-in user to be flagged is_admin (see RLS in schema.sql).
    supabase
      .from("profiles")
      .select("id, customer_id, first_name, last_name, phone, created_at")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          console.error("Failed to load customers:", error);
          return;
        }
        setCustomers(
          (data ?? []).map((p) => ({
            uid: p.id,
            id: p.customer_id,
            firstName: p.first_name,
            lastName: p.last_name,
            phone: p.phone ? `+91 ${p.phone}` : "—",
            joined: p.created_at ? new Date(p.created_at).toLocaleDateString("en-IN") : "—",
          }))
        );
      });
  }, []);

  return (
    <div className="space-y-10">
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <h1 className="text-5xl font-heading text-[#1a3326] tracking-tight">Client Directory</h1>
        <p className="text-charcoal/60 mt-3 text-lg font-medium tracking-wide">Manage your boutique's VIP clientele.</p>
      </motion.header>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 overflow-hidden"
      >
        <table className="w-full text-left">
          <thead className="bg-[#1a3326] text-ivory/90 text-sm tracking-widest uppercase">
            <tr>
              <th className="p-6 font-medium">Customer ID</th>
              <th className="p-6 font-medium">Name</th>
              <th className="p-6 font-medium">Phone</th>
              <th className="p-6 font-medium">Joined</th>
              <th className="p-6 font-medium">Orders</th>
              <th className="p-6 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {customers.map((c) => (
              <tr key={c.id} className="hover:bg-white/80 transition-colors group">
                <td className="p-6 font-bold text-[#1a3326]">{c.id}</td>
                <td className="p-6 font-medium text-charcoal/80">{c.firstName} {c.lastName}</td>
                <td className="p-6 text-charcoal/50">{c.phone}</td>
                <td className="p-6 text-charcoal/50">{c.joined}</td>
                <td className="p-6 text-charcoal/50">{c.totalOrders}</td>
                <td className="p-6 text-right">
                  <Link to={`/admin/customers/${c.id}`} className="text-gold hover:text-forest transition-colors font-bold text-xs uppercase tracking-widest">
                    View Profile
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
