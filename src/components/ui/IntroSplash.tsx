import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function IntroSplash() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Hide the splash screen after 3.5 seconds
    const timer = setTimeout(() => setIsVisible(false), 3500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ivory"
        >
          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold/10 rounded-full blur-[100px]" />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative perspective-[1000px] flex flex-col items-center"
          >
            {/* The Namaste Bowing Animation */}
            <motion.img
              src="/namaste.png" // User must place their image as namaste.png in public folder
              alt="Namaste Welcome"
              className="w-64 md:w-80 h-auto drop-shadow-2xl object-contain"
              initial={{ rotateX: 0 }}
              animate={{ rotateX: [0, 25, 0] }}
              transition={{
                duration: 2,
                delay: 0.5,
                ease: "easeInOut",
                times: [0, 0.5, 1],
              }}
              style={{ transformOrigin: "bottom center" }}
            />
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="mt-8 text-center"
            >
              <h1 className="font-heading text-4xl text-[#1a3326] tracking-tight">Welcome to Sanskruti</h1>
              <p className="text-gold tracking-[0.2em] uppercase text-sm mt-2 font-semibold">The Essence of Heritage</p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
