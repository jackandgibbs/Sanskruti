import { Link } from "react-router";
import { motion } from "motion/react";
import { panel } from "@/lib/placeholder";
import { useSetting } from "@/lib/siteSettings";

export default function Heritage() {
  const heritageImage = useSetting("heritage_image", "/heritage.png");
  return (
    <section className="section-spacing overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left — Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="overflow-hidden rounded-[var(--radius-card)]">
              <img
                src={heritageImage}
                alt="Artisan hand-weaving heritage textile"
                className="w-full h-[600px] object-cover"
              />
            </div>
          </motion.div>

          {/* Right — Text */}
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
              duration: 0.8,
              delay: 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex flex-col justify-center"
          >
            <p className="eyebrow mb-4">Our Story</p>

            <h2 className="font-heading text-3xl md:text-4xl lg:text-[2.75rem] leading-snug text-charcoal">
              Crafted with Heritage,
              <br className="hidden md:block" />
              Worn with Pride
            </h2>

            <p className="mt-6 text-muted leading-relaxed text-base md:text-[1.05rem]">
              Rooted in generations of Indian textile artistry, Sanskruti
              celebrates the quiet luxury of handwoven fabrics, intricate zari
              borders, and time-honoured craft techniques passed down through
              centuries. Every piece in our collection is a tribute to the
              master weavers and artisans of India — from the silk looms of
              Kanchipuram to the brocade workshops of Varanasi.
            </p>

            <p className="mt-4 text-muted leading-relaxed text-base md:text-[1.05rem]">
              We believe that true elegance is never hurried. Each saree, each
              lehenga, each carefully embroidered kurti is crafted with patience
              and devotion — so that when you wear it, you carry not just fabric,
              but an entire legacy of craftsmanship and cultural pride.
            </p>

            <div className="mt-8">
              <Link
                to="/about"
                className="gold-underline text-sm font-semibold tracking-widest uppercase text-forest"
              >
                Discover Our Story →
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
