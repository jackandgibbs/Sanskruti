import { Navigate, Link } from "react-router";
import { useAuthStore } from "@/store/useAuthStore";
import { LogOut, Package, ShieldCheck, MapPin, HeadphonesIcon, CreditCard, Heart, Crown, Gift, MessageSquare, History } from "lucide-react";

export default function Dashboard() {
  const { user, logout, initialized } = useAuthStore();

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory">
        <p className="text-charcoal/50 font-medium tracking-wide">Loading account...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const ACCOUNT_CARDS = [
    {
      title: "Your Orders",
      description: "Track, return, or buy things again",
      icon: <Package size={32} strokeWidth={1.5} className="text-forest mb-4" />,
      link: "/dashboard/orders"
    },
    {
      title: "Login & Security",
      description: "Edit login, name, and mobile number",
      icon: <ShieldCheck size={32} strokeWidth={1.5} className="text-forest mb-4" />,
      link: "/dashboard/security"
    },
    {
      title: "Your Addresses",
      description: "Edit addresses for orders and gifts",
      icon: <MapPin size={32} strokeWidth={1.5} className="text-forest mb-4" />,
      link: "/dashboard/addresses"
    },
    {
      title: "Payment Options",
      description: "Edit or add payment methods",
      icon: <CreditCard size={32} strokeWidth={1.5} className="text-forest mb-4" />,
      link: "/dashboard/payments"
    },
    {
      title: "Your Wishlist",
      description: "View, modify, and share your saved items",
      icon: <Heart size={32} strokeWidth={1.5} className="text-forest mb-4" />,
      link: "/dashboard/wishlist"
    },
    {
      title: "Sanskruti Elite",
      description: "View benefits and membership settings",
      icon: <Crown size={32} strokeWidth={1.5} className="text-forest mb-4" />,
      link: "/dashboard/membership"
    },
    {
      title: "Gift Cards & Vouchers",
      description: "View balance or redeem a card",
      icon: <Gift size={32} strokeWidth={1.5} className="text-forest mb-4" />,
      link: "/dashboard/gift-cards"
    },
    {
      title: "Your Messages",
      description: "View alerts, notifications, and updates",
      icon: <MessageSquare size={32} strokeWidth={1.5} className="text-forest mb-4" />,
      link: "/dashboard/messages"
    },
    {
      title: "Recently Viewed",
      description: "View your browsing history",
      icon: <History size={32} strokeWidth={1.5} className="text-forest mb-4" />,
      link: "/dashboard/history"
    },
    {
      title: "Contact Us",
      description: "Contact our customer service via phone or chat",
      icon: <HeadphonesIcon size={32} strokeWidth={1.5} className="text-forest mb-4" />,
      link: "/contact"
    }
  ];

  return (
    <div className="min-h-screen bg-ivory pt-10 pb-24">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-border gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-serif text-forest mb-2">Your Account</h1>
            <p className="text-charcoal/60 uppercase tracking-widest text-xs font-bold font-body">
              Welcome back, {user.firstName}
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-forest">
            <span className="bg-white px-4 py-2 border border-border">ID: {user.customerId}</span>
            <button 
              onClick={logout}
              className="flex items-center gap-2 hover:text-red-500 transition-colors"
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </div>

        {/* Amazon-style Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ACCOUNT_CARDS.map((card, idx) => (
            <Link 
              key={idx} 
              to={card.link}
              className="bg-white border border-border p-6 hover:shadow-md transition-shadow group flex flex-col justify-start"
            >
              <div className="flex items-center gap-4 mb-2">
                <div className="group-hover:scale-110 transition-transform origin-left">
                  {card.icon}
                </div>
              </div>
              <h2 className="text-xl font-serif text-forest mb-2">{card.title}</h2>
              <p className="text-sm text-charcoal/70 leading-relaxed font-body">
                {card.description}
              </p>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
