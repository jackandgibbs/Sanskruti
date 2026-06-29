import { useState, useEffect } from "react";
import { motion } from "motion/react";

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    setOrders([
      { id: "ORD-9021", user: { firstName: "Aditi", lastName: "Sharma" }, status: "PENDING", totalAmount: 18500, date: "2026-06-27" },
      { id: "ORD-9020", user: { firstName: "Neha", lastName: "Verma" }, status: "PAID", totalAmount: 42000, date: "2026-06-26" },
      { id: "ORD-9019", user: { firstName: "Priya", lastName: "Menon" }, status: "SHIPPED", totalAmount: 12000, date: "2026-06-25" },
      { id: "ORD-9018", user: { firstName: "Sneha", lastName: "Patel" }, status: "DELIVERED", totalAmount: 8500, date: "2026-06-24" },
    ]);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-yellow-100/50 text-yellow-700 border-yellow-200";
      case "PAID": return "bg-blue-100/50 text-blue-700 border-blue-200";
      case "SHIPPED": return "bg-purple-100/50 text-purple-700 border-purple-200";
      case "DELIVERED": return "bg-green-100/50 text-green-700 border-green-200";
      default: return "bg-gray-100/50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="space-y-10">
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <h1 className="text-5xl font-heading text-[#1a3326] tracking-tight">Order Management</h1>
        <p className="text-charcoal/60 mt-3 text-lg font-medium tracking-wide">Track and update customer purchases.</p>
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
              <th className="p-6 font-medium">Order ID</th>
              <th className="p-6 font-medium">Customer</th>
              <th className="p-6 font-medium">Date</th>
              <th className="p-6 font-medium">Total</th>
              <th className="p-6 font-medium">Status</th>
              <th className="p-6 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-white/80 transition-colors group">
                <td className="p-6 font-bold text-[#1a3326]">{order.id}</td>
                <td className="p-6 text-charcoal/60 font-medium">{order.user.firstName} {order.user.lastName}</td>
                <td className="p-6 text-charcoal/50">{order.date}</td>
                <td className="p-6 font-semibold text-lg text-[#1a3326]">₹{order.totalAmount.toLocaleString()}</td>
                <td className="p-6">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-6 text-right">
                  <button className="text-gold hover:text-forest transition-colors font-bold text-xs uppercase tracking-widest">
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
