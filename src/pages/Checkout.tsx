import { useState } from "react";
import { useNavigate, Navigate } from "react-router";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { CheckCircle2, ChevronRight, Lock } from "lucide-react";
import { toast } from "sonner";
import { createOrder } from "@/lib/orders";

export default function Checkout() {
  const { items, getTotal, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [step, setStep] = useState<"address" | "payment" | "success">("address");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState("");

  const [address, setAddress] = useState({
    street: user?.addressStreet || "",
    city: user?.addressCity || "",
    state: user?.addressState || "",
    zip: user?.addressZip || "",
  });

  const subtotal = getTotal();
  const tax = subtotal * 0.12;
  const totalAmount = subtotal + tax;

  if (!user) {
    return <Navigate to="/auth" state={{ from: { pathname: "/checkout" } }} replace />;
  }

  if (items.length === 0 && step !== "success") {
    return <Navigate to="/cart" replace />;
  }

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("payment");
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const order = await createOrder({
        userId: user.id,
        totalAmount,
        items: items.map(i => ({
          productId: i.productId,
          quantity: i.quantity,
          price: i.price,
          name: i.name,
          image: i.image,
        })),
      });

      setOrderId(order.id);
      toast.success("Order placed successfully!");
      clearCart();
      navigate("/dashboard/orders");
    } catch (err: any) {
      toast.error(err?.message || "Failed to place order.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (step === "success") {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-ivory text-center px-4">
        <CheckCircle2 className="text-forest mb-6" size={64} strokeWidth={1} />
        <h1 className="text-3xl font-serif text-forest mb-2">Order Confirmed!</h1>
        <p className="text-charcoal/60 mb-2">Thank you for your purchase, {user.firstName}.</p>
        <p className="text-charcoal/60 mb-8 font-mono text-sm">Order ID: {orderId}</p>
        <button 
          onClick={() => navigate("/")}
          className="bg-forest text-ivory px-8 py-4 uppercase tracking-[0.15em] font-bold text-sm hover:bg-gold transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory pt-8 pb-24">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-10">
        
        {/* Checkout Header */}
        <div className="flex items-center justify-center gap-4 mb-12 border-b border-border pb-6">
          <div className={`flex items-center gap-2 ${step === "address" ? "text-forest" : "text-charcoal/40"} font-bold uppercase tracking-widest text-xs`}>
            <span className="w-6 h-6 rounded-full border flex items-center justify-center">1</span> Address
          </div>
          <ChevronRight size={16} className="text-charcoal/20" />
          <div className={`flex items-center gap-2 ${step === "payment" ? "text-forest" : "text-charcoal/40"} font-bold uppercase tracking-widest text-xs`}>
            <span className="w-6 h-6 rounded-full border flex items-center justify-center">2</span> Payment
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Main Form Area */}
          <div className="flex-1 bg-white p-8 shadow-sm">
            {step === "address" && (
              <form onSubmit={handleAddressSubmit} className="space-y-6">
                <h2 className="text-xl font-serif text-forest mb-6">Shipping Address</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest font-bold text-forest mb-2">First Name</label>
                    <input type="text" value={user.firstName} disabled className="w-full p-3 border border-border bg-ivory text-charcoal/60 text-sm font-body" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest font-bold text-forest mb-2">Last Name</label>
                    <input type="text" value={user.lastName} disabled className="w-full p-3 border border-border bg-ivory text-charcoal/60 text-sm font-body" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest font-bold text-forest mb-2">Street Address</label>
                  <input type="text" required value={address.street} onChange={e => setAddress({...address, street: e.target.value})} className="w-full p-3 border border-border outline-none focus:border-forest text-sm font-body" />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1">
                    <label className="block text-xs uppercase tracking-widest font-bold text-forest mb-2">City</label>
                    <input type="text" required value={address.city} onChange={e => setAddress({...address, city: e.target.value})} className="w-full p-3 border border-border outline-none focus:border-forest text-sm font-body" />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs uppercase tracking-widest font-bold text-forest mb-2">State</label>
                    <input type="text" required value={address.state} onChange={e => setAddress({...address, state: e.target.value})} className="w-full p-3 border border-border outline-none focus:border-forest text-sm font-body" />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs uppercase tracking-widest font-bold text-forest mb-2">PIN Code</label>
                    <input type="text" required value={address.zip} onChange={e => setAddress({...address, zip: e.target.value})} className="w-full p-3 border border-border outline-none focus:border-forest text-sm font-body" />
                  </div>
                </div>

                <button type="submit" className="w-full h-14 bg-forest text-ivory uppercase tracking-[0.2em] font-bold text-sm hover:bg-gold transition-colors mt-8">
                  Continue to Payment
                </button>
              </form>
            )}

            {step === "payment" && (
              <form onSubmit={handlePaymentSubmit} className="space-y-6">
                <h2 className="text-xl font-serif text-forest mb-6 flex items-center gap-2">
                  <Lock size={18} /> Secure Payment
                </h2>
                <p className="text-sm text-charcoal/60 mb-6">This is a mock checkout. No real payment will be processed.</p>

                <div className="border border-forest p-4 bg-forest/5 mb-6">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="radio" name="payment" defaultChecked className="accent-forest w-4 h-4" />
                    <span className="text-sm font-bold text-forest">Cash on Delivery (COD)</span>
                  </label>
                </div>

                <div className="border border-border p-4 opacity-50 cursor-not-allowed">
                  <label className="flex items-center gap-3">
                    <input type="radio" name="payment" disabled className="w-4 h-4" />
                    <span className="text-sm font-bold text-charcoal">Credit / Debit Card</span>
                  </label>
                </div>

                <button 
                  type="submit" 
                  disabled={isProcessing}
                  className="w-full h-14 bg-forest text-ivory uppercase tracking-[0.2em] font-bold text-sm hover:bg-gold transition-colors mt-8 disabled:opacity-50"
                >
                  {isProcessing ? "Processing..." : `Place Order • ₹${totalAmount.toLocaleString('en-IN')}`}
                </button>
                <button 
                  type="button" 
                  onClick={() => setStep("address")}
                  className="w-full text-xs text-charcoal/60 uppercase tracking-widest hover:text-forest mt-4"
                >
                  Back to Address
                </button>
              </form>
            )}
          </div>

          {/* Mini Cart Summary */}
          <div className="w-full lg:w-[350px] flex-none">
            <div className="bg-white p-6 shadow-sm border border-border">
              <h3 className="text-sm font-bold uppercase tracking-widest text-forest mb-4 border-b border-border pb-2">Order Summary</h3>
              
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto scrollbar-hide">
                {items.map(item => (
                  <div key={`${item.productId}-${item.size}`} className="flex gap-4">
                    <img src={item.image} className="w-16 h-20 object-cover" alt="" />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-forest truncate">{item.name}</p>
                      <p className="text-xs text-charcoal/60">Qty: {item.quantity}</p>
                      <p className="text-xs font-semibold mt-1">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-sm text-charcoal/80 mb-4 border-t border-border pt-4">
                <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between"><span>Tax (12%)</span><span>₹{tax.toLocaleString('en-IN')}</span></div>
              </div>
              
              <div className="flex justify-between items-center text-lg font-bold text-forest border-t border-border pt-4">
                <span>Total</span>
                <span>₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
