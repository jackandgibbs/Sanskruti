import { Link, Navigate } from "react-router";
import { useAuthStore } from "@/store/useAuthStore";
import { useLookbookStore } from "@/store/useLookbookStore";
import { ArrowLeft, Trash2, Library, X } from "lucide-react";
import { toast } from "sonner";

export default function Lookbooks() {
  const { user } = useAuthStore();
  const { lookbooks, deleteLookbook, removeItemFromLookbook } = useLookbookStore();

  if (!user) {
    return <Navigate to="/auth" state={{ from: { pathname: "/dashboard/lookbooks" } }} replace />;
  }

  const handleDeleteLookbook = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete the lookbook "${name}"?`)) {
      deleteLookbook(id);
      toast.success("Lookbook deleted");
    }
  };

  return (
    <div className="min-h-screen bg-ivory pt-8 pb-24">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-10">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-charcoal/50 hover:text-forest transition-colors mb-4">
            <ArrowLeft size={14} /> Your Account
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <h1 className="text-3xl sm:text-4xl font-serif text-forest flex items-center gap-3">
              <Library className="text-gold" /> Your Lookbooks
            </h1>
            <p className="text-sm text-charcoal/60 font-body">Curate your perfect ethnic wardrobe.</p>
          </div>
        </div>

        {lookbooks.length === 0 ? (
          <div className="bg-white p-12 text-center border border-border">
            <Library className="mx-auto text-charcoal/20 mb-4" size={48} strokeWidth={1} />
            <p className="text-forest font-serif text-xl mb-4">You haven't created any Lookbooks yet.</p>
            <p className="text-charcoal/60 mb-6 text-sm">Save your favorite pieces while you shop to build collections.</p>
            <Link to="/new-arrivals" className="text-xs uppercase tracking-widest font-bold border-b border-gold hover:text-gold transition-colors pb-1">
              Explore Collections
            </Link>
          </div>
        ) : (
          <div className="space-y-12">
            {lookbooks.map((lb) => (
              <div key={lb.id} className="bg-white border border-border overflow-hidden">
                <div className="p-6 border-b border-border bg-[#fbf9f4] flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-serif text-forest">{lb.name}</h2>
                    <p className="text-xs text-charcoal/50 uppercase tracking-widest mt-1 font-bold">{lb.items.length} items</p>
                  </div>
                  {lb.id !== 'default-wishlist' && (
                    <button 
                      onClick={() => handleDeleteLookbook(lb.id, lb.name)}
                      className="text-charcoal/40 hover:text-red-500 transition-colors p-2"
                      title="Delete Lookbook"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
                
                <div className="p-6">
                  {lb.items.length === 0 ? (
                    <p className="text-sm text-charcoal/40 italic py-8 text-center font-body">This lookbook is currently empty.</p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                      {lb.items.map((item) => (
                        <div key={item.id} className="group relative">
                          <Link to={`/product/${item.id}`} className="block relative aspect-[3/4] overflow-hidden bg-ivory mb-3">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Link>
                          
                          <button
                            onClick={() => removeItemFromLookbook(lb.id, item.id)}
                            className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-charcoal/60 hover:text-red-500 hover:shadow-md opacity-0 group-hover:opacity-100 transition-all z-10"
                            title="Remove item"
                          >
                            <X size={16} />
                          </button>
                          
                          <div>
                            <Link to={`/product/${item.id}`} className="block text-sm font-bold text-forest hover:text-gold truncate font-body">
                              {item.name}
                            </Link>
                            <p className="text-xs font-semibold mt-1">₹{item.price.toLocaleString('en-IN')}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
