import { supabase } from "@/lib/supabase";

export type CartLine = {
  productId: string;
  quantity: number;
  price: number;
  name?: string;
  image?: string;
};

/**
 * Create an order plus its line items. order_items store a snapshot of each
 * product (name/image/price) so the record is stable even though the public
 * storefront serves mock products with no matching `products` row.
 */
export async function createOrder(params: {
  userId: string;
  totalAmount: number;
  items: CartLine[];
}) {
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({ user_id: params.userId, total_amount: params.totalAmount })
    .select()
    .single();
  if (orderError) throw orderError;

  const rows = params.items.map((i) => ({
    order_id: order.id,
    product_id: i.productId,
    name: i.name ?? null,
    image: i.image ?? null,
    price: i.price,
    quantity: i.quantity,
  }));

  const { error: itemsError } = await supabase.from("order_items").insert(rows);
  if (itemsError) throw itemsError;

  return order;
}

/** Fetch a user's orders (newest first) with their line items, mapped to camelCase. */
export async function fetchUserOrders(userId: string) {
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;

  return (data ?? []).map((o: any) => ({
    id: o.id,
    status: o.status,
    totalAmount: o.total_amount,
    createdAt: o.created_at,
    items: (o.order_items ?? []).map((it: any) => ({
      id: it.id,
      productId: it.product_id,
      name: it.name,
      image: it.image,
      price: it.price,
      quantity: it.quantity,
    })),
  }));
}
