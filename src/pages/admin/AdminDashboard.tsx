import { useEffect, useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { supabase } from "@/lib/supabase";
import { fetchAllOrders } from "@/lib/orders";
import { formatINR } from "@/lib/utils";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { subDays, format, isAfter, startOfDay } from "date-fns";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ revenue: 0, orders: 0, products: 0, customers: 0 });
  const [recent, setRecent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const [orders, productCount, customerCount] = await Promise.all([
          fetchAllOrders(),
          supabase.from("products").select("id, name, image", { count: "exact" }),
          supabase.from("profiles").select("id", { count: "exact", head: true }),
        ]);

        const validOrders = orders.filter((o: any) => o.status !== "CANCELLED");
        const revenue = validOrders.reduce((sum: number, o: any) => sum + Number(o.totalAmount), 0);

        setStats({
          revenue,
          orders: orders.length,
          products: productCount.count ?? 0,
          customers: customerCount.count ?? 0,
        });
        setRecent(orders.slice(0, 5));

        // Generate Chart Data (Last 30 Days)
        const daysMap: Record<string, number> = {};
        for (let i = 29; i >= 0; i--) {
          daysMap[format(subDays(new Date(), i), "MMM dd")] = 0;
        }

        const productSales: Record<string, { id: string; name: string; image: string; revenue: number; units: number }> = {};
        
        // Initialize product sales from fetched products to guarantee data presence
        if (productCount.data) {
          productCount.data.forEach(p => {
             productSales[p.id] = { id: p.id, name: p.name, image: p.image, revenue: 0, units: 0 };
          });
        }

        const thirtyDaysAgo = startOfDay(subDays(new Date(), 29));

        validOrders.forEach((o: any) => {
          const date = new Date(o.createdAt);
          if (isAfter(date, thirtyDaysAgo)) {
             const formattedDate = format(date, "MMM dd");
             if (daysMap[formattedDate] !== undefined) {
                daysMap[formattedDate] += Number(o.totalAmount);
             }
          }
          
          o.items?.forEach((item: any) => {
             if (productSales[item.productId]) {
                productSales[item.productId].revenue += (item.price * item.quantity);
                productSales[item.productId].units += item.quantity;
             }
          });
        });

        setChartData(Object.entries(daysMap).map(([date, amount]) => ({ date, amount })));
        
        setTopProducts(
          Object.values(productSales)
            .filter(p => p.units > 0)
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5)
        );

      } catch (err) {
        console.error("Failed to load dashboard:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const cards = [
    { label: "Total Revenue", value: formatINR(stats.revenue) },
    { label: "Total Orders", value: String(stats.orders) },
    { label: "Active Products", value: String(stats.products) },
    { label: "Customers", value: String(stats.customers) },
  ];

  return (
    <div className="space-y-10 pb-20">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex justify-between items-end"
      >
        <div>
           <h1 className="text-5xl font-heading text-[#1a3326] tracking-tight">Executive Dashboard</h1>
           <p className="text-charcoal/60 mt-3 text-lg font-medium tracking-wide">Welcome back. Here is the overview of Sanskruti today.</p>
        </div>
      </motion.header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {cards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="group relative bg-white/60 backdrop-blur-xl p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 hover:shadow-[0_20px_40px_rgb(205,166,63,0.1)] hover:-translate-y-1 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <p className="text-sm uppercase tracking-widest text-charcoal/50 font-bold mb-4 relative z-10">{stat.label}</p>
            <div className="flex items-end gap-4 relative z-10">
              <p className="text-4xl font-heading text-[#1a3326]">{loading ? "—" : stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Charts Section */}
         <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
           className="lg:col-span-2 bg-white/60 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 p-8"
         >
           <h2 className="text-2xl font-heading text-[#1a3326] mb-6">Revenue Trend (30 Days)</h2>
           {loading ? (
             <div className="h-[300px] flex items-center justify-center text-charcoal/40">Loading chart...</div>
           ) : (
             <div className="h-[300px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                   <defs>
                     <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#1a3326" stopOpacity={0.3}/>
                       <stop offset="95%" stopColor="#1a3326" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#666' }} dy={10} minTickGap={20} />
                   <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#666' }} tickFormatter={(val) => `₹${(val/1000).toFixed(0)}k`} />
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                   <Tooltip 
                     formatter={(value: number) => [formatINR(value), "Revenue"]}
                     contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                   />
                   <Area type="monotone" dataKey="amount" stroke="#1a3326" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                 </AreaChart>
               </ResponsiveContainer>
             </div>
           )}
         </motion.div>

         {/* Top Products */}
         <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
           className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 p-8"
         >
           <h2 className="text-2xl font-heading text-[#1a3326] mb-6">Top Products</h2>
           {loading ? (
             <div className="text-center py-10 text-charcoal/40">Loading...</div>
           ) : topProducts.length === 0 ? (
             <div className="text-center py-10 text-charcoal/40">No sales data yet</div>
           ) : (
             <div className="space-y-4">
               {topProducts.map((p, i) => (
                 <div key={p.id} className="flex items-center gap-4">
                   <div className="font-bold text-[#1a3326] w-4">{i + 1}</div>
                   <div className="w-10 h-12 bg-white rounded overflow-hidden shadow-sm flex-none">
                     <img src={p.image} alt="" className="w-full h-full object-cover" />
                   </div>
                   <div className="flex-1 min-w-0">
                     <p className="text-sm font-semibold text-[#1a3326] truncate">{p.name}</p>
                     <p className="text-xs text-charcoal/60">{p.units} units sold</p>
                   </div>
                   <div className="text-sm font-bold text-[#1a3326]">
                     {formatINR(p.revenue)}
                   </div>
                 </div>
               ))}
             </div>
           )}
         </motion.div>
      </div>

      {/* Recent Orders Overview */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 p-10"
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-heading text-[#1a3326]">Recent Transactions</h2>
          <Link to="/admin/orders" className="text-sm font-bold uppercase tracking-wider text-gold hover:text-[#1a3326] transition-colors">
            View All Orders
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-16 text-charcoal/40">Loading…</div>
        ) : recent.length === 0 ? (
          <div className="text-center py-20 text-charcoal/40 border-2 border-dashed border-charcoal/10 rounded-xl bg-white/30">
            <p className="font-medium tracking-wide">No transactions yet</p>
          </div>
        ) : (
          <div className="divide-y divide-black/5">
            {recent.map((o) => (
              <div key={o.id} className="flex items-center justify-between py-4">
                <div>
                  <p className="font-mono text-sm font-bold text-[#1a3326]">{o.id.split("-")[0].toUpperCase()}</p>
                  <p className="text-xs text-charcoal/50">
                    {o.customer ? `${o.customer.firstName ?? ""} ${o.customer.lastName ?? ""}`.trim() : "—"}
                    {" • "}
                    {new Date(o.createdAt).toLocaleDateString("en-IN")}
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-charcoal/60">{o.status}</span>
                  <span className="font-semibold text-[#1a3326]">{formatINR(Number(o.totalAmount))}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
