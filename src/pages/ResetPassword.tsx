import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import Logo from "@/components/Logo";
import { useSeo } from "@/lib/seo";

// Landing page for the password-reset email link. Supabase puts a recovery
// session in the URL (detectSessionInUrl), so the user can set a new password.
export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const [ready, setReady] = useState(false);

  useSeo({ title: "Reset Password" });

  useEffect(() => {
    // Confirm we actually arrived from a recovery link.
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) return toast.error("Password must be at least 6 characters");
    if (password !== confirm) return toast.error("Passwords do not match");

    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Password updated. You're all set!");
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      toast.error(err?.message || "Could not update password");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ivory p-6">
      <div className="w-full max-w-[420px]">
        <div className="mb-8 text-center">
          <Logo tone="forest" />
          <h1 className="text-3xl font-serif text-forest mt-6 mb-2">Set a New Password</h1>
          <p className="text-charcoal/60 text-sm font-body">
            {ready ? "Choose a new password for your account." : "Open this page from the reset link in your email."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-widest font-bold text-forest mb-2">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full p-3 border border-border outline-none focus:border-forest text-sm font-body"
              required
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest font-bold text-forest mb-2">Confirm Password</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full p-3 border border-border outline-none focus:border-forest text-sm font-body"
              required
            />
          </div>
          <button
            type="submit"
            disabled={saving || !ready}
            className="w-full h-14 bg-forest text-ivory uppercase tracking-[0.2em] text-xs font-bold hover:bg-gold transition-colors disabled:opacity-50"
          >
            {saving ? "Saving…" : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
