import { panel } from "@/lib/placeholder";

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  mrp?: number;
  rating: number;
  reviews: number;
  fabric: string;
  sizes: string[];
  image: string;
  hoverImage: string;
  tag?: string;
  inStock: boolean;
  stockCount?: number;
  bestSeller?: boolean;
  newArrival?: boolean;
  sku?: string;
  description?: string;
  galleryImages?: string[];
};

export const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "New Arrivals", to: "/new-arrivals" },
  { label: "Sarees", to: "/sarees" },
  { label: "Lehengas", to: "/lehengas" },
  { label: "Kurtis", to: "/kurtis" },
  { label: "Festive", to: "/festive" },
  { label: "Wedding", to: "/wedding" },
  { label: "Designer", to: "/designer" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export const CATEGORIES = [
  { name: "Sarees", to: "/sarees", blurb: "Handwoven elegance", image: "/images/cat_saree_1782549482310.png" },
  { name: "Lehengas", to: "/lehengas", blurb: "Festive grandeur", image: "/images/cat_lehenga_1782549494290.png" },
  { name: "Kurtis", to: "/kurtis", blurb: "Everyday grace", image: "/images/cat_kurti_1782549506906.png" },
  { name: "Wedding", to: "/wedding", blurb: "The bridal trousseau", image: "/images/cat_wedding_1782549517767.png" },
  { name: "Festive", to: "/festive", blurb: "Celebration ready", image: "/images/cat_festive_1782549529984.png" },
  { name: "Designer", to: "/designer", blurb: "Signature couture", image: "/images/cat_designer_1782549542678.png" },
];

const FABRICS = ["Pure Silk", "Banarasi Silk", "Organza", "Chanderi Cotton", "Georgette", "Tussar Silk"];
const NAMES = [
  "Meenakshi Kanjivaram Saree",
  "Gulmohar Banarasi Lehenga",
  "Rajwadi Festive Kurti",
  "Ivory Chanderi Saree",
  "Anarkali Organza Set",
  "Bandhani Silk Saree",
  "Patola Wedding Lehenga",
  "Sage Linen Kurti",
  "Zari Border Tussar Saree",
  "Marigold Georgette Set",
  "Emerald Velvet Lehenga",
  "Pearl Embroidered Saree",
];
const CATS = ["Sarees", "Lehengas", "Kurtis", "Festive", "Wedding", "Designer"];

const PROD_IMAGES = [
  "/images/prod_1_1782549574494.png",
  "/images/prod_2_1782549586540.png",
  "/images/prod_3_1782549599120.png",
  "/images/prod_4_1782549611012.png"
];

export const PRODUCTS: Product[] = NAMES.map((name, i) => {
  const mrp = 4990 + ((i * 1700) % 18000);
  const price = Math.round((mrp * (0.7 + (i % 3) * 0.08)) / 10) * 10;
  return {
    id: `sk-${100 + i}`,
    name,
    category: CATS[i % CATS.length],
    price,
    mrp: price < mrp ? mrp : undefined,
    rating: +(4.3 + ((i * 17) % 7) / 10).toFixed(1),
    reviews: 24 + ((i * 53) % 480),
    fabric: FABRICS[i % FABRICS.length],
    sizes: ["XS", "S", "M", "L", "XL", "Free"].slice(0, 4 + (i % 3)),
    image: PROD_IMAGES[i % PROD_IMAGES.length],
    hoverImage: PROD_IMAGES[(i + 1) % PROD_IMAGES.length],
    tag: price < mrp ? `${Math.round((1 - price / mrp) * 100)}% OFF` : undefined,
    inStock: i % 7 !== 0,
    bestSeller: i % 3 === 0,
    newArrival: i % 4 === 1,
  };
});

export const BEST_SELLERS = PRODUCTS.filter((p) => p.bestSeller);
export const NEW_ARRIVALS = PRODUCTS.filter((p) => p.newArrival);
export const TRENDING = PRODUCTS.slice(0, 8);

export const REVIEWS = [
  {
    name: "Ananya Mehta",
    city: "Ahmedabad",
    text: "The Kanjivaram saree is even more beautiful in person. The zari work is exquisite and the drape is flawless. Felt like I was shopping at a true boutique.",
    avatar: panel(0, undefined, 200, 200),
  },
  {
    name: "Priya Nair",
    city: "Mumbai",
    text: "Ordered a lehenga for my sister's wedding. Premium fabric, perfect stitching and it arrived beautifully packaged. Sanskruti has my heart.",
    avatar: panel(1, undefined, 200, 200),
  },
  {
    name: "Riya Shah",
    city: "Surat",
    text: "Their festive kurtis are my go-to. Elegant, comfortable and never loud. The attention to detail is unmatched.",
    avatar: panel(2, undefined, 200, 200),
  },
];

export const INSTAGRAM = [
  { id: "ig-0", image: "/instagram/ig_gujarat_1_1782549270163.png" },
  { id: "ig-1", image: "/instagram/ig_gujarat_2_1782549282627.png" },
  { id: "ig-2", image: "/instagram/ig_gujarat_3_1782549295178.png" },
  { id: "ig-3", image: "/instagram/ig_gujarat_4_1782549305111.png" },
  { id: "ig-4", image: "/instagram/ig_gujarat_1_1782549270163.png" }, // Reused to fill 6 columns
  { id: "ig-5", image: "/instagram/ig_gujarat_3_1782549295178.png" },
];
