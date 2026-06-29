import { Link, Outlet, useLocation, Navigate } from "react-router";
import { motion } from "motion/react";
import Logo from "@/components/Logo";
import { useAuthStore } from "@/store/useAuthStore";

export default function AdminLayout() {
  const { pathname } = useLocation();
  const { user, initialized } = useAuthStore();

  if (!initialized) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#fdfbf7]">
        <p className="text-charcoal/50 font-medium tracking-wide">Verifying authorization...</p>
      </div>
    );
  }

  if (!user || !user.isAdmin) {
    return <Navigate to="/auth" state={{ from: { pathname } }} replace />;
  }

  const links = [
    { name: "Dashboard", href: "/admin" },
    { name: "Products", href: "/admin/products" },
    { name: "Orders", href: "/admin/orders" },
    { name: "Customers", href: "/admin/customers" },
    { name: "Settings", href: "/admin/settings" },
  ];

  return (
    <div className="flex h-screen bg-[#fdfbf7] text-charcoal font-body overflow-hidden">
      {/* Sidebar - Ultra Premium Dark Gradient */}
      <aside className="w-[280px] bg-gradient-to-b from-[#1a3326] to-[#0f1f17] text-ivory flex flex-col shadow-2xl z-20 relative overflow-hidden">
        {/* Subtle decorative background noise/pattern in sidebar */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] pointer-events-none" />

        <div className="p-8 pb-12 border-b border-white/5 flex justify-center relative z-10">
          <Logo tone="ivory" className="scale-110 drop-shadow-md" />
        </div>
        
        <nav className="flex-1 py-8 px-5 space-y-3 relative z-10 overflow-y-auto">
          {links.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.name}
                to={link.href}
                className={`relative block px-5 py-3.5 rounded-lg transition-all duration-300 group overflow-hidden ${
                  isActive
                    ? "text-forest font-semibold shadow-md"
                    : "text-ivory/80 hover:text-white"
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-gold to-[#e8c875]"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                {!isActive && (
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors" />
                )}
                <span className="relative z-10 tracking-wide">{link.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-white/5 relative z-10 bg-black/20">
          <Link to="/" className="flex items-center gap-2 text-sm text-ivory/60 hover:text-gold transition-colors justify-center font-medium tracking-wider uppercase">
            <span>&larr;</span> Back to Storefront
          </Link>
        </div>
      </aside>

      {/* Main Content Area - Soft Luxury Vibe */}
      <main className="flex-1 overflow-auto relative">
        {/* Decorative background blur element */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-forest/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="p-12 max-w-[1400px] mx-auto relative z-10 min-h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
