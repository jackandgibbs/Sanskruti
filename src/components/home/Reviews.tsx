import { motion } from "motion/react";
import SectionHeading from "@/components/ui/SectionHeading";
import { REVIEWS } from "@/data/site";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Reviews() {
  return (
    <section className="section-spacing">
      <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
        <SectionHeading
          eyebrow="TESTIMONIALS"
          title="What Our Customers Say"
          subtitle="Hear from the women who wear Sanskruti with pride."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {REVIEWS.map((review, i) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.12, ease }}
              className="rounded-[var(--radius-card)] border border-forest/10 bg-white p-7"
            >
              {/* Stars */}
              <div className="flex gap-0.5 text-gold" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, s) => (
                  <span key={s} className="text-lg">★</span>
                ))}
              </div>

              {/* Quote */}
              <p className="mt-5 font-heading text-base italic leading-relaxed text-charcoal/80">
                &ldquo;{review.text}&rdquo;
              </p>

              {/* Reviewer */}
              <div className="mt-6 flex items-center gap-3">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-charcoal">
                    {review.name}
                  </p>
                  <p className="text-xs text-muted">{review.city}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
