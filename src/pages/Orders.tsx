import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router";
import { useAuthStore } from "@/store/useAuthStore";
import { Package, Clock, ArrowLeft } from "lucide-react";
import { PRODUCTS } from "@/data/site"; 

export default function Orders() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    const fetchOrders = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/orders/user/${user.id}`);
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrders();
  }, [user]);

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const getProductImage = (productId: string) => {
    const product = PRODUCTS.find(p => p.id === productId);
    return product?.image || "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400";
  };

  const getProductName = (productId: string) => {
    const product = PRODUCTS.find(p => p.id === productId);
    return product?.name || "Premium Product";
  };

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
                    <span className="inline-flex items-center gap-1.5 bg-forest/5 text-forest px-3 py-1 text-xs font-bold uppercase tracking-widest">
                      <Clock size={12} /> {order.status}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex gap-4">
                      <img src={getProductImage(item.productId)} alt="" className="w-16 h-20 object-cover" />
                      <div>
                        <p className="text-sm font-bold text-forest mb-1 font-body">{getProductName(item.productId)}</p>
                        <p className="text-xs text-charcoal/60 uppercase tracking-widest mb-1 font-bold">Qty: {item.quantity}</p>
                        <p className="text-sm font-semibold font-body">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
