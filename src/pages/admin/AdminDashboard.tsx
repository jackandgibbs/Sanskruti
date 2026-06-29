import { motion } from "motion/react";

export default function AdminDashboard() {
  const stats = [
    { label: "Total Revenue", value: "₹4,25,000", change: "+12.5%", trend: "up" },
    { label: "Total Orders", value: "128", change: "+4.2%", trend: "up" },
    { label: "Active Products", value: "45", change: "0%", trend: "neutral" },
    { label: "VIP Customers", value: "89", change: "+18.1%", trend: "up" },
  ];

  return (
    <div className="space-y-10">
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <h1 className="text-5xl font-heading text-[#1a3326] tracking-tight">Executive Dashboard</h1>
        <p className="text-charcoal/60 mt-3 text-lg font-medium tracking-wide">Welcome back. Here is the overview of Sanskruti today.</p>
      </motion.header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="group relative bg-white/60 backdrop-blur-xl p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 hover:shadow-[0_20px_40px_rgb(205,166,63,0.1)] hover:-translate-y-1 transition-all duration-300 overflow-hidden"
          >
            {/* Subtle highlight gradient on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <p className="text-sm uppercase tracking-widest text-charcoal/50 font-bold mb-4 relative z-10">{stat.label}</p>
            <div className="flex items-end gap-4 relative z-10">
              <p className="text-4xl font-heading text-[#1a3326]">{stat.value}</p>
              <span className={`text-sm font-bold mb-1.5 ${
                stat.trend === "up" ? "text-green-600" : stat.trend === "down" ? "text-red-500" : "text-gray-400"
              }`}>
                {stat.change}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Orders Overview */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 p-10 mt-10"
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-heading text-[#1a3326]">Recent Transactions</h2>
          <button className="text-sm font-bold uppercase tracking-wider text-gold hover:text-[#1a3326] transition-colors">
            View All Orders
          </button>
        </div>
        
        <div className="text-center py-20 text-charcoal/40 border-2 border-dashed border-charcoal/10 rounded-xl bg-white/30 backdrop-blur-sm">
          <p className="font-medium tracking-wide">Live transaction feed will appear here</p>
        </div>
      </motion.div>
    </div>
  );
}
