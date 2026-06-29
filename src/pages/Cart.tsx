import { Link, Navigate } from "react-router";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Trash2, Minus, Plus, ArrowRight } from "lucide-react";
import EmptyCartSVG from "@/components/ui/EmptyCartSVG";

export default function Cart() {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();
  const { user, initialized } = useAuthStore();

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory">
        <p className="text-charcoal/50 font-medium tracking-wide">Loading account...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: { pathname: "/cart" } }} replace />;
  }

  const subtotal = getTotal();
  const tax = subtotal * 0.12; // Mock 12% GST
  const total = subtotal + tax;

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#fbf9f4] text-center px-4 pt-10 pb-20">
        <EmptyCartSVG className="w-48 md:w-56 h-auto mb-6 opacity-90" />
        <h1 className="text-3xl font-heading text-[#2a513d] mb-4">Your wardrobe is feeling a bit empty!</h1>
        <p className="text-charcoal/60 mb-8 font-body max-w-md">Let's find you a beautiful new Saree to add to your collection.</p>
        <Link to="/new-arrivals" className="bg-[#2a513d] text-ivory px-8 py-4 uppercase tracking-[0.15em] font-bold text-sm hover:bg-gold transition-colors shadow-lg">
          Shop New Arrivals
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory pt-10 pb-24">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-10">
        <h1 className="text-4xl font-serif text-forest mb-10">Shopping Bag</h1>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Cart Items */}
          <div className="flex-1">
            <div className="border-t border-border">
              {items.map((item) => (
                <div key={`${item.productId}-${item.size}`} className="flex gap-6 py-6 border-b border-border">
                  <div className="w-24 h-32 flex-none bg-white">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <Link to={`/product/${item.productId}`} className="text-lg font-serif text-forest hover:text-gold transition-colors">
                          {item.name}
                        </Link>
                        {item.size && (
                          <p className="text-xs text-charcoal/60 uppercase tracking-widest mt-1 font-body">Size: {item.size}</p>
                        )}
                      </div>
                      <span className="font-semibold text-charcoal font-body">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex justify-between items-end">
                      <div className="flex items-center border border-border">
                        <button 
                          onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-charcoal/60 hover:text-forest transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-charcoal/60 hover:text-forest transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => removeItem(item.productId, item.size)}
                        className="text-xs text-charcoal/60 uppercase tracking-widest hover:text-red-500 transition-colors flex items-center gap-1"
                      >
                        <Trash2 size={14} /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-[400px] flex-none">
            <div className="bg-white p-8 shadow-sm">
              <h2 className="text-lg font-bold uppercase tracking-widest text-forest mb-6 font-body border-b border-border pb-4">Order Summary</h2>
              
              <div className="space-y-4 text-sm text-charcoal/80 mb-6 font-body">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-forest uppercase tracking-wider text-xs font-bold">Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax (12%)</span>
                  <span>₹{tax.toLocaleString('en-IN')}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center text-xl font-serif text-forest mb-8 border-t border-border pt-6">
                <span>Total</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
              
              <Link to="/checkout" className="w-full h-14 bg-forest text-ivory uppercase tracking-[0.2em] font-bold text-sm hover:bg-gold transition-colors flex items-center justify-center gap-2">
                Checkout <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
