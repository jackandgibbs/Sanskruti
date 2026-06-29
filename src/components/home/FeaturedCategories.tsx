import { Link } from "react-router";
import { motion } from "motion/react";
import { CATEGORIES } from "@/data/site";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export default function FeaturedCategories() {
  return (
    <section className="section-spacing">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="eyebrow mb-3">Curated for You</p>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-charcoal">
            Shop by Category
          </h2>
        </motion.div>

        {/* Category grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 md:gap-10">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.name}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              custom={i}
            >
              <Link
                to={cat.to}
                className="group flex flex-col items-center gap-4"
              >
                {/* Circular image */}
                <div className="w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36 rounded-full overflow-hidden bg-beige">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                  />
                </div>

                {/* Label */}
                <span className="text-xs font-semibold tracking-[0.2em] uppercase text-charcoal/80 group-hover:text-forest transition-colors duration-300">
                  {cat.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
