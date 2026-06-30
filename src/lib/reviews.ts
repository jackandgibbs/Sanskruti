import { supabase } from "@/lib/supabase";

export type Review = {
  id: string;
  productId: string;
  userId: string;
  author: string;
  rating: number;
  title?: string;
  body?: string;
  createdAt: string;
};

function mapReview(r: any): Review {
  return {
    id: r.id,
    productId: r.product_id,
    userId: r.user_id,
    author: r.author ?? "Anonymous",
    rating: r.rating,
    title: r.title ?? undefined,
    body: r.body ?? undefined,
    createdAt: r.created_at,
  };
}

/** All reviews for a product (newest first) plus a computed summary. */
export async function fetchReviews(productId: string) {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("product_id", productId)
    .order("created_at", { ascending: false });
  if (error) throw error;

  const reviews = (data ?? []).map(mapReview);
  const count = reviews.length;
  const average = count ? reviews.reduce((s, r) => s + r.rating, 0) / count : 0;
  return { reviews, count, average };
}

/** Create or update the current user's review for a product (one per user). */
export async function submitReview(
  productId: string,
  userId: string,
  input: { rating: number; title?: string; body?: string; author?: string }
) {
  const { error } = await supabase.from("reviews").upsert(
    {
      product_id: productId,
      user_id: userId,
      rating: input.rating,
      title: input.title ?? null,
      body: input.body ?? null,
      author: input.author ?? null,
    },
    { onConflict: "product_id,user_id" }
  );
  if (error) throw error;
}

export async function deleteReview(productId: string, userId: string) {
  const { error } = await supabase
    .from("reviews")
    .delete()
    .eq("product_id", productId)
    .eq("user_id", userId);
  if (error) throw error;
}
