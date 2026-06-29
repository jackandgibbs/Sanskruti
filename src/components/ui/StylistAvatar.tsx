import { motion } from "motion/react";

export default function StylistAvatar({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="50 30 100 120" className={className} style={{ backgroundColor: "#2a513d" }}>
      {/* Background Glow */}
      <circle cx="100" cy="80" r="50" fill="#cda63f" opacity="0.3" />

      {/* Back Hair */}
      <path d="M 60 70 Q 30 180 50 250 L 150 250 Q 170 180 140 70 Z" fill="#111827" />

      {/* Shoulders / Saree Base */}
      <path d="M 50 150 Q 20 280 30 300 L 170 300 Q 180 280 150 150 Q 100 130 50 150 Z" fill="#1f3d2e" />
      <path d="M 145 150 Q 100 190 35 300 L 65 300 Q 125 190 155 160 Z" fill="#cda63f" />

      {/* Neck */}
      <rect x="88" y="110" width="24" height="35" fill="#e8b98b" rx="10" />
      <ellipse cx="100" cy="115" rx="12" ry="5" fill="#c2966b" />

      {/* Face */}
      <circle cx="100" cy="80" r="32" fill="#e8b98b" />
      <path d="M 68 80 Q 68 112 100 115 Q 132 112 132 80 Z" fill="#e8b98b" />

      {/* Front Hair */}
      <path d="M 100 45 Q 65 45 62 85 Q 70 60 100 55 Z" fill="#111827" />
      <path d="M 100 45 Q 135 45 138 85 Q 130 60 100 55 Z" fill="#111827" />
      <ellipse cx="100" cy="48" rx="25" ry="8" fill="#111827" />

      {/* Bindi */}
      <circle cx="100" cy="72" r="3.5" fill="#dc2626" />

      {/* Blinking Eyes (Open by default, scales Y to 0 occasionally) */}
      <motion.g
        animate={{ scaleY: [1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "85px 85px" }} // center of eyes vertically
      >
        {/* Left Eye */}
        <path d="M 78 86 Q 85 82 92 86" fill="none" stroke="#523213" strokeWidth="2" strokeLinecap="round" />
        <circle cx="85" cy="86" r="2.5" fill="#111827" />
        {/* Right Eye */}
        <path d="M 108 86 Q 115 82 122 86" fill="none" stroke="#523213" strokeWidth="2" strokeLinecap="round" />
        <circle cx="115" cy="86" r="2.5" fill="#111827" />
      </motion.g>

      {/* Nose */}
      <path d="M 100 85 L 100 98 L 97 99" fill="none" stroke="#c2966b" strokeWidth="1.5" strokeLinecap="round" />

      {/* Friendly Smile */}
      <path d="M 88 104 Q 100 112 112 104" fill="none" stroke="#c45a5a" strokeWidth="2" strokeLinecap="round" />
      <path d="M 90 104 L 110 104" stroke="#c45a5a" strokeWidth="1" /> {/* Teeth hint */}

      {/* Necklace */}
      <path d="M 85 130 Q 100 145 115 130" fill="none" stroke="#cda63f" strokeWidth="6" strokeLinecap="round" />
      <circle cx="100" cy="144" r="5" fill="#cda63f" />
    </svg>
  );
}
