import { useState } from "react";
import { Navigate, Link } from "react-router";
import { useAuthStore } from "@/store/useAuthStore";
import { ArrowLeft, Plus } from "lucide-react";
import { toast } from "sonner";
import { updateProfile } from "@/lib/profile";

export default function Addresses() {
  const { user, updateUser } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    addressStreet: "",
    addressCity: "",
    addressState: "",
    addressZip: "",
  });

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const openEditor = () => {
    setForm({
      addressStreet: user.addressStreet || "",
      addressCity: user.addressCity || "",
      addressState: user.addressState || "",
      addressZip: user.addressZip || "",
    });
    setEditing(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(user.id, form);
      updateUser(form);
      toast.success("Address saved");
      setEditing(false);
    } catch (err: any) {
      toast.error(err?.message || "Could not save address");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full p-3 border border-border outline-none focus:border-forest text-sm font-body";

  return (
    <div className="min-h-screen bg-ivory pt-8 pb-24">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-charcoal/50 hover:text-forest transition-colors mb-4"
          >
            <ArrowLeft size={14} /> Your Account
          </Link>
          <h1 className="text-3xl sm:text-4xl font-serif text-forest">Your Addresses</h1>
        </div>

        {editing ? (
          <form onSubmit={save} className="bg-white border border-border p-8 max-w-2xl space-y-6">
            <h2 className="text-xl font-serif text-forest">
              {user.addressStreet ? "Edit Address" : "Add Address"}
            </h2>
            <div>
              <label className="block text-xs uppercase tracking-widest font-bold text-forest mb-2">Street Address</label>
              <input
                required
                value={form.addressStreet}
                onChange={(e) => setForm({ ...form, addressStreet: e.target.value })}
                className={inputClass}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-widest font-bold text-forest mb-2">City</label>
                <input
                  required
                  value={form.addressCity}
                  onChange={(e) => setForm({ ...form, addressCity: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest font-bold text-forest mb-2">State</label>
                <input
                  required
                  value={form.addressState}
                  onChange={(e) => setForm({ ...form, addressState: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest font-bold text-forest mb-2">PIN Code</label>
                <input
                  required
                  value={form.addressZip}
                  onChange={(e) => setForm({ ...form, addressZip: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>
            <div className="flex gap-4 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="bg-forest text-ivory px-8 py-3 uppercase tracking-[0.15em] font-bold text-xs hover:bg-gold transition-colors disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save Address"}
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="border border-charcoal/20 text-charcoal/60 px-8 py-3 uppercase tracking-[0.15em] font-bold text-xs hover:bg-charcoal/5 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Add New Address Card */}
            <button
              onClick={openEditor}
              className="h-[250px] border-2 border-dashed border-charcoal/20 hover:border-forest flex flex-col items-center justify-center text-charcoal/50 hover:text-forest transition-colors bg-white/50"
            >
              <Plus size={48} strokeWidth={1} className="mb-4" />
              <span className="text-sm font-bold uppercase tracking-widest font-body">
                {user.addressStreet ? "Edit Address" : "Add Address"}
              </span>
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
                  <button
                    onClick={openEditor}
                    className="text-forest text-xs font-bold uppercase tracking-widest hover:text-gold transition-colors"
                  >
                    Edit
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
