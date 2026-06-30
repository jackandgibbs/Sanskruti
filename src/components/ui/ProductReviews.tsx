import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import { fetchReviews, submitReview, type Review } from "@/lib/reviews";

function Stars({ value, onChange, size = 16 }: { value: number; onChange?: (v: number) => void; size?: number }) {
  return (
    <div className="flex text-gold">
      {Array.from({ length: 5 }).map((_, i) => (
        <button
          key={i}
          type="button"
          disabled={!onChange}
          onClick={() => onChange?.(i + 1)}
          className={onChange ? "cursor-pointer" : "cursor-default"}
          aria-label={`${i + 1} star`}
        >
          <Star size={size} fill={i < value ? "currentColor" : "none"} />
        </button>
      ))}
    </div>
  );
}

export default function ProductReviews({ productId }: { productId: string }) {
  const user = useAuthStore((s) => s.user);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [average, setAverage] = useState(0);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    fetchReviews(productId)
      .then((r) => {
        setReviews(r.reviews);
        setAverage(r.average);
        setCount(r.count);
      })
      .catch((err) => console.error("Failed to load reviews", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setLoading(true);
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const myReview = user ? reviews.find((r) => r.userId === user.id) : undefined;

  useEffect(() => {
    if (myReview) {
      setRating(myReview.rating);
      setTitle(myReview.title ?? "");
      setBody(myReview.body ?? "");
    }
  }, [myReview?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (rating < 1) {
      toast.warning("Please pick a star rating.");
      return;
    }
    setSubmitting(true);
    try {
      await submitReview(productId, user.id, {
        rating,
        title: title.trim() || undefined,
        body: body.trim() || undefined,
        author: `${user.firstName} ${user.lastName?.[0] ?? ""}.`.trim(),
      });
      toast.success(myReview ? "Review updated" : "Thanks for your review!");
      load();
    } catch (err: any) {
      toast.error(err?.message || "Could not submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-24 border-t border-border pt-16">
      <div className="max-w-3xl">
        <h2 className="text-3xl font-serif text-forest mb-2">Customer Reviews</h2>
        <div className="flex items-center gap-3 mb-10">
          <Stars value={Math.round(average)} />
          <span className="text-sm text-charcoal/70 font-body">
            {count > 0 ? `${average.toFixed(1)} out of 5 · ${count} review${count === 1 ? "" : "s"}` : "No reviews yet"}
          </span>
        </div>

        {/* Write a review */}
        {user ? (
          <form onSubmit={handleSubmit} className="bg-white border border-border p-6 mb-12 space-y-4">
            <p className="text-sm font-bold uppercase tracking-widest text-forest">
              {myReview ? "Edit your review" : "Write a review"}
            </p>
            <Stars value={rating} onChange={setRating} size={22} />
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title (optional)"
              className="w-full p-3 border border-border outline-none focus:border-forest text-sm font-body"
            />
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Share your experience with this piece…"
              className="w-full p-3 border border-border outline-none focus:border-forest text-sm font-body h-28 resize-none"
            />
            <button
              type="submit"
              disabled={submitting}
              className="bg-forest text-ivory px-8 py-3 uppercase tracking-[0.15em] font-bold text-xs hover:bg-gold transition-colors disabled:opacity-50"
            >
              {submitting ? "Submitting…" : myReview ? "Update Review" : "Submit Review"}
            </button>
          </form>
        ) : (
          <p className="text-sm text-charcoal/60 mb-12 font-body">
            Please sign in to leave a review.
          </p>
        )}

        {/* Review list */}
        {loading ? (
          <p className="text-sm text-charcoal/50">Loading reviews…</p>
        ) : (
          <div className="space-y-8">
            {reviews.map((r) => (
              <div key={r.id} className="border-b border-border/60 pb-6">
                <div className="flex items-center justify-between mb-2">
                  <Stars value={r.rating} />
                  <span className="text-xs text-charcoal/40 uppercase tracking-widest">
                    {new Date(r.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>
                {r.title && <p className="font-bold text-charcoal font-body mb-1">{r.title}</p>}
                {r.body && <p className="text-sm text-charcoal/80 font-body leading-relaxed mb-2">{r.body}</p>}
                <p className="text-xs text-charcoal/50 uppercase tracking-widest font-bold">{r.author}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
