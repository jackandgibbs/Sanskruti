import { motion } from "motion/react";

export default function NamasteSVG({ className = "" }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 200 300"
      className={className}
      initial={{ rotateX: 0 }}
      animate={{ rotateX: [0, 25, 0] }}
      transition={{
        duration: 2,
        delay: 0.8,
        ease: "easeInOut",
        times: [0, 0.5, 1],
      }}
      style={{ transformOrigin: "bottom center", filter: "drop-shadow(0px 10px 15px rgba(0,0,0,0.1))" }}
    >
      {/* Golden Halo / Glow */}
      <circle cx="100" cy="90" r="60" fill="#cda63f" opacity="0.15" />
      <circle cx="100" cy="90" r="45" fill="#cda63f" opacity="0.2" />

      {/* Back Hair */}
      <path d="M 60 70 Q 30 180 50 250 L 150 250 Q 170 180 140 70 Z" fill="#111827" />

      {/* Saree Base (Forest Green) */}
      <path d="M 50 150 Q 20 280 30 300 L 170 300 Q 180 280 150 150 Q 100 130 50 150 Z" fill="#2a513d" />

      {/* Saree Folds/Shadows for depth */}
      <path d="M 80 150 Q 60 250 70 300 L 90 300 Q 80 250 100 150 Z" fill="#1f3d2e" opacity="0.5" />
      <path d="M 120 150 Q 140 250 130 300 L 110 300 Q 120 250 100 150 Z" fill="#1f3d2e" opacity="0.5" />

      {/* Saree Pallu (Gold border draped over shoulder) */}
      <path d="M 145 150 Q 100 190 35 300 L 65 300 Q 125 190 155 160 Z" fill="#cda63f" />
      <path d="M 148 155 Q 100 195 40 300 L 50 300 Q 110 195 152 165 Z" fill="#b38f36" />

      {/* Neck */}
      <rect x="88" y="110" width="24" height="35" fill="#e8b98b" rx="10" />
      {/* Shadow under chin */}
      <ellipse cx="100" cy="115" rx="12" ry="5" fill="#c2966b" />

      {/* Face */}
      <circle cx="100" cy="80" r="32" fill="#e8b98b" />
      <path d="M 68 80 Q 68 112 100 115 Q 132 112 132 80 Z" fill="#e8b98b" />

      {/* Front Hair (Elegant parted hair) */}
      <path d="M 100 45 Q 65 45 62 85 Q 70 60 100 55 Z" fill="#111827" />
      <path d="M 100 45 Q 135 45 138 85 Q 130 60 100 55 Z" fill="#111827" />
      <ellipse cx="100" cy="48" rx="25" ry="8" fill="#111827" />

      {/* Red Bindi */}
      <circle cx="100" cy="72" r="3.5" fill="#dc2626" />
      <circle cx="100" cy="71.5" r="1" fill="#ff7070" opacity="0.8" /> {/* Bindi highlight */}

      {/* Closed Eyes (Peaceful Namaste look) */}
      <path d="M 78 88 Q 85 93 92 88" fill="none" stroke="#523213" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 108 88 Q 115 93 122 88" fill="none" stroke="#523213" strokeWidth="2.5" strokeLinecap="round" />

      {/* Eyelashes */}
      <path d="M 78 88 L 75 90 M 82 91 L 81 94 M 88 90 L 89 93" stroke="#523213" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 122 88 L 125 90 M 118 91 L 119 94 M 112 90 L 111 93" stroke="#523213" strokeWidth="1.5" strokeLinecap="round" />

      {/* Elegant Nose hint */}
      <path d="M 100 85 L 100 98 L 97 99" fill="none" stroke="#c2966b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Slight Smile */}
      <path d="M 90 106 Q 100 110 110 106" fill="none" stroke="#c45a5a" strokeWidth="2" strokeLinecap="round" />

      {/* Gold Necklace/Choker */}
      <path d="M 85 130 Q 100 145 115 130" fill="none" stroke="#cda63f" strokeWidth="6" strokeLinecap="round" />
      <path d="M 82 135 Q 100 152 118 135" fill="none" stroke="#cda63f" strokeWidth="2" strokeLinecap="round" />
      <circle cx="100" cy="144" r="5" fill="#cda63f" />

      {/* Blouse Sleeves (Rich Red) */}
      <path d="M 50 150 Q 30 180 40 210 L 55 200 Q 60 170 70 155 Z" fill="#8c1c1c" />
      <path d="M 150 150 Q 170 180 160 210 L 145 200 Q 140 170 130 155 Z" fill="#8c1c1c" />

      {/* Gold Bangles */}
      <path d="M 38 200 L 58 190" stroke="#cda63f" strokeWidth="6" strokeLinecap="round" />
      <path d="M 40 210 L 60 200" stroke="#cda63f" strokeWidth="4" strokeLinecap="round" />
      <path d="M 162 200 L 142 190" stroke="#cda63f" strokeWidth="6" strokeLinecap="round" />
      <path d="M 160 210 L 140 200" stroke="#cda63f" strokeWidth="4" strokeLinecap="round" />

      {/* Arms to Hands */}
      <path d="M 48 205 Q 60 240 85 220" fill="none" stroke="#e8b98b" strokeWidth="14" strokeLinecap="round" />
      <path d="M 152 205 Q 140 240 115 220" fill="none" stroke="#e8b98b" strokeWidth="14" strokeLinecap="round" />

      {/* Folded Hands (Namaste) */}
      <path d="M 85 225 L 100 175 L 115 225 Z" fill="#e8b98b" stroke="#d4a373" strokeWidth="1" strokeLinejoin="round" />
      <path d="M 100 175 L 100 225" stroke="#d4a373" strokeWidth="1.5" /> {/* Hand split line */}
    </motion.svg>
  );
}
