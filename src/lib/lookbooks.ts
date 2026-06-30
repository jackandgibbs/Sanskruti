import { supabase } from "@/lib/supabase";
import type { Product } from "@/data/site";

export interface Lookbook {
  id: string;
  name: string;
  items: Product[];
  createdAt: number;
}

/** All of a user's lookbooks with their item snapshots (default first). */
export async function fetchLookbooks(userId: string): Promise<Lookbook[]> {
  const { data, error } = await supabase
    .from("lookbooks")
    .select("id, name, created_at, lookbook_items(product, created_at)")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });
  if (error) throw error;

  return (data ?? []).map((lb: any) => ({
    id: lb.id,
    name: lb.name,
    createdAt: new Date(lb.created_at).getTime(),
    items: (lb.lookbook_items ?? [])
      .sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      .map((it: any) => it.product as Product),
  }));
}

/** Make sure the user always has at least the "My Favorites" lookbook. */
export async function ensureDefaultLookbook(userId: string) {
  const { count, error } = await supabase
    .from("lookbooks")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);
  if (error) throw error;
  if (!count) {
    await supabase.from("lookbooks").insert({ user_id: userId, name: "My Favorites" });
  }
}

export async function createLookbook(userId: string, name: string): Promise<string> {
  const { data, error } = await supabase
    .from("lookbooks")
    .insert({ user_id: userId, name })
    .select("id")
    .single();
  if (error) throw error;
  return data.id as string;
}

export async function deleteLookbook(id: string) {
  const { error } = await supabase.from("lookbooks").delete().eq("id", id);
  if (error) throw error;
}

export async function addLookbookItem(lookbookId: string, product: Product) {
  const { error } = await supabase
    .from("lookbook_items")
    .upsert(
      { lookbook_id: lookbookId, product_id: product.id, product },
      { onConflict: "lookbook_id,product_id" }
    );
  if (error) throw error;
}

export async function removeLookbookItem(lookbookId: string, productId: string) {
  const { error } = await supabase
    .from("lookbook_items")
    .delete()
    .eq("lookbook_id", lookbookId)
    .eq("product_id", productId);
  if (error) throw error;
}
