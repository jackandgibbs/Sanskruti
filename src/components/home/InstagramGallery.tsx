import { motion } from "motion/react";
import { Instagram } from "lucide-react";
import { INSTAGRAM } from "@/data/site";

const ease = [0.22, 1, 0.36, 1] as const;

export default function InstagramGallery() {
  return (
    <section className="section-spacing">
      <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease }}
          className="mb-10 text-center"
        >
          <span className="eyebrow">On Instagram</span>
          <h2 className="mt-3 font-heading text-4xl text-forest sm:text-[2.7rem]">
            Follow{" "}
            <a
              href="https://www.instagram.com/sanskruti_gujarat/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold transition-colors hover:text-gold-400"
            >
              @sanskruti_gujarat
            </a>
          </h2>
          <div className="gold-rule mx-auto mt-5 h-px w-20" />
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-3 gap-1 md:grid-cols-6">
          {INSTAGRAM.map((item, i) => (
            <motion.a
              key={item.id}
              href="https://www.instagram.com/sanskruti_gujarat/"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.06, ease }}
              className="group relative aspect-square overflow-hidden"
            >
              <img
                src={item.image}
                alt={`Instagram post ${i + 1}`}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-forest/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <Instagram className="h-7 w-7 text-white" strokeWidth={1.5} />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
