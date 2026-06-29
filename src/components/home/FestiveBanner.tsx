import { Link } from "react-router";
import { motion } from "motion/react";
import { banner } from "@/lib/placeholder";

const ease = [0.22, 1, 0.36, 1] as const;

export default function FestiveBanner() {
  return (
    <section className="bg-forest">
      <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
        <div className="grid items-center gap-10 py-16 md:grid-cols-2 md:gap-14 lg:py-24">
          {/* ---- Image (shows first on mobile) ---- */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease }}
            className="order-first md:order-last"
          >
            <img
              src="/festive-banner.png"
              alt="Festive Collection"
              className="w-full rounded-[6px] object-cover aspect-[4/3] bg-black/10"
              onError={(e) => {
                // Fallback if image doesn't exist yet
                (e.target as HTMLImageElement).src = banner(3, 800, 600);
              }}
            />
          </motion.div>

          {/* ---- Text ---- */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease }}
            className="order-last md:order-first"
          >
            <span className="font-body text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-gold">
              LIMITED EDITION
            </span>

            <h2 className="mt-4 font-heading text-4xl leading-tight text-ivory sm:text-5xl lg:text-[3.4rem]">
              Festive Collection 2025
            </h2>

            <p className="mt-5 max-w-md text-base leading-relaxed text-ivory/70">
              Celebrate every occasion in handcrafted elegance. Our limited-edition
              festive pieces blend heritage weaving techniques with contemporary
              silhouettes — designed to make you feel extraordinary.
            </p>

            <Link
              to="/festive"
              className="mt-9 inline-block bg-ivory px-9 py-4 text-[0.75rem] font-bold uppercase tracking-[0.16em] text-forest transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(248,244,234,0.35)]"
            >
              Explore the Collection
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
