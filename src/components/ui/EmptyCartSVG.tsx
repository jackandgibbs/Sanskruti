import { motion } from "motion/react";

export default function EmptyCartSVG({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 300" className={className} style={{ filter: "drop-shadow(0px 10px 15px rgba(0,0,0,0.05))" }}>
      {/* Background Glow */}
      <circle cx="100" cy="150" r="70" fill="#cda63f" opacity="0.08" />

      {/* Back Hair */}
      <path d="M 60 70 Q 30 180 50 250 L 150 250 Q 170 180 140 70 Z" fill="#111827" />

      {/* Saree Base */}
      <path d="M 50 150 Q 20 280 30 300 L 170 300 Q 180 280 150 150 Q 100 130 50 150 Z" fill="#2a513d" />
      <path d="M 80 150 Q 60 250 70 300 L 90 300 Q 80 250 100 150 Z" fill="#1f3d2e" opacity="0.5" />
      
      {/* Pallu */}
      <path d="M 145 150 Q 100 190 35 300 L 65 300 Q 125 190 155 160 Z" fill="#cda63f" />

      {/* Neck */}
      <rect x="88" y="110" width="24" height="35" fill="#e8b98b" rx="10" />
      <ellipse cx="100" cy="115" rx="12" ry="5" fill="#c2966b" />

      {/* Face (Slightly tilted down, looking confused) */}
      <circle cx="100" cy="85" r="32" fill="#e8b98b" />
      <path d="M 68 85 Q 68 117 100 120 Q 132 117 132 85 Z" fill="#e8b98b" />

      {/* Hair */}
      <path d="M 100 50 Q 65 50 62 90 Q 70 65 100 60 Z" fill="#111827" />
      <path d="M 100 50 Q 135 50 138 90 Q 130 65 100 60 Z" fill="#111827" />
      <ellipse cx="100" cy="53" rx="25" ry="8" fill="#111827" />

      <circle cx="100" cy="77" r="3.5" fill="#dc2626" />

      {/* Open Eyes looking down/confused */}
      <path d="M 78 92 Q 85 86 92 92" fill="none" stroke="#523213" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="85" cy="93" r="2.5" fill="#111827" />
      
      <path d="M 108 92 Q 115 86 122 92" fill="none" stroke="#523213" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="115" cy="93" r="2.5" fill="#111827" />

      {/* Eyebrows (pushed together) */}
      <path d="M 76 84 Q 85 82 93 87" fill="none" stroke="#523213" strokeWidth="2" strokeLinecap="round" />
      <path d="M 124 84 Q 115 82 107 87" fill="none" stroke="#523213" strokeWidth="2" strokeLinecap="round" />

      {/* Nose */}
      <path d="M 100 90 L 100 103 L 97 104" fill="none" stroke="#c2966b" strokeWidth="1.5" strokeLinecap="round" />

      {/* Mouth (Slightly open/frowning) */}
      <path d="M 92 113 Q 100 108 108 113" fill="none" stroke="#c45a5a" strokeWidth="2" strokeLinecap="round" />
      <circle cx="100" cy="113" r="2" fill="#8c1c1c" />

      {/* Necklace */}
      <path d="M 85 135 Q 100 150 115 135" fill="none" stroke="#cda63f" strokeWidth="6" strokeLinecap="round" />
      <circle cx="100" cy="149" r="5" fill="#cda63f" />

      {/* Sleeves */}
      <path d="M 50 150 Q 30 180 40 210 L 55 200 Q 60 170 70 155 Z" fill="#8c1c1c" />
      <path d="M 150 150 Q 170 180 160 210 L 145 200 Q 140 170 130 155 Z" fill="#8c1c1c" />

      {/* Open Arms (Confused/Empty Gesture) */}
      <motion.g
        initial={{ rotate: 10, y: 10 }}
        animate={{ rotate: 0, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <path d="M 45 205 Q 10 240 20 180" fill="none" stroke="#e8b98b" strokeWidth="14" strokeLinecap="round" />
        <path d="M 18 175 Q 15 170 20 165 Q 25 170 23 175" fill="#d4a373" stroke="#d4a373" strokeWidth="4" strokeLinecap="round" /> {/* Hand */}
      </motion.g>

      <motion.g
        initial={{ rotate: -10, y: 10 }}
        animate={{ rotate: 0, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <path d="M 155 205 Q 190 240 180 180" fill="none" stroke="#e8b98b" strokeWidth="14" strokeLinecap="round" />
        <path d="M 182 175 Q 185 170 180 165 Q 175 170 177 175" fill="#d4a373" stroke="#d4a373" strokeWidth="4" strokeLinecap="round" /> {/* Hand */}
      </motion.g>
      
      {/* Bangles */}
      <path d="M 25 195 L 40 205" stroke="#cda63f" strokeWidth="5" strokeLinecap="round" />
      <path d="M 175 195 L 160 205" stroke="#cda63f" strokeWidth="5" strokeLinecap="round" />

      {/* Floating sparkles to show emptiness */}
      <motion.circle cx="30" cy="120" r="3" fill="#cda63f" animate={{ opacity: [0, 1, 0], y: [-10, 10] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} />
      <motion.circle cx="170" cy="140" r="2" fill="#cda63f" animate={{ opacity: [0, 1, 0], y: [-10, 10] }} transition={{ duration: 3, repeat: Infinity, delay: 1 }} />
    </svg>
  );
}
