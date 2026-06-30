import { supabase } from "@/lib/supabase";

// The admin forms and the storefront Product type use camelCase; the Supabase
// `products` table uses snake_case. These helpers map between the two so the
// UI code doesn't have to know about column naming.

const COLUMN_MAP: Record<string, string> = {
  id: "id",
  name: "name",
  description: "description",
  category: "category",
  sku: "sku",
  barcode: "barcode",
  price: "price",
  mrp: "mrp",
  costPrice: "cost_price",
  taxRate: "tax_rate",
  sizes: "sizes",
  color: "color",
  inStock: "in_stock",
  stockCount: "stock_count",
  fabric: "fabric",
  craftType: "craft_type",
  washCare: "wash_care",
  weightGrams: "weight_grams",
  dispatchDays: "dispatch_days",
  bestSeller: "best_seller",
  newArrival: "new_arrival",
  tags: "tags",
  metaTitle: "meta_title",
  metaDesc: "meta_desc",
  image: "image",
  hoverImage: "hover_image",
  galleryImages: "gallery_images",
  rating: "rating",
  reviews: "reviews",
};

const REVERSE_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(COLUMN_MAP).map(([camel, snake]) => [snake, camel])
);

/** snake_case DB row -> camelCase object used by the UI. */
export function rowToProduct(row: any): any {
  if (!row) return row;
  const out: any = {};
  for (const [snake, value] of Object.entries(row)) {
    out[REVERSE_MAP[snake] ?? snake] = value;
  }
  return out;
}

/** camelCase form data -> snake_case payload for insert/update. */
export function productToRow(data: any): any {
  const out: any = {};
  for (const [camel, value] of Object.entries(data)) {
    const col = COLUMN_MAP[camel];
    if (col && camel !== "id") out[col] = value; // never write id on insert/update
  }
  return out;
}

export async function fetchProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(rowToProduct);
}

export async function fetchProduct(id: string) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return rowToProduct(data);
}

export async function createProduct(data: any) {
  const { data: row, error } = await supabase
    .from("products")
    .insert(productToRow(data))
    .select()
    .single();
  if (error) throw error;
  return rowToProduct(row);
}

export async function updateProduct(id: string, data: any) {
  const { data: row, error } = await supabase
    .from("products")
    .update({ ...productToRow(data), updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return rowToProduct(row);
}

export async function deleteProduct(id: string) {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}
