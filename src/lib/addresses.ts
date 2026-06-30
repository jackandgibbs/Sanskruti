import { supabase } from "@/lib/supabase";

export type Address = {
  id: string;
  label?: string;
  fullName?: string;
  phone?: string;
  street: string;
  city?: string;
  state?: string;
  zip?: string;
  isDefault: boolean;
};

function mapAddress(r: any): Address {
  return {
    id: r.id,
    label: r.label ?? undefined,
    fullName: r.full_name ?? undefined,
    phone: r.phone ?? undefined,
    street: r.street,
    city: r.city ?? undefined,
    state: r.state ?? undefined,
    zip: r.zip ?? undefined,
    isDefault: r.is_default,
  };
}

export async function fetchAddresses(userId: string): Promise<Address[]> {
  const { data, error } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", userId)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapAddress);
}

type AddressInput = Omit<Address, "id" | "isDefault"> & { isDefault?: boolean };

export async function saveAddress(userId: string, input: AddressInput, id?: string) {
  const row = {
    user_id: userId,
    label: input.label ?? null,
    full_name: input.fullName ?? null,
    phone: input.phone ?? null,
    street: input.street,
    city: input.city ?? null,
    state: input.state ?? null,
    zip: input.zip ?? null,
    is_default: input.isDefault ?? false,
  };

  // Only one default per user.
  if (row.is_default) {
    await supabase.from("addresses").update({ is_default: false }).eq("user_id", userId);
  }

  if (id) {
    const { error } = await supabase.from("addresses").update(row).eq("id", id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("addresses").insert(row);
    if (error) throw error;
  }
}

export async function deleteAddress(id: string) {
  const { error } = await supabase.from("addresses").delete().eq("id", id);
  if (error) throw error;
}

export async function setDefaultAddress(userId: string, id: string) {
  await supabase.from("addresses").update({ is_default: false }).eq("user_id", userId);
  const { error } = await supabase.from("addresses").update({ is_default: true }).eq("id", id);
  if (error) throw error;
}
