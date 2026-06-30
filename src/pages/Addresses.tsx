import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router";
import { useAuthStore } from "@/store/useAuthStore";
import { ArrowLeft, Plus, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  fetchAddresses,
  saveAddress,
  deleteAddress,
  setDefaultAddress,
  type Address,
} from "@/lib/addresses";

const EMPTY = {
  label: "Home",
  fullName: "",
  phone: "",
  street: "",
  city: "",
  state: "",
  zip: "",
  isDefault: false,
};

export default function Addresses() {
  const { user, initialized } = useAuthStore();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(EMPTY);

  const load = () => {
    if (!user) return;
    fetchAddresses(user.id)
      .then(setAddresses)
      .catch((err) => console.error("Failed to load addresses", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory">
        <p className="text-charcoal/50 font-medium tracking-wide">Loading account...</p>
      </div>
    );
  }
  if (!user) return <Navigate to="/auth" replace />;

  const startAdd = () => {
    setForm({ ...EMPTY, fullName: `${user.firstName} ${user.lastName}`.trim(), phone: user.phone || "", isDefault: addresses.length === 0 });
    setAdding(true);
    setEditingId(null);
  };

  const startEdit = (a: Address) => {
    setForm({
      label: a.label || "Home",
      fullName: a.fullName || "",
      phone: a.phone || "",
      street: a.street,
      city: a.city || "",
      state: a.state || "",
      zip: a.zip || "",
      isDefault: a.isDefault,
    });
    setEditingId(a.id);
    setAdding(false);
  };

  const closeForm = () => {
    setAdding(false);
    setEditingId(null);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveAddress(user.id, form, editingId ?? undefined);
      toast.success("Address saved");
      closeForm();
      load();
    } catch (err: any) {
      toast.error(err?.message || "Could not save address");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (a: Address) => {
    if (!confirm("Delete this address?")) return;
    try {
      await deleteAddress(a.id);
      toast.success("Address deleted");
      load();
    } catch (err: any) {
      toast.error(err?.message || "Could not delete");
    }
  };

  const makeDefault = async (a: Address) => {
    try {
      await setDefaultAddress(user.id, a.id);
      load();
    } catch (err: any) {
      toast.error(err?.message || "Could not update");
    }
  };

  const inputClass = "w-full p-3 border border-border outline-none focus:border-forest text-sm font-body";
  const showForm = adding || editingId !== null;

  return (
    <div className="min-h-screen bg-ivory pt-8 pb-24">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-charcoal/50 hover:text-forest transition-colors mb-4">
            <ArrowLeft size={14} /> Your Account
          </Link>
          <h1 className="text-3xl sm:text-4xl font-serif text-forest">Your Addresses</h1>
        </div>

        {showForm ? (
          <form onSubmit={submit} className="bg-white border border-border p-8 max-w-2xl space-y-6">
            <h2 className="text-xl font-serif text-forest">{editingId ? "Edit Address" : "Add Address"}</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-widest font-bold text-forest mb-2">Label</label>
                <input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} className={inputClass} placeholder="Home / Work" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest font-bold text-forest mb-2">Full Name</label>
                <input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className={inputClass} />
              </div>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest font-bold text-forest mb-2">Phone</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} placeholder="10 digit number" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest font-bold text-forest mb-2">Street Address</label>
              <input required value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} className={inputClass} />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-widest font-bold text-forest mb-2">City</label>
                <input required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest font-bold text-forest mb-2">State</label>
                <input required value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest font-bold text-forest mb-2">PIN Code</label>
                <input required value={form.zip} onChange={(e) => setForm({ ...form, zip: e.target.value })} className={inputClass} />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-charcoal/80 cursor-pointer">
              <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} className="accent-forest w-4 h-4" />
              Set as default address
            </label>
            <div className="flex gap-4 pt-2">
              <button type="submit" disabled={saving} className="bg-forest text-ivory px-8 py-3 uppercase tracking-[0.15em] font-bold text-xs hover:bg-gold transition-colors disabled:opacity-50">
                {saving ? "Saving…" : "Save Address"}
              </button>
              <button type="button" onClick={closeForm} className="border border-charcoal/20 text-charcoal/60 px-8 py-3 uppercase tracking-[0.15em] font-bold text-xs hover:bg-charcoal/5 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        ) : loading ? (
          <p className="text-charcoal/50">Loading addresses…</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <button
              onClick={startAdd}
              className="h-[250px] border-2 border-dashed border-charcoal/20 hover:border-forest flex flex-col items-center justify-center text-charcoal/50 hover:text-forest transition-colors bg-white/50"
            >
              <Plus size={48} strokeWidth={1} className="mb-4" />
              <span className="text-sm font-bold uppercase tracking-widest font-body">Add Address</span>
            </button>

            {addresses.map((a) => (
              <div key={a.id} className="h-[250px] bg-white border border-border p-6 flex flex-col relative shadow-sm">
                {a.isDefault && <div className="absolute top-0 left-0 w-full h-1 bg-forest" />}
                <div className="flex items-center justify-between mb-4 border-b border-border pb-2">
                  <p className="text-xs text-charcoal/50 uppercase tracking-widest font-bold">{a.label || "Address"}</p>
                  {a.isDefault && (
                    <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold text-forest">
                      <Star size={11} fill="currentColor" /> Default
                    </span>
                  )}
                </div>
                <div className="flex-1 text-charcoal font-body text-sm space-y-1">
                  <p className="font-bold text-base mb-2">{a.fullName || `${user.firstName} ${user.lastName}`}</p>
                  <p>{a.street}</p>
                  <p>{a.city}, {a.state} {a.zip}</p>
                  {a.phone && <p className="mt-3 text-charcoal/60">Phone: +91 {a.phone}</p>}
                </div>
                <div className="flex gap-4 pt-4 border-t border-border mt-auto text-xs font-bold uppercase tracking-widest">
                  <button onClick={() => startEdit(a)} className="text-forest hover:text-gold transition-colors">Edit</button>
                  {!a.isDefault && (
                    <button onClick={() => makeDefault(a)} className="text-charcoal/50 hover:text-forest transition-colors">Set default</button>
                  )}
                  <button onClick={() => remove(a)} className="ml-auto text-charcoal/40 hover:text-red-500 transition-colors" title="Delete">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
