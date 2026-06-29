/* ----------------------------------------------------------------------------
   On-brand SVG placeholder imagery.
   Self-contained so the storefront renders beautifully with no external assets.
   Replace these with real editorial photography by swapping the `image` fields
   in src/data/site.ts for real URLs / imported assets.
---------------------------------------------------------------------------- */

const TONES = ["#e7ddc8", "#d7e1d6", "#efe7d6", "#dfe7df", "#ece3d1", "#d9e2dc"];

function motif(cx: number, cy: number, scale: number, opacity: number) {
  // A simple, restrained floral motif inspired by the logo.
  return `
    <g transform="translate(${cx} ${cy}) scale(${scale})" fill="none"
       stroke="#c89a1d" stroke-width="1.4" opacity="${opacity}">
      ${Array.from({ length: 8 })
        .map((_, i) => {
          const a = (i * 360) / 8;
          return `<ellipse cx="0" cy="-22" rx="9" ry="22" transform="rotate(${a})"/>`;
        })
        .join("")}
      <circle cx="0" cy="0" r="6" fill="#c89a1d" stroke="none" opacity="0.9"/>
    </g>`;
}

function svg(content: string, w: number, h: number) {
  const raw = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${content}</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(raw)}`;
}

/** Soft tonal panel with a thin gold inset border and a corner motif. */
export function panel(seed: number, label?: string, w = 800, h = 1000) {
  const bg = TONES[seed % TONES.length];
  const content = `
    <rect width="${w}" height="${h}" fill="${bg}"/>
    ${
      label
        ? `<text x="${w / 2}" y="${h / 2}" text-anchor="middle"
             font-family="Cormorant Garamond, Georgia, serif" font-size="54"
             fill="#2f5d4a" letter-spacing="1">${label}</text>
           <text x="${w / 2}" y="${h / 2 + 40}" text-anchor="middle"
             font-family="Poppins, sans-serif" font-size="14"
             fill="#7a7468" letter-spacing="5">SANSKRUTI</text>`
        : ""
    }`;
  return svg(content, w, h);
}

/** Wide editorial banner. */
export function banner(seed: number, w = 1600, h = 900) {
  const bg = TONES[seed % TONES.length];
  const content = `
    <rect width="${w}" height="${h}" fill="${bg}"/>
    <rect x="0" y="0" width="${w}" height="${h}" fill="#1c3a2e" opacity="0.04"/>
    <path d="M0 ${h} Q ${w * 0.3} ${h * 0.7} ${w * 0.55} ${h} Z" fill="#2f5d4a" opacity="0.06"/>
    ${motif(w * 0.82, h * 0.28, 3.2, 0.18)}
    ${motif(w * 0.2, h * 0.7, 2.2, 0.12)}`;
  return svg(content, w, h);
}
