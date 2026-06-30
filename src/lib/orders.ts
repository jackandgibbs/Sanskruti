import { supabase } from "@/lib/supabase";

export type CartLine = {
  productId: string;
  quantity: number;
  price: number;
  name?: string;
  image?: string;
  size?: string;
};

export type ShippingAddress = {
  name?: string;
  phone?: string;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
};

export const ORDER_STATUSES = [
  "PENDING",
  "PAID",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

/**
 * Place an order atomically via the `place_order` RPC: it validates and
 * decrements stock, then writes the order + line items (with a snapshot of
 * each product) in a single transaction. Throws on insufficient stock.
 */
export async function createOrder(params: {
  totalAmount: number;
  items: CartLine[];
  paymentMethod?: string;
  paymentRef?: string | null;
  shipping?: ShippingAddress;
}) {
  const { data, error } = await supabase.rpc("place_order", {
    p_items: params.items.map((i) => ({
      product_id: i.productId,
      quantity: i.quantity,
      price: i.price,
      name: i.name ?? null,
      image: i.image ?? null,
      size: i.size ?? null,
    })),
    p_total: params.totalAmount,
    p_payment_method: params.paymentMethod ?? "COD",
    p_payment_ref: params.paymentRef ?? null,
    p_ship: params.shipping ?? {},
  });

  if (error) {
    // Surface a friendlier message for the most common failure.
    if (error.message?.includes("INSUFFICIENT_STOCK")) {
      throw new Error("Sorry — one of your items just went out of stock.");
    }
    throw error;
  }
  return data;
}

function mapOrder(o: any) {
  return {
    id: o.id,
    status: o.status,
    totalAmount: o.total_amount,
    createdAt: o.created_at,
    paymentMethod: o.payment_method,
    paymentStatus: o.payment_status,
    shipping: {
      name: o.ship_name,
      phone: o.ship_phone,
      street: o.ship_street,
      city: o.ship_city,
      state: o.ship_state,
      zip: o.ship_zip,
    },
    items: (o.order_items ?? []).map((it: any) => ({
      id: it.id,
      productId: it.product_id,
      name: it.name,
      image: it.image,
      price: it.price,
      quantity: it.quantity,
      size: it.size,
    })),
  };
}

/** Fetch a user's orders (newest first) with their line items, mapped to camelCase. */
export async function fetchUserOrders(userId: string) {
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapOrder);
}

/** Admin: every order with its customer + items (newest first). */
export async function fetchAllOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*), profiles(first_name, last_name, customer_id)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((o: any) => ({
    ...mapOrder(o),
    customer: o.profiles
      ? {
          firstName: o.profiles.first_name,
          lastName: o.profiles.last_name,
          customerId: o.profiles.customer_id,
        }
      : null,
  }));
}

/** Admin: change an order's status via the guarded RPC. */
export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const { error } = await supabase.rpc("set_order_status", {
    p_order_id: orderId,
    p_status: status,
  });
  if (error) throw error;
}
