import { cn } from "@/lib/utils";

// Generate pixel-perfect 12-lobed scalloped border
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

/** Sanskruti wordmark with the pixel-perfect true logo geometry. */
export default function Logo({
  className,
  tone = "forest",
}: {
  className?: string;
  tone?: "forest" | "ivory";
}) {
  const main = tone === "ivory" ? "#f8f4ea" : "#2a513d";
  const gold = "#cda63f";
  
  return (
    <span className={cn("inline-flex items-center gap-3 select-none", className)}>
      <svg width="32" height="32" viewBox="0 0 100 100" fill="none" aria-hidden>
        {/* Outer Gold Scalloped Border with solid white fill */}
        <path 
          d={scallopPath} 
          stroke={gold} 
          strokeWidth="4"
          strokeLinejoin="miter"
          fill={tone === "ivory" ? "transparent" : "#ffffff"} 
        />
        
        {/* Inner Flower Knot */}
        <g stroke={main} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
          {/* Vertical S-Knot */}
          <path d="M 50 16 C 65 20, 60 38, 50 50 C 40 62, 35 80, 50 84 C 65 80, 60 62, 50 50 C 40 38, 35 20, 50 16 Z" />
          {/* Horizontal S-Knot */}
          <path d="M 84 50 C 80 65, 62 60, 50 50 C 38 40, 20 35, 16 50 C 20 65, 38 60, 50 50 C 62 40, 80 35, 84 50 Z" />
          {/* 4 Floating Diagonal Teardrop Petals */}
          <path d="M 58 42 C 64 38, 68 34, 74 26 C 66 32, 62 36, 58 42 Z" />
          <path d="M 42 42 C 36 38, 32 34, 26 26 C 34 32, 38 36, 42 42 Z" />
          <path d="M 58 58 C 64 62, 68 66, 74 74 C 66 68, 62 64, 58 58 Z" />
          <path d="M 42 58 C 36 62, 32 66, 26 74 C 34 68, 38 64, 42 58 Z" />
        </g>
      </svg>
      <span className="flex flex-col leading-none items-center mt-1">
        <span
          className="text-[1.85rem] relative"
          style={{ color: main, fontFamily: "'Rozha One', serif" }}
        >
          सस्कृति
          {/* Gold dot over the first letter 'sa' to make it 'sam' visually like the image */}
          <span 
            className="absolute rounded-full" 
            style={{ 
              backgroundColor: gold, 
              width: '0.12em', 
              height: '0.12em', 
              top: '-0.02em', 
              left: '0.55em' 
            }} 
          />
        </span>
        <span
          className="text-[0.65rem] font-bold text-center mt-1 tracking-wider"
          style={{ color: tone === "ivory" ? "rgba(248,244,234,0.8)" : gold, fontFamily: "var(--font-body)" }}
        >
          <span className="block mb-0.5">वीमेन्स</span>
          <span className="block">एथनिक वेयर</span>
        </span>
      </span>
    </span>
  );
}
