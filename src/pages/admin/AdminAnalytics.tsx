import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { fetchAllOrders } from "@/lib/orders";
import { formatINR } from "@/lib/utils";
import { format, subDays, startOfDay, getMonth, getYear, differenceInMonths, startOfMonth } from "date-fns";

export default function AdminAnalytics() {
  const [heatmap, setHeatmap] = useState<{ date: string; amount: number }[]>([]);
  const [cohorts, setCohorts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const orders = await fetchAllOrders();
        const validOrders = orders.filter((o: any) => o.status !== "CANCELLED");

        // 1. Generate Heatmap (Last 365 Days)
        const daysMap: Record<string, number> = {};
        for (let i = 364; i >= 0; i--) {
          daysMap[format(subDays(new Date(), i), "yyyy-MM-dd")] = 0;
        }

        const oneYearAgo = startOfDay(subDays(new Date(), 364));

        validOrders.forEach((o: any) => {
          const date = new Date(o.createdAt);
          if (date >= oneYearAgo) {
             const d = format(date, "yyyy-MM-dd");
             if (daysMap[d] !== undefined) {
                daysMap[d] += Number(o.totalAmount);
             }
          }
        });
        
        setHeatmap(Object.entries(daysMap).map(([date, amount]) => ({ date, amount })));

        // 2. Generate Customer Cohorts
        // user_id -> first purchase date
        const userFirstOrder: Record<string, Date> = {};
        validOrders.forEach((o: any) => {
           if (!o.customer) return; // Need customer info
           const uid = o.customer.customerId;
           const d = new Date(o.createdAt);
           if (!userFirstOrder[uid] || d < userFirstOrder[uid]) {
              userFirstOrder[uid] = d;
           }
        });

        // cohort map: YYYY-MM -> array of user_ids in this cohort
        const cohortUsers: Record<string, Set<string>> = {};
        Object.entries(userFirstOrder).forEach(([uid, d]) => {
           const cohortMonth = format(d, "MMM yyyy");
           if (!cohortUsers[cohortMonth]) cohortUsers[cohortMonth] = new Set();
           cohortUsers[cohortMonth].add(uid);
        });

        const cohortMatrix = Object.keys(cohortUsers).sort((a, b) => new Date(b).getTime() - new Date(a).getTime()).map(cohortMonth => {
           const users = cohortUsers[cohortMonth];
           const initialSize = users.size;
           
           // Calculate retention for M1 to M5
           const retention = [0, 0, 0, 0, 0];
           
           const cohortStartDate = startOfMonth(new Date(cohortMonth));

           validOrders.forEach((o: any) => {
              if (!o.customer) return;
              const uid = o.customer.customerId;
              if (users.has(uid)) {
                 const orderDate = new Date(o.createdAt);
                 const diffMonths = differenceInMonths(orderDate, cohortStartDate);
                 if (diffMonths > 0 && diffMonths <= 5) {
                    retention[diffMonths - 1]++;
                 }
              }
           });

           return {
              month: cohortMonth,
              size: initialSize,
              retention: retention.map(r => initialSize > 0 ? (r / initialSize) * 100 : 0)
           };
        });

        setCohorts(cohortMatrix);

      } catch (err) {
        console.error("Failed to load analytics:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const getHeatmapColor = (amount: number) => {
     if (amount === 0) return "bg-black/5";
     if (amount < 5000) return "bg-[#e8c875]/40";
     if (amount < 20000) return "bg-[#e8c875]/70";
     if (amount < 50000) return "bg-[#CDA63F]";
     return "bg-[#1a3326]";
  };

  return (
    <div className="space-y-10 pb-20">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <h1 className="text-5xl font-heading text-[#1a3326] tracking-tight">Advanced Analytics</h1>
        <p className="text-charcoal/60 mt-3 text-lg font-medium tracking-wide">Deep dive into sales velocity and customer retention.</p>
      </motion.header>

      {/* Sales Heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 p-10 overflow-hidden"
      >
        <h2 className="text-2xl font-heading text-[#1a3326] mb-2">Sales Heatmap (Last 365 Days)</h2>
        <p className="text-sm text-charcoal/60 mb-8">Daily revenue intensity. Darker green indicates higher sales volume.</p>
        
        {loading ? (
           <div className="text-center py-10 text-charcoal/40">Loading heatmap...</div>
        ) : (
           <div className="overflow-x-auto pb-4 scrollbar-hide">
              <div className="flex flex-col gap-1 w-max">
                 {/* 7 rows for days of week */}
                 {Array.from({ length: 7 }).map((_, dayOfWeek) => (
                    <div key={dayOfWeek} className="flex gap-1">
                       {heatmap.filter((_, i) => (i % 7) === dayOfWeek).map((d, i) => (
                          <div 
                             key={i} 
                             className={`w-3 h-3 rounded-sm ${getHeatmapColor(d.amount)}`}
                             title={`${d.date}: ${formatINR(d.amount)}`}
                          />
                       ))}
                    </div>
                 ))}
              </div>
           </div>
        )}
      </motion.div>

      {/* Cohort Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 p-10 overflow-hidden"
      >
        <h2 className="text-2xl font-heading text-[#1a3326] mb-2">Customer Retention Cohorts</h2>
        <p className="text-sm text-charcoal/60 mb-8">Percentage of customers who return to make a purchase in subsequent months.</p>
        
        {loading ? (
           <div className="text-center py-10 text-charcoal/40">Loading cohorts...</div>
        ) : cohorts.length === 0 ? (
           <div className="text-center py-10 text-charcoal/40">Not enough data for cohorts.</div>
        ) : (
           <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                 <thead>
                    <tr className="border-b border-black/10 text-charcoal/60">
                       <th className="py-3 font-semibold">Cohort Month</th>
                       <th className="py-3 font-semibold">Total Users</th>
                       <th className="py-3 font-semibold text-center">Month 1</th>
                       <th className="py-3 font-semibold text-center">Month 2</th>
                       <th className="py-3 font-semibold text-center">Month 3</th>
                       <th className="py-3 font-semibold text-center">Month 4</th>
                       <th className="py-3 font-semibold text-center">Month 5</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-black/5">
                    {cohorts.map((c) => (
                       <tr key={c.month} className="hover:bg-white/40 transition-colors">
                          <td className="py-4 font-medium text-[#1a3326]">{c.month}</td>
                          <td className="py-4 text-charcoal">{c.size}</td>
                          {c.retention.map((r: number, i: number) => (
                             <td key={i} className="py-4 text-center">
                                <div className={`inline-flex items-center justify-center w-12 h-8 rounded ${r > 0 ? 'bg-[#1a3326] text-white font-bold' : 'bg-black/5 text-charcoal/40'}`}>
                                   {r > 0 ? `${r.toFixed(0)}%` : '-'}
                                </div>
                             </td>
                          ))}
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        )}
      </motion.div>
    </div>
  );
}
