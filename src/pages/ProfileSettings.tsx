import { useState } from "react";
import { Navigate, Link } from "react-router";
import { useAuthStore } from "@/store/useAuthStore";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { updateProfile } from "@/lib/profile";

export default function ProfileSettings() {
  const { user, updateUser, initialized } = useAuthStore();
  const [editing, setEditing] = useState<null | "phone" | "gender">(null);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);

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

  const startEdit = (field: "phone" | "gender") => {
    setEditing(field);
    setDraft((user[field] as string) || "");
  };

  const save = async (field: "phone" | "gender") => {
    setSaving(true);
    try {
      await updateProfile(user.id, { [field]: draft } as any);
      updateUser({ [field]: draft } as any);
      toast.success("Saved");
      setEditing(null);
    } catch (err: any) {
      toast.error(err?.message || "Could not save");
    } finally {
      setSaving(false);
    }
  };

  const EditButton = ({ field }: { field: "phone" | "gender" }) =>
    editing === field ? null : (
      <button
        onClick={() => startEdit(field)}
        className="bg-transparent border border-forest text-forest px-4 py-2 text-xs uppercase tracking-widest font-bold hover:bg-forest/5 transition-colors"
      >
        Edit
      </button>
    );

  return (
    <div className="min-h-screen bg-ivory pt-8 pb-24">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-charcoal/50 hover:text-forest transition-colors mb-4"
          >
            <ArrowLeft size={14} /> Your Account
          </Link>
          <h1 className="text-3xl sm:text-4xl font-serif text-forest">Login & Security</h1>
        </div>

        <div className="bg-white border border-border">
          {/* Name (read-only) */}
          <div className="p-6 border-b border-border flex justify-between items-center">
            <div>
              <p className="text-xs text-charcoal/50 uppercase tracking-widest mb-1 font-bold">Name</p>
              <p className="text-charcoal font-body">
                {user.firstName} {user.lastName}
              </p>
            </div>
          </div>

          {/* Username + email (read-only) */}
          <div className="p-6 border-b border-border">
            <p className="text-xs text-charcoal/50 uppercase tracking-widest mb-1 font-bold">Username</p>
            <p className="text-charcoal font-body mb-4">{user.username || "—"}</p>
            <p className="text-xs text-charcoal/50 uppercase tracking-widest mb-1 font-bold">Email</p>
            <p className="text-charcoal font-body">{user.email || "—"}</p>
          </div>

          {/* Phone (editable) */}
          <div className="p-6 border-b border-border flex justify-between items-center gap-4">
            <div className="flex-1">
              <p className="text-xs text-charcoal/50 uppercase tracking-widest mb-1 font-bold">Mobile Phone Number</p>
              {editing === "phone" ? (
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  className="w-full max-w-xs p-2 border border-border outline-none focus:border-forest text-sm font-body"
                  placeholder="10 digit number"
                  autoFocus
                />
              ) : (
                <p className="text-charcoal font-body">+91 {user.phone || "—"}</p>
              )}
            </div>
            {editing === "phone" ? (
              <SaveCancel saving={saving} onSave={() => save("phone")} onCancel={() => setEditing(null)} />
            ) : (
              <EditButton field="phone" />
            )}
          </div>

          {/* Gender (editable) */}
          <div className="p-6 flex justify-between items-center gap-4">
            <div className="flex-1">
              <p className="text-xs text-charcoal/50 uppercase tracking-widest mb-1 font-bold">Gender</p>
              {editing === "gender" ? (
                <select
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  className="w-full max-w-xs p-2 border border-border outline-none focus:border-forest text-sm font-body bg-white"
                  autoFocus
                >
                  <option value="">Not specified</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <p className="text-charcoal font-body">{user.gender || "Not specified"}</p>
              )}
            </div>
            {editing === "gender" ? (
              <SaveCancel saving={saving} onSave={() => save("gender")} onCancel={() => setEditing(null)} />
            ) : (
              <EditButton field="gender" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SaveCancel({
  saving,
  onSave,
  onCancel,
}: {
  saving: boolean;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="flex gap-2">
      <button
        onClick={onSave}
        disabled={saving}
        className="bg-forest text-ivory px-4 py-2 text-xs uppercase tracking-widest font-bold hover:bg-gold transition-colors disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save"}
      </button>
      <button
        onClick={onCancel}
        className="bg-transparent border border-charcoal/20 text-charcoal/60 px-4 py-2 text-xs uppercase tracking-widest font-bold hover:bg-charcoal/5 transition-colors"
      >
        Cancel
      </button>
    </div>
  );
}
