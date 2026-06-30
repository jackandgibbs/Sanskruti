import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { fetchAllOrders, updateOrderStatus, ORDER_STATUSES, type OrderStatus } from "@/lib/orders";

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    fetchAllOrders()
      .then(setOrders)
      .catch((err) => console.error("Failed to load orders:", err))
      .finally(() => setLoading(false));
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-yellow-100/50 text-yellow-700 border-yellow-200";
      case "PAID": return "bg-blue-100/50 text-blue-700 border-blue-200";
      case "SHIPPED": return "bg-purple-100/50 text-purple-700 border-purple-200";
      case "DELIVERED": return "bg-green-100/50 text-green-700 border-green-200";
      case "CANCELLED": return "bg-red-100/50 text-red-700 border-red-200";
      default: return "bg-gray-100/50 text-gray-700 border-gray-200";
    }
  };

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    const prev = orders;
    setSavingId(orderId);
    setOrders((os) => os.map((o) => (o.id === orderId ? { ...o, status } : o)));
    try {
      await updateOrderStatus(orderId, status);
      toast.success(`Order marked ${status}`);
    } catch (err: any) {
      setOrders(prev); // revert
      toast.error(err?.message || "Failed to update status");
    } finally {
      setSavingId(null);
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
        {loading ? (
          <div className="p-20 text-center text-charcoal/50 font-medium tracking-wide">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="p-16 text-center text-charcoal/50 font-medium">No orders yet.</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-[#1a3326] text-ivory/90 text-sm tracking-widest uppercase">
              <tr>
                <th className="p-6 font-medium">Order ID</th>
                <th className="p-6 font-medium">Customer</th>
                <th className="p-6 font-medium">Date</th>
                <th className="p-6 font-medium">Items</th>
                <th className="p-6 font-medium">Total</th>
                <th className="p-6 font-medium">Status</th>
                <th className="p-6 font-medium text-right">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-white/80 transition-colors group align-top">
                  <td className="p-6 font-bold text-[#1a3326] font-mono text-sm">{order.id.split("-")[0].toUpperCase()}</td>
                  <td className="p-6 text-charcoal/60 font-medium">
                    {order.customer ? `${order.customer.firstName ?? ""} ${order.customer.lastName ?? ""}`.trim() || "—" : "—"}
                  </td>
                  <td className="p-6 text-charcoal/50">{new Date(order.createdAt).toLocaleDateString("en-IN")}</td>
                  <td className="p-6 text-charcoal/50">{order.items.reduce((n: number, it: any) => n + it.quantity, 0)}</td>
                  <td className="p-6 font-semibold text-lg text-[#1a3326]">₹{Number(order.totalAmount).toLocaleString("en-IN")}</td>
                  <td className="p-6">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    <select
                      value={order.status}
                      disabled={savingId === order.id}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                      className="bg-white border border-charcoal/20 rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider text-[#1a3326] outline-none focus:border-gold cursor-pointer disabled:opacity-50"
                    >
                      {ORDER_STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </motion.div>
    </div>
  );
}
