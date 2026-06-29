import { useParams, useNavigate } from "react-router";
import { motion } from "motion/react";

export default function AdminCustomerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data for the specific customer
  const customer = {
    id: id,
    firstName: "Aditi",
    lastName: "Sharma",
    email: "aditi.sharma@example.com",
    phone: "+91 9876543210",
    joined: "2026-01-15",
    totalOrders: 5,
    lifetimeSpend: "₹85,000",
    status: "VIP",
    addresses: [
      { type: "Home", street: "45 Lotus Street, Banjara Hills", city: "Hyderabad", state: "Telangana", zip: "500034" }
    ],
    recentOrders: [
      { id: "ORD-9021", date: "2026-06-27", status: "PENDING", total: "₹18,500" },
      { id: "ORD-8902", date: "2026-04-12", status: "DELIVERED", total: "₹42,000" }
    ]
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
          <button onClick={() => navigate(-1)} className="text-sm font-bold uppercase tracking-wider text-charcoal/50 hover:text-gold transition-colors mb-4 block">
            &larr; Back to Directory
          </button>
          <h1 className="text-5xl font-heading text-[#1a3326] tracking-tight">{customer.firstName} {customer.lastName}</h1>
          <p className="text-charcoal/60 mt-3 text-lg font-medium tracking-wide">Customer ID: {customer.id}</p>
        </div>
        <div className="px-6 py-2 bg-gradient-to-r from-gold to-[#e8c875] text-forest font-bold rounded-full text-sm uppercase tracking-widest shadow-md">
          {customer.status} Client
        </div>
      </motion.header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Contact & Stats */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-8"
        >
          <div className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 p-8">
            <h2 className="text-xl font-heading text-[#1a3326] mb-6">Contact Information</h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-charcoal/40 mb-1">Email</p>
                <p className="font-medium text-[#1a3326]">{customer.email}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-charcoal/40 mb-1">Phone</p>
                <p className="font-medium text-[#1a3326]">{customer.phone}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-charcoal/40 mb-1">Joined</p>
                <p className="font-medium text-[#1a3326]">{customer.joined}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#1a3326] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/10 p-8 text-ivory">
            <h2 className="text-xl font-heading text-gold mb-6">Lifetime Value</h2>
            <div className="space-y-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-ivory/50 mb-1">Total Spend</p>
                <p className="font-heading text-4xl text-ivory">{customer.lifetimeSpend}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-ivory/50 mb-1">Total Orders</p>
                <p className="font-medium text-lg">{customer.totalOrders} Orders</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Orders & Addresses */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-2 space-y-8"
        >
          <div className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 overflow-hidden">
            <div className="p-8 border-b border-black/5">
              <h2 className="text-xl font-heading text-[#1a3326]">Order History</h2>
            </div>
            <table className="w-full text-left">
              <thead className="bg-black/5 text-charcoal/60 text-xs tracking-widest uppercase">
                <tr>
                  <th className="p-4 pl-8 font-semibold">Order ID</th>
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Total</th>
                  <th className="p-4 pr-8 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {customer.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/50 transition-colors">
                    <td className="p-4 pl-8 font-bold text-[#1a3326]">{order.id}</td>
                    <td className="p-4 text-charcoal/60">{order.date}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                        order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-[#1a3326]">{order.total}</td>
                    <td className="p-4 pr-8 text-right">
                      <button className="text-gold hover:text-forest text-xs font-bold uppercase tracking-widest">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 p-8">
            <h2 className="text-xl font-heading text-[#1a3326] mb-6">Saved Addresses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {customer.addresses.map((addr, i) => (
                <div key={i} className="border border-charcoal/10 rounded-xl p-5 bg-white/40">
                  <span className="inline-block px-2 py-1 bg-charcoal/5 text-charcoal/60 text-[10px] font-bold uppercase tracking-widest rounded mb-3">{addr.type}</span>
                  <p className="text-charcoal font-medium leading-relaxed">
                    {addr.street}<br/>
                    {addr.city}, {addr.state} {addr.zip}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
