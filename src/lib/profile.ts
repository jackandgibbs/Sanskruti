import { supabase } from "@/lib/supabase";
import type { User } from "@/store/useAuthStore";

// camelCase User fields -> snake_case profiles columns.
const COLUMN_MAP: Record<string, string> = {
  firstName: "first_name",
  lastName: "last_name",
  username: "username",
  dob: "dob",
  gender: "gender",
  phone: "phone",
  avatarUrl: "avatar_url",
  addressStreet: "address_street",
  addressCity: "address_city",
  addressState: "address_state",
  addressZip: "address_zip",
};

/** Persist a partial profile update to Supabase. Returns nothing; throws on error. */
export async function updateProfile(userId: string, patch: Partial<User>) {
  const row: any = { updated_at: new Date().toISOString() };
  for (const [camel, value] of Object.entries(patch)) {
    const col = COLUMN_MAP[camel];
    if (col) row[col] = value;
  }
  const { error } = await supabase.from("profiles").update(row).eq("id", userId);
  if (error) throw error;
}
