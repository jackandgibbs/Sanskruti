import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

// Simple key/value store for storefront media URLs (hero video, heritage,
// festive banner) now that images live on Cloudinary instead of local files.

export async function getSetting(key: string): Promise<string | null> {
  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", key)
    .maybeSingle();
  if (error) {
    console.error("getSetting failed:", error);
    return null;
  }
  return data?.value ?? null;
}

export async function setSetting(key: string, value: string): Promise<void> {
  const { error } = await supabase
    .from("site_settings")
    .upsert({ key, value, updated_at: new Date().toISOString() });
  if (error) throw error;
}

/** React hook: returns the stored value for `key`, or `fallback` until loaded/if unset. */
export function useSetting(key: string, fallback: string): string {
  const [value, setValue] = useState(fallback);
  useEffect(() => {
    let active = true;
    getSetting(key).then((v) => {
      if (active && v) setValue(v);
    });
    return () => {
      active = false;
    };
  }, [key]);
  return value;
}
