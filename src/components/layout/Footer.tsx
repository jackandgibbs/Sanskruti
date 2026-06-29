import { useState } from "react";
import { Link } from "react-router";
import { Instagram, Facebook, Youtube } from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "@/components/Logo";

const QUICK_LINKS = [
  { label: "Shop All", to: "/sarees" },
  { label: "New Arrivals", to: "/new-arrivals" },
  { label: "Best Sellers", to: "/sarees" },
  { label: "Gifting", to: "/festive" },
];

const HELP_LINKS = [
  { label: "Contact Us", to: "/contact" },
  { label: "FAQs", to: "/contact" },
  { label: "Shipping & Returns", to: "/contact" },
  { label: "Size Guide", to: "/contact" },
];

const SOCIALS = [
  { label: "Instagram", Icon: Instagram, href: "#" },
  { label: "Facebook", Icon: Facebook, href: "#" },
  {
    label: "Pinterest",
    Icon: () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <line x1="12" y1="17" x2="12" y2="22" />
        <path d="M5 12a7 7 0 0 1 14 0c0 3.87-3.13 7-7 7" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    href: "#",
  },
  { label: "YouTube", Icon: Youtube, href: "#" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-forest text-ivory">
      {/* ── Newsletter ────────────────────────────────────────── */}
      <div className="border-b border-ivory/10">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-14 lg:py-20 text-center">
          <p className="eyebrow !text-gold mb-4">Stay Connected</p>
          <h2 className="font-heading text-3xl sm:text-4xl font-medium text-ivory mb-3">
            Join the Sanskruti Family
          </h2>
          <p className="text-ivory/60 text-sm max-w-md mx-auto mb-8 font-body">
            Be the first to know about new collections, exclusive offers and
            styling inspiration delivered straight to your inbox.
          </p>

          {subscribed ? (
            <p className="text-gold text-sm font-semibold tracking-wide uppercase font-body">
              ✓ Thank you for subscribing!
            </p>
          ) : (
            <form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row items-center gap-3 max-w-lg mx-auto"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full flex-1 bg-transparent border border-ivory/25 text-ivory placeholder:text-ivory/40 text-sm px-5 py-3.5 font-body tracking-wide focus:outline-none focus:border-gold/60 transition-colors"
              />
              <button
                type="submit"
                className="w-full sm:w-auto bg-gold hover:bg-gold-400 text-forest-900 text-[0.75rem] font-bold uppercase tracking-[0.16em] px-8 py-3.5 font-body transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>

      {/* ── Link Columns ──────────────────────────────────────── */}
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-14 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Col 1: Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Logo tone="ivory" className="mb-5" />
            <p className="text-ivory/55 text-[0.82rem] leading-relaxed font-body max-w-xs">
              Celebrating the artistry of Indian ethnic wear. Every piece is
              crafted with care, blending timeless tradition with modern
              elegance.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="eyebrow !text-gold mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-ivory/65 hover:text-ivory text-[0.82rem] font-body tracking-wide transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Help */}
          <div>
            <h4 className="eyebrow !text-gold mb-5">Help</h4>
            <ul className="space-y-3">
              {HELP_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-ivory/65 hover:text-ivory text-[0.82rem] font-body tracking-wide transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Follow Us */}
          <div>
            <h4 className="eyebrow !text-gold mb-5">Follow Us</h4>
            <div className="flex items-center gap-4">
              {SOCIALS.map(({ label, Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-ivory/20 flex items-center justify-center text-ivory/60 hover:text-gold hover:border-gold/50 transition-all"
                  aria-label={label}
                >
                  <Icon size={18} strokeWidth={1.5} />
                </a>
              ))}
            </div>
            <p className="text-ivory/40 text-[0.75rem] font-body mt-5 tracking-wide">
              @sanskruti.official
            </p>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ────────────────────────────────────────── */}
      <div className="border-t border-ivory/10">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-ivory/40 text-[0.72rem] font-body tracking-wide">
            © {new Date().getFullYear()} Sanskruti Ethnic Couture. All rights
            reserved.
          </p>
          <p className="text-ivory/40 text-[0.72rem] font-body tracking-wide">
            Visa • Mastercard • UPI • Net Banking • COD
          </p>
        </div>
      </div>
    </footer>
  );
}
