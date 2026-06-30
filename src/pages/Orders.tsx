import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router";
import { useAuthStore } from "@/store/useAuthStore";
import { Package, ArrowLeft, Check } from "lucide-react";
import { useProductStore } from "@/store/useProductStore";
import { fetchUserOrders } from "@/lib/orders";

const FLOW = ["PENDING", "PAID", "SHIPPED", "DELIVERED"] as const;
const FLOW_LABELS: Record<string, string> = {
  PENDING: "Placed",
  PAID: "Confirmed",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
};

function OrderStatusStepper({ status, className = "" }: { status: string; className?: string }) {
  const current = Math.max(0, FLOW.indexOf(status as (typeof FLOW)[number]));
  return (
    <div className={`flex items-center ${className}`}>
      {FLOW.map((step, i) => {
        const done = i <= current;
        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  done ? "bg-forest text-ivory" : "bg-charcoal/10 text-charcoal/40"
                }`}
              >
                {done ? <Check size={14} strokeWidth={3} /> : i + 1}
              </div>
              <span className={`text-[10px] uppercase tracking-widest font-bold ${done ? "text-forest" : "text-charcoal/40"}`}>
                {FLOW_LABELS[step]}
              </span>
            </div>
            {i < FLOW.length - 1 && (
              <div className={`h-0.5 flex-1 mx-2 -mt-5 ${i < current ? "bg-forest" : "bg-charcoal/10"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function Orders() {
  const { user, initialized } = useAuthStore();
  const products = useProductStore((state) => state.products);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    fetchUserOrders(user.id)
      .then((data) => setOrders(data))
      .catch((err) => console.error("Failed to fetch orders", err))
      .finally(() => setIsLoading(false));
  }, [user?.id]);

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory">
        <p className="text-charcoal/50 font-medium tracking-wide">Loading account...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Prefer the snapshot stored on the order item; fall back to the mock catalog.
  const getProductImage = (item: any) =>
    item.image ||
    products.find((p) => p.id === item.productId)?.image ||
    "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400";

  const getProductName = (item: any) =>
    item.name ||
    products.find((p) => p.id === item.productId)?.name ||
    "Premium Product";

  return (
    <div className="min-h-screen bg-ivory pt-8 pb-24">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-charcoal/50 hover:text-forest transition-colors mb-4">
            <ArrowLeft size={14} /> Your Account
          </Link>
          <h1 className="text-3xl sm:text-4xl font-serif text-forest">Your Orders</h1>
        </div>

        {isLoading ? (
          <div className="py-20 text-center text-charcoal/60 uppercase tracking-widest text-sm font-bold">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="bg-white p-12 text-center border border-border">
            <Package className="mx-auto text-charcoal/20 mb-4" size={48} strokeWidth={1} />
            <p className="text-forest font-serif text-xl mb-4">You have no orders yet</p>
            <Link to="/new-arrivals" className="text-xs uppercase tracking-widest font-bold border-b border-gold hover:text-gold transition-colors pb-1">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order: any) => (
              <div key={order.id} className="bg-white border border-border p-6 shadow-sm">
                <div className="flex flex-wrap justify-between items-start gap-4 mb-6 pb-6 border-b border-border/50">
                  <div>
                    <p className="text-xs text-charcoal/50 uppercase tracking-widest mb-1 font-bold">Order ID</p>
                    <p className="font-mono text-sm">{order.id.split('-')[0].toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-charcoal/50 uppercase tracking-widest mb-1 font-bold">Date</p>
                    <p className="text-sm font-semibold font-body">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                  <div>
                    <p className="text-xs text-charcoal/50 uppercase tracking-widest mb-1 font-bold">Total</p>
                    <p className="text-sm font-semibold font-body">₹{order.totalAmount.toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <p className="text-xs text-charcoal/50 uppercase tracking-widest mb-1 font-bold">Status</p>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold uppercase tracking-widest ${
                      order.status === "CANCELLED" ? "bg-red-50 text-red-600" : "bg-forest/5 text-forest"
                    }`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current" /> {order.status}
                    </span>
                  </div>
                </div>
                
                {/* Status timeline */}
                {order.status === "CANCELLED" ? (
                  <div className="mb-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red-600">
                    <span className="w-2 h-2 rounded-full bg-red-500" /> Order Cancelled
                  </div>
                ) : (
                  <OrderStatusStepper status={order.status} className="mb-6" />
                )}

                <div className="space-y-4">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex gap-4">
                      <img src={getProductImage(item)} alt="" className="w-16 h-20 object-cover" />
                      <div>
                        <p className="text-sm font-bold text-forest mb-1 font-body">{getProductName(item)}</p>
                        {item.size && (
                          <p className="text-xs text-charcoal/60 uppercase tracking-widest mb-1 font-bold">Size: {item.size}</p>
                        )}
                        <p className="text-xs text-charcoal/60 uppercase tracking-widest mb-1 font-bold">Qty: {item.quantity}</p>
                        <p className="text-sm font-semibold font-body">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shipping + payment */}
                {(order.shipping?.street || order.paymentMethod) && (
                  <div className="mt-6 pt-6 border-t border-border/50 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-body">
                    {order.shipping?.street && (
                      <div>
                        <p className="text-xs text-charcoal/50 uppercase tracking-widest mb-1 font-bold">Shipping To</p>
                        <p className="text-charcoal/80">
                          {order.shipping.name && <>{order.shipping.name}<br /></>}
                          {order.shipping.street}<br />
                          {order.shipping.city}, {order.shipping.state} {order.shipping.zip}
                        </p>
                      </div>
                    )}
                    {order.paymentMethod && (
                      <div>
                        <p className="text-xs text-charcoal/50 uppercase tracking-widest mb-1 font-bold">Payment</p>
                        <p className="text-charcoal/80">
                          {order.paymentMethod === "COD" ? "Cash on Delivery" : order.paymentMethod}
                          {" • "}
                          <span className={order.paymentStatus === "PAID" ? "text-forest font-bold" : "text-amber-600 font-bold"}>
                            {order.paymentStatus}
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
