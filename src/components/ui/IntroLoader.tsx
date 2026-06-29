import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import NamasteSVG from "@/components/ui/NamasteSVG";

// Generate pixel-perfect 12-lobed scalloped border (sharp valleys, rounded lobes)
const scallopPath = (() => {
  const cx = 50, cy = 50, numLobes = 12, rInner = 36, rArc = 14.5;
  let d = "";
  for (let i = 0; i < numLobes; i++) {
    const a1 = (i * 360) / numLobes * Math.PI / 180;
    const a2 = ((i + 1) * 360) / numLobes * Math.PI / 180;
    
    const x1 = cx + rInner * Math.sin(a1);
    const y1 = cy - rInner * Math.cos(a1);
    const x2 = cx + rInner * Math.sin(a2);
    const y2 = cy - rInner * Math.cos(a2);
    
    if (i === 0) d += `M ${x1} ${y1} `;
    d += `A ${rArc} ${rArc} 0 0 1 ${x2} ${y2} `;
  }
  return d;
})();

export default function IntroLoader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Total animation time before fade out: 4.5s
    const timer = setTimeout(() => {
      setLoading(false);
    }, 4500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#f4ebd9]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] bg-gold/20 rounded-full blur-[100px]" />
          
          <div className="relative z-10 flex flex-col items-center justify-center">
            
            {/* The Namaste Bowing Animation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="mb-6"
            >
              <NamasteSVG className="w-32 md:w-40 h-auto" />
            </motion.div>

            {/* 100% Pixel-Perfect Custom Logo SVG */}
            <svg width="100" height="100" viewBox="0 0 100 100" fill="none" aria-hidden className="drop-shadow-[0_0_12px_rgba(205,166,63,0.3)]">
              {/* Outer Gold Scalloped Border */}
              <motion.path 
                d={scallopPath} 
                stroke="#cda63f" 
                strokeWidth="4"
                strokeLinejoin="miter"
                initial={{ pathLength: 0, fill: "rgba(255,255,255,0)" }}
                animate={{ pathLength: 1, fill: "rgba(255,255,255,1)" }}
                transition={{
                  pathLength: { duration: 1.5, delay: 0.2, ease: "easeInOut" },
                  fill: { duration: 0.8, delay: 1.5, ease: "easeInOut" }
                }}
              />
              
              {/* Inner Green Flower Knot */}
              <g stroke="#2a513d" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                <motion.path d="M 50 16 C 65 20, 60 38, 50 50 C 40 62, 35 80, 50 84 C 65 80, 60 62, 50 50 C 40 38, 35 20, 50 16 Z" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }} />
                <motion.path d="M 84 50 C 80 65, 62 60, 50 50 C 38 40, 20 35, 16 50 C 20 65, 38 60, 50 50 C 62 40, 80 35, 84 50 Z" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 1.5, delay: 0.8, ease: "easeInOut" }} />
                <motion.path d="M 58 42 C 64 38, 68 34, 74 26 C 66 32, 62 36, 58 42 Z" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }} />
                <motion.path d="M 42 42 C 36 38, 32 34, 26 26 C 34 32, 38 36, 42 42 Z" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.8, delay: 1.3, ease: "easeOut" }} />
                <motion.path d="M 58 58 C 64 62, 68 66, 74 74 C 66 68, 62 64, 58 58 Z" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.8, delay: 1.4, ease: "easeOut" }} />
                <motion.path d="M 42 58 C 36 62, 32 66, 26 74 C 34 68, 38 64, 42 58 Z" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.8, delay: 1.5, ease: "easeOut" }} />
              </g>
            </svg>
            
            {/* Text Reveal */}
            <motion.div 
              className="mt-8 flex flex-col items-center whitespace-nowrap relative z-20"
              initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              transition={{ duration: 1, delay: 2.2, ease: "easeOut" }}
            >
              <span className="text-[2.5rem] relative leading-none" style={{ color: "#2a513d", fontFamily: "'Rozha One', serif" }}>
                सस्कृति
                <span className="absolute rounded-full" style={{ backgroundColor: "#cda63f", width: '0.12em', height: '0.12em', top: '-0.02em', left: '0.55em' }} />
              </span>
              <span className="text-[0.9rem] font-bold text-center mt-2 tracking-wider" style={{ color: "#cda63f", fontFamily: "var(--font-body)" }}>
                <span className="block mb-1">वीमेन्स</span>
                <span className="block">एथनिक वेयर</span>
              </span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
