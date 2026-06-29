import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useLocation } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Search, Heart, User, ShoppingBag, Package, ShieldCheck, MapPin, HeadphonesIcon, CreditCard, Crown, Gift, MessageSquare, History, ChevronDown, LogOut } from "lucide-react";
import { NAV_LINKS, PRODUCTS, Product } from "@/data/site";
import { cn } from "@/lib/utils";
import Logo from "@/components/Logo";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";

const ANNOUNCEMENT_MESSAGES = [
  "FREE SHIPPING ON ORDERS ABOVE ₹999",
  "HANDCRAFTED HERITAGE WEAVES • SILK & COTTON COLLECTIONS",
  "EASY 15-DAY RETURNS & EXCHANGES",
];

const DESKTOP_LINKS = NAV_LINKS.filter(
  (l) => !["About", "Contact"].includes(l.label)
);

function CartBadge() {
  const count = useCartStore((state) => state.getItemCount());
  if (count === 0) return null;
  return (
    <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-gold text-white text-[0.6rem] font-bold rounded-full flex items-center justify-center">
      {count}
    </span>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [searchCategoryOpen, setSearchCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);

  const { pathname } = useLocation();
  const { user, logout } = useAuthStore();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchCategoryRef = useRef<HTMLDivElement>(null);

  const SEARCH_CATEGORIES = ["All Categories", "Sarees", "Lehengas", "Kurtis", "Festive", "Wedding", "Designer"];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim().length > 1) {
      const filtered = PRODUCTS.filter(p => 
        (p.name.toLowerCase().includes(val.toLowerCase()) ||
        p.category.toLowerCase().includes(val.toLowerCase()) ||
        (p.fabric && p.fabric.toLowerCase().includes(val.toLowerCase()))) &&
        (selectedCategory === "All Categories" || p.category.toLowerCase() === selectedCategory.toLowerCase())
      ).slice(0, 5);
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  };

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 40);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    setMobileOpen(false);
    setAccountMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchCategoryRef.current && !searchCategoryRef.current.contains(event.target as Node)) {
        setSearchCategoryOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setAccountMenuOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setAccountMenuOpen(false);
    }, 200);
  };

  const ACCOUNT_DROPDOWN_LINKS = [
    { label: "Your Orders", to: "/dashboard/orders", icon: Package },
    { label: "Login & Security", to: "/dashboard/security", icon: ShieldCheck },
    { label: "Your Addresses", to: "/dashboard/addresses", icon: MapPin },
    { label: "Payment Options", to: "/dashboard/payments", icon: CreditCard },
    { label: "Your Wishlist", to: "/dashboard/wishlist", icon: Heart },
    { label: "Sanskruti Elite", to: "/dashboard/membership", icon: Crown },
    { label: "Gift Cards", to: "/dashboard/gift-cards", icon: Gift },
    { label: "Messages", to: "/dashboard/messages", icon: MessageSquare },
    { label: "Recently Viewed", to: "/dashboard/history", icon: History },
  ];

  return (
    <>
      {/* ── Announcement Bar ──────────────────────────────────── */}
      <div className="bg-forest text-ivory overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...ANNOUNCEMENT_MESSAGES, ...ANNOUNCEMENT_MESSAGES].map(
            (msg, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-3 px-8 py-2 text-[0.68rem] font-semibold tracking-[0.18em] uppercase font-body"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-gold opacity-70" />
                {msg}
              </span>
            )
          )}
        </div>
      </div>

      {/* ── Main Header ────────────────── */}
      {user ? (
        <header className="sticky top-0 z-50 bg-white shadow-[0_1px_0_rgba(47,93,74,0.08)]">
          {/* TOP TIER */}
          <div className="mx-auto flex flex-col sm:flex-row max-w-[1500px] items-center justify-between px-4 sm:px-6 lg:px-8 py-3 gap-4">
            
            {/* Left: Logo & Mobile Hamburger */}
            <div className="flex items-center gap-4 flex-none order-1">
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-1 -ml-1 transition-colors text-charcoal hover:text-forest"
                aria-label="Open menu"
              >
                <Menu size={24} strokeWidth={1.5} />
              </button>
              <Link to="/">
                <Logo tone="forest" />
              </Link>
            </div>

            {/* Center: Big Search Bar */}
            <div className="flex-1 w-full max-w-[800px] order-3 sm:order-2 relative z-50">
              <div className="flex h-12 w-full shadow-sm rounded-sm overflow-visible border border-charcoal/20 focus-within:border-forest focus-within:ring-1 focus-within:ring-forest transition-all">
                
                {/* Custom Category Dropdown */}
                <div 
                  ref={searchCategoryRef}
                  className="relative hidden md:flex items-center h-full bg-ivory border-r border-charcoal/20 hover:bg-charcoal/5 cursor-pointer"
                  onClick={() => setSearchCategoryOpen(!searchCategoryOpen)}
                >
                  <div className="px-4 text-xs font-bold uppercase tracking-widest text-charcoal/70 flex items-center gap-1">
                    {selectedCategory} <ChevronDown size={14} className="text-charcoal/50" />
                  </div>
                  
                  <AnimatePresence>
                    {searchCategoryOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-1 w-48 bg-white border border-border shadow-xl py-2 z-[60]"
                      >
                        {SEARCH_CATEGORIES.map(category => (
                          <div 
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={cn(
                              "px-4 py-2 text-xs font-bold uppercase tracking-widest cursor-pointer transition-colors",
                              selectedCategory === category 
                                ? "bg-forest/10 text-forest" 
                                : "text-charcoal/70 hover:bg-forest hover:text-ivory"
                            )}
                          >
                            {category}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search for premium ethnic wear..." 
                  className="flex-1 h-full px-4 outline-none text-sm font-body text-charcoal bg-white"
                />
                <button className="h-full px-6 bg-forest text-ivory hover:bg-gold transition-colors flex items-center justify-center">
                  <Search size={20} strokeWidth={2} />
                </button>
                {searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border shadow-xl py-2 z-[100] max-h-80 overflow-y-auto">
                    {searchResults.map(p => (
                      <Link 
                        key={p.id} 
                        to={`/product/${p.id}`}
                        onClick={() => { setSearchQuery(""); setSearchResults([]); }}
                        className="flex items-center gap-4 px-4 py-2 hover:bg-forest/5 transition-colors border-b last:border-0 border-border/40"
                      >
                        <img src={p.image} className="w-10 h-12 object-cover rounded-sm shadow-sm" alt="" />
                        <div>
                          <p className="text-sm font-semibold text-charcoal font-body">{p.name}</p>
                          <p className="text-xs text-charcoal/60 uppercase tracking-widest font-body mt-0.5">{p.category} • ₹{p.price.toLocaleString('en-IN')}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Cart, Profile */}
            <div className="flex items-center gap-4 sm:gap-6 flex-none order-2 sm:order-3 justify-end">
              <div 
                className="relative hidden sm:block"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div className="flex items-center gap-2 cursor-pointer p-1 group">
                  <User size={24} strokeWidth={1.5} className="text-charcoal group-hover:text-forest transition-colors" />
                  <div className="hidden lg:flex flex-col items-start leading-none">
                    <span className="text-[10px] text-charcoal/60 uppercase tracking-widest">Hello, {user.firstName}</span>
                    <span className="text-xs font-bold uppercase tracking-widest flex items-center gap-1 group-hover:text-gold transition-colors">
                      Account & Lists <ChevronDown size={14} />
                    </span>
                  </div>
                </div>

                {/* Account Dropdown Menu */}
                <AnimatePresence>
                  {accountMenuOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full right-0 mt-2 w-[280px] bg-white border border-border shadow-xl z-50 p-6"
                    >
                      <h3 className="text-xs font-bold uppercase tracking-widest text-charcoal mb-4">Your Account</h3>
                      <ul className="space-y-3">
                        {ACCOUNT_DROPDOWN_LINKS.map(link => (
                          <li key={link.label}>
                            <Link to={link.to} className="flex items-center gap-3 text-sm text-charcoal/80 hover:text-gold transition-colors group">
                              <link.icon size={16} strokeWidth={1.5} className="text-charcoal/40 group-hover:text-gold transition-colors" />
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-4 pt-4 border-t border-border/50">
                        <button onClick={logout} className="flex items-center gap-3 text-sm text-red-500 hover:text-red-600 transition-colors">
                          <LogOut size={16} strokeWidth={1.5} />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link to="/cart" className="relative p-1 flex items-center gap-2 transition-colors text-charcoal hover:text-forest group" aria-label="Cart">
                <div className="relative">
                  <ShoppingBag size={24} strokeWidth={1.5} />
                  <CartBadge />
                </div>
                <span className="text-xs uppercase font-bold tracking-widest hidden lg:block group-hover:text-gold transition-colors">Cart</span>
              </Link>
            </div>
          </div>

          {/* BOTTOM TIER (Sub-Nav) */}
          <div className="hidden lg:flex items-center bg-forest/5 h-10 px-8 border-t border-charcoal/5">
            <nav className="flex items-center gap-6">
              <button className="flex items-center gap-1.5 text-[0.75rem] font-bold uppercase tracking-widest text-charcoal hover:text-gold transition-colors">
                <Menu size={16} /> All
              </button>
              {DESKTOP_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    "forest-underline text-[0.7rem] font-semibold uppercase tracking-[0.1em] font-body transition-colors pb-0.5 whitespace-nowrap",
                    pathname === link.to ? "text-forest" : "text-charcoal/80 hover:text-forest"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Link to="/contact" className="ml-auto text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-charcoal hover:text-forest transition-colors">
                Customer Service
              </Link>
            </nav>
          </div>
        </header>
      ) : (
        <header
          className={cn(
            "left-0 right-0 z-50 transition-all duration-500 ease-out",
            pathname === "/"
              ? (scrolled
                  ? "fixed top-0 bg-white/95 backdrop-blur-md shadow-[0_1px_0_rgba(47,93,74,0.08)] py-2"
                  : "absolute top-[32px] bg-transparent py-4")
              : "sticky top-0 bg-white shadow-[0_1px_0_rgba(47,93,74,0.08)] py-2"
          )}
        >
          <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-10 h-[48px] lg:h-[56px] gap-4">
            {/* Left: Hamburger (mobile) + Nav Links (desktop) */}
            <div className="flex items-center gap-4 lg:gap-6 flex-1">
              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(true)}
                className={cn(
                  "lg:hidden p-1 -ml-1 transition-colors",
                  scrolled || pathname !== "/" ? "text-charcoal hover:text-forest" : "text-ivory hover:text-gold"
                )}
                aria-label="Open menu"
              >
                <Menu size={22} strokeWidth={1.5} />
              </button>

              {/* Desktop nav links */}
              <nav className="hidden lg:flex items-center gap-4 xl:gap-6">
                {DESKTOP_LINKS.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={cn(
                      "forest-underline text-[0.7rem] xl:text-[0.75rem] font-semibold uppercase tracking-[0.08em] xl:tracking-[0.1em] font-body transition-colors pb-0.5 whitespace-nowrap",
                      pathname === link.to
                        ? scrolled || pathname !== "/" ? "text-forest" : "text-gold"
                        : scrolled || pathname !== "/" ? "text-charcoal/80 hover:text-forest" : "text-ivory/90 hover:text-gold"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Center: Logo */}
            <Link
              to="/"
              className="flex-none mx-auto"
            >
              <Logo tone={scrolled || pathname !== "/" ? "forest" : "ivory"} />
            </Link>

            {/* Right: Icon actions */}
            <div className="flex items-center gap-3 sm:gap-5 justify-end flex-1">
              {showSearchOverlay ? (
                <div className="relative flex items-center bg-white border border-charcoal/20 px-2 py-1 rounded-sm shadow-sm">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search..."
                    autoFocus
                    className="w-32 sm:w-48 outline-none text-xs font-body text-charcoal bg-white pr-6"
                  />
                  <button 
                    onClick={() => { setShowSearchOverlay(false); setSearchQuery(""); setSearchResults([]); }}
                    className="absolute right-1 text-charcoal/40 hover:text-charcoal transition-colors"
                  >
                    <X size={14} />
                  </button>
                  {searchResults.length > 0 && (
                    <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-border shadow-xl py-2 z-[100] max-h-80 overflow-y-auto">
                      {searchResults.map(p => (
                        <Link 
                          key={p.id} 
                          to={`/product/${p.id}`}
                          onClick={() => { setShowSearchOverlay(false); setSearchQuery(""); setSearchResults([]); }}
                          className="flex items-center gap-3 px-3 py-1.5 hover:bg-forest/5 transition-colors border-b last:border-0 border-border/40"
                        >
                          <img src={p.image} className="w-8 h-10 object-cover rounded-sm shadow-sm" alt="" />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-charcoal truncate font-body">{p.name}</p>
                            <p className="text-[10px] text-charcoal/60 uppercase tracking-widest font-body mt-0.5">{p.category} • ₹{p.price.toLocaleString('en-IN')}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <button 
                  onClick={() => setShowSearchOverlay(true)}
                  className={cn("relative p-1 transition-colors", scrolled || pathname !== "/" ? "text-charcoal/70 hover:text-forest" : "text-ivory hover:text-gold")} 
                  aria-label="Search"
                >
                  <Search size={20} strokeWidth={1.5} />
                </button>
              )}
              <Link to="/dashboard/wishlist" className={cn("relative p-1 transition-colors hidden sm:block", scrolled || pathname !== "/" ? "text-charcoal/70 hover:text-forest" : "text-ivory hover:text-gold")} aria-label="Wishlist">
                <Heart size={20} strokeWidth={1.5} />
              </Link>
              <Link to="/auth" className={cn("relative p-1 transition-colors hidden sm:block", scrolled || pathname !== "/" ? "text-charcoal/70 hover:text-forest" : "text-ivory hover:text-gold")} aria-label="Account">
                <User size={20} strokeWidth={1.5} />
              </Link>
              <Link to="/cart" className={cn("relative p-1 transition-colors", scrolled || pathname !== "/" ? "text-charcoal/70 hover:text-forest" : "text-ivory hover:text-gold")} aria-label="Cart">
                <ShoppingBag size={20} strokeWidth={1.5} />
                <CartBadge />
              </Link>
            </div>
          </div>
        </header>
      )}

      {/* ── Mobile Menu Drawer ────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />

            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 left-0 bottom-0 z-[70] w-[85vw] max-w-[360px] bg-ivory flex flex-col lg:hidden"
            >
              <div className="flex items-center justify-between px-5 py-4 bg-forest text-ivory">
                {user ? (
                  <div className="flex items-center gap-3">
                    <User size={24} />
                    <span className="text-sm font-bold uppercase tracking-widest">Hello, {user.firstName}</span>
                  </div>
                ) : (
                  <Link to="/auth" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest">
                    <User size={24} />
                    Sign In
                  </Link>
                )}
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1 hover:text-gold transition-colors"
                  aria-label="Close menu"
                >
                  <X size={24} strokeWidth={1.5} />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto py-4">
                <div className="px-5 mb-2">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-charcoal/50 mb-3">Shop by Category</h3>
                </div>
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.04 }}
                  >
                    <Link
                      to={link.to}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "block py-3 px-5 text-sm font-semibold uppercase tracking-[0.12em] font-body transition-colors",
                        pathname === link.to
                          ? "bg-forest/10 text-forest"
                          : "text-charcoal/80 hover:bg-forest/5"
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}

                <div className="px-5 mt-6 mb-2">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-charcoal/50 mb-3">Help & Settings</h3>
                </div>
                {ACCOUNT_DROPDOWN_LINKS.slice(0, 4).map(link => (
                  <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)} className="flex items-center gap-3 py-3 px-5 text-sm font-semibold text-charcoal/80 hover:bg-forest/5 transition-colors">
                    {link.label}
                  </Link>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
