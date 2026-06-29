import { Link } from "react-router";
import { motion } from "motion/react";
import { banner } from "@/lib/placeholder";
import { useSetting } from "@/lib/siteSettings";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.3 + i * 0.15,
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export default function Hero() {
  const heroVideo = useSetting("hero_video", "/hero.mp4");
  return (
    <section className="relative h-[calc(100vh-110px)] w-full overflow-hidden">
      {/* Background video — published via Admin → Settings (Cloudinary), local fallback */}
      <video
        src={heroVideo}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex items-end">
        <div className="w-full max-w-7xl mx-auto px-6 pb-16 md:pb-20 lg:pb-24">
          <motion.p
            className="eyebrow mb-4 text-gold-400"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
          >
            New Collection
          </motion.p>

          <motion.h1
            className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium leading-[1.08] text-white max-w-2xl"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
          >
            The Art of
            <br />
            Timeless Dressing
          </motion.h1>

          <motion.p
            className="mt-5 max-w-md text-base md:text-lg text-white/75 font-body leading-relaxed"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
          >
            Discover handcrafted Indian ethnic wear that blends heritage
            artistry with contemporary silhouettes — made for the woman who
            carries tradition with effortless grace.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
          >
            <Link to="/new-arrivals" className="btn-primary mt-8 inline-flex">
              Shop New Arrivals
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
