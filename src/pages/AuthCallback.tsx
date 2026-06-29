import { useEffect } from "react";
import { useNavigate } from "react-router";
import { supabase } from "@/lib/supabase";

// Landing page for the Google OAuth redirect. supabase-js (detectSessionInUrl)
// finalizes the session automatically; we just wait for it, then go home.
export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) navigate("/", { replace: true });
    });

    // Fallback in case the event already fired before this mounted.
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/", { replace: true });
    });

    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-ivory">
      <p className="text-forest uppercase tracking-widest text-sm font-bold animate-pulse">
        Signing you in…
      </p>
    </div>
  );
}
