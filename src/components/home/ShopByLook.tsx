import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const LOOKS = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1605722243979-fe0be8158232?auto=format&fit=crop&w=800&q=80",
    title: "DAY WEAR",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80",
    title: "EVENING GLAM",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
    title: "FESTIVE READY",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
    title: "BRIDAL EDIT",
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
    title: "MINIMAL ELEGANCE",
  },
];

export default function ShopByLook() {
  const [currentIndex, setCurrentIndex] = useState(2);

  const next = () => setCurrentIndex((prev) => (prev + 1) % LOOKS.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + LOOKS.length) % LOOKS.length);

  return (
    <section className="py-20 overflow-hidden bg-ivory">
      <div className="text-center mb-10 md:mb-16">
        <h2 className="text-3xl lg:text-4xl font-serif text-forest mb-4">Shop by Look</h2>
        <p className="text-charcoal/70 uppercase tracking-widest text-sm font-body">Curated styles for every occasion</p>
      </div>

      <div className="relative h-[450px] sm:h-[550px] md:h-[650px] w-full max-w-[1400px] mx-auto flex items-center justify-center">
        {LOOKS.map((look, index) => {
          let position = "hidden"; // hidden, left, center, right
          
          if (index === currentIndex) position = "center";
          else if (index === (currentIndex - 1 + LOOKS.length) % LOOKS.length) position = "left";
          else if (index === (currentIndex + 1) % LOOKS.length) position = "right";

          const zIndex = position === "center" ? 30 : position !== "hidden" ? 20 : 10;
          const scale = position === "center" ? 1 : 0.8;
          // Offset based on position. 'hidden' items go far off-screen
          const x = 
            position === "center" ? "0%" 
            : position === "left" ? "-70%" 
            : position === "right" ? "70%" 
            : position === "hidden" && index < currentIndex ? "-120%" 
            : "120%";
            
          const opacity = position === "hidden" ? 0 : 1;
          const brightness = position === "center" ? "brightness-100" : "brightness-75";

          return (
            <motion.div
              key={look.id}
              className={cn(
                "absolute w-[280px] sm:w-[360px] md:w-[460px] h-[400px] sm:h-[500px] md:h-[620px] overflow-hidden shadow-2xl cursor-pointer bg-white",
                brightness
              )}
              initial={false}
              animate={{ x, scale, zIndex, opacity }}
              transition={{ type: "spring", stiffness: 260, damping: 25 }}
              onClick={() => {
                if (position === "left") prev();
                if (position === "right") next();
              }}
            >
              <img src={look.image} alt={look.title} className="w-full h-full object-cover" />
              
              <div className={cn(
                "absolute bottom-6 left-1/2 -translate-x-1/2 w-[85%] max-w-[240px] flex flex-col items-center justify-center bg-white/95 backdrop-blur-md px-6 py-4 shadow-lg transition-all duration-500",
                position === "center" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}>
                <h3 className="text-forest text-[0.8rem] font-bold uppercase tracking-[0.2em] font-body mb-2 text-center">
                  {look.title}
                </h3>
                <span className="text-charcoal/70 text-[0.65rem] uppercase tracking-widest font-body border-b border-gold/40 pb-0.5 hover:text-gold transition-colors">
                  Shop the look
                </span>
              </div>
            </motion.div>
          );
        })}

        {/* Controls */}
        <button
          onClick={prev}
          className="absolute left-[5%] md:left-[15%] z-40 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center shadow-xl text-forest hover:bg-forest hover:text-ivory transition-colors"
          aria-label="Previous look"
        >
          <ChevronLeft size={20} strokeWidth={2.5} />
        </button>
        <button
          onClick={next}
          className="absolute right-[5%] md:right-[15%] z-40 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center shadow-xl text-forest hover:bg-forest hover:text-ivory transition-colors"
          aria-label="Next look"
        >
          <ChevronRight size={20} strokeWidth={2.5} />
        </button>
      </div>
    </section>
  );
}
