import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Plus, Heart, Check } from "lucide-react";
import { Product } from "@/data/site";
import { useLookbookStore } from "@/store/useLookbookStore";
import { toast } from "sonner";

interface SaveToLookbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

export default function SaveToLookbookModal({ isOpen, onClose, product }: SaveToLookbookModalProps) {
  const { lookbooks, createLookbook, addItemToLookbook, removeItemFromLookbook } = useLookbookStore();
  const [isCreating, setIsCreating] = useState(false);
  const [newLookbookName, setNewLookbookName] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newLookbookName.trim();
    if (!name) return;
    if (!createLookbook(name)) {
      toast.error("A lookbook with that name already exists.");
      return;
    }
    setNewLookbookName("");
    setIsCreating(false);
  };

  const handleToggleProduct = (lookbookId: string, isInLookbook: boolean) => {
    if (isInLookbook) {
      removeItemFromLookbook(lookbookId, product.id);
      toast.success("Removed from Lookbook");
    } else {
      addItemToLookbook(lookbookId, product);
      toast.success("Saved to Lookbook!");
      setTimeout(onClose, 800); // Close shortly after success
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-ivory shadow-2xl overflow-hidden rounded-xl border border-gold/20 flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border bg-white">
              <h2 className="text-xl font-serif text-forest flex items-center gap-2">
                <Heart size={20} className="text-gold" fill="currentColor" /> Save to Lookbook
              </h2>
              <button onClick={onClose} className="text-charcoal/40 hover:text-charcoal transition-colors">
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>

            {/* Product Preview */}
            <div className="p-6 bg-[#fbf9f4] flex gap-4 items-center border-b border-border">
              <img src={product.image} alt={product.name} className="w-16 h-20 object-cover rounded-md shadow-sm" />
              <div>
                <p className="font-bold text-forest text-sm font-body truncate max-w-[200px]">{product.name}</p>
                <p className="text-xs text-charcoal/60 uppercase tracking-widest mt-1">₹{product.price.toLocaleString('en-IN')}</p>
              </div>
            </div>

            {/* Lookbook List */}
            <div className="p-6 overflow-y-auto flex-1">
              <p className="text-xs font-bold uppercase tracking-widest text-charcoal/50 mb-4">Your Collections</p>
              
              <div className="space-y-2">
                {lookbooks.map(lb => {
                  const isInLookbook = lb.items.some(item => item.id === product.id);
                  return (
                    <button
                      key={lb.id}
                      onClick={() => handleToggleProduct(lb.id, isInLookbook)}
                      className={`w-full flex items-center justify-between p-4 border rounded-lg transition-all text-left ${
                        isInLookbook ? "border-forest bg-forest/5" : "border-border hover:border-gold/50 bg-white"
                      }`}
                    >
                      <div>
                        <p className={`font-semibold text-sm ${isInLookbook ? "text-forest" : "text-charcoal"}`}>{lb.name}</p>
                        <p className="text-xs text-charcoal/50 mt-0.5">{lb.items.length} items</p>
                      </div>
                      {isInLookbook && (
                        <div className="w-6 h-6 rounded-full bg-forest text-white flex items-center justify-center">
                          <Check size={14} strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Create New Lookbook */}
              <div className="mt-6 pt-6 border-t border-border">
                {!isCreating ? (
                  <button 
                    onClick={() => setIsCreating(true)}
                    className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-charcoal/20 rounded-lg text-charcoal/60 hover:text-forest hover:border-forest/50 transition-colors font-bold text-sm uppercase tracking-widest"
                  >
                    <Plus size={16} /> Create New Lookbook
                  </button>
                ) : (
                  <form onSubmit={handleCreate} className="flex gap-2">
                    <input 
                      type="text" 
                      autoFocus
                      required
                      placeholder="E.g., Diwali Outfits"
                      value={newLookbookName}
                      onChange={(e) => setNewLookbookName(e.target.value)}
                      className="flex-1 p-3 border border-border rounded-lg text-sm focus:border-forest focus:outline-none"
                    />
                    <button 
                      type="submit"
                      className="bg-forest text-ivory px-4 rounded-lg font-bold text-sm hover:bg-gold transition-colors"
                    >
                      Create
                    </button>
                  </form>
                )}
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
