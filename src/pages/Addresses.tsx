import { Navigate, Link } from "react-router";
import { useAuthStore } from "@/store/useAuthStore";
import { ArrowLeft, Plus } from "lucide-react";

export default function Addresses() {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-ivory pt-8 pb-24">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-charcoal/50 hover:text-forest transition-colors mb-4">
            <ArrowLeft size={14} /> Your Account
          </Link>
          <h1 className="text-3xl sm:text-4xl font-serif text-forest">Your Addresses</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Add New Address Card */}
          <button className="h-[250px] border-2 border-dashed border-charcoal/20 hover:border-forest flex flex-col items-center justify-center text-charcoal/50 hover:text-forest transition-colors bg-white/50">
            <Plus size={48} strokeWidth={1} className="mb-4" />
            <span className="text-sm font-bold uppercase tracking-widest font-body">Add Address</span>
          </button>

          {/* Default Address Card */}
          {user.addressStreet && (
            <div className="h-[250px] bg-white border border-border p-6 flex flex-col relative shadow-sm">
              <div className="absolute top-0 left-0 w-full h-1 bg-forest"></div>
              <p className="text-xs text-charcoal/50 uppercase tracking-widest mb-4 font-bold border-b border-border pb-2">Default</p>
              
              <div className="flex-1 text-charcoal font-body text-sm space-y-1">
                <p className="font-bold text-base mb-2">{user.firstName} {user.lastName}</p>
                <p>{user.addressStreet}</p>
                <p>{user.addressCity}, {user.addressState} {user.addressZip}</p>
                <p className="mt-4 text-charcoal/60">Phone number: +91 {user.phone}</p>
              </div>

              <div className="flex gap-4 pt-4 border-t border-border mt-auto">
                <button className="text-forest text-xs font-bold uppercase tracking-widest hover:text-gold transition-colors">Edit</button>
                <button className="text-charcoal/50 text-xs font-bold uppercase tracking-widest hover:text-red-500 transition-colors">Remove</button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
