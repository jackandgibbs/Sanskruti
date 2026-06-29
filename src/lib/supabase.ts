import { createClient } from "@supabase/supabase-js";

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string)?.trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string)?.trim();

/** True only when both env vars are present and look real (not the placeholders). */
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith("http") &&
    !supabaseUrl.includes("YOUR-PROJECT-REF")
);

if (!isSupabaseConfigured) {
  // Surfaced loudly in dev so a missing/stale .env doesn't fail silently later.
  console.error(
    "[supabase] Missing or placeholder VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. " +
      "Fill them in .env and RESTART the dev server (Vite only reads .env at startup). See SETUP.md."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true, // needed to finish the Google OAuth redirect
  },
});
