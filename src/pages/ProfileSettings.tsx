import { Navigate, Link } from "react-router";
import { useAuthStore } from "@/store/useAuthStore";
import { ArrowLeft } from "lucide-react";

export default function ProfileSettings() {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-ivory pt-8 pb-24">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-charcoal/50 hover:text-forest transition-colors mb-4">
            <ArrowLeft size={14} /> Your Account
          </Link>
          <h1 className="text-3xl sm:text-4xl font-serif text-forest">Login & Security</h1>
        </div>

        <div className="bg-white border border-border">
          <div className="p-6 border-b border-border flex justify-between items-center">
            <div>
              <p className="text-xs text-charcoal/50 uppercase tracking-widest mb-1 font-bold">Name</p>
              <p className="text-charcoal font-body">{user.firstName} {user.lastName}</p>
            </div>
            <button className="bg-transparent border border-forest text-forest px-4 py-2 text-xs uppercase tracking-widest font-bold hover:bg-forest/5 transition-colors">
              Edit
            </button>
          </div>
          
          <div className="p-6 border-b border-border flex justify-between items-center">
            <div>
              <p className="text-xs text-charcoal/50 uppercase tracking-widest mb-1 font-bold">Mobile Phone Number</p>
              <p className="text-charcoal font-body">+91 {user.phone}</p>
            </div>
            <button className="bg-transparent border border-forest text-forest px-4 py-2 text-xs uppercase tracking-widest font-bold hover:bg-forest/5 transition-colors">
              Edit
            </button>
          </div>

          <div className="p-6 flex justify-between items-center">
            <div>
              <p className="text-xs text-charcoal/50 uppercase tracking-widest mb-1 font-bold">Gender</p>
              <p className="text-charcoal font-body">{user.gender || "Not specified"}</p>
            </div>
            <button className="bg-transparent border border-forest text-forest px-4 py-2 text-xs uppercase tracking-widest font-bold hover:bg-forest/5 transition-colors">
              Edit
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
