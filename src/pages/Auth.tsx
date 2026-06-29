import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router";
import { useAuthStore } from "@/store/useAuthStore";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import Logo from "@/components/Logo";

export default function Auth() {
  const [step, setStep] = useState<"phone" | "otp" | "register">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const login = useAuthStore(state => state.login);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) return toast.error("Please enter a valid phone number");
    
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:3001/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      
      if (res.ok) {
        toast.success(data.message);
        setStep("otp");
      } else {
        toast.error(data.error || "Failed to send OTP");
      }
    } catch (err) {
      toast.error("Network error. Is the local backend running?");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await fetch("http://localhost:3001/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp, firstName, lastName }),
      });
      const data = await res.json();
      
      if (res.ok) {
        login(data.user, data.token);
        toast.success("Successfully logged in!");
        navigate(from, { replace: true });
      } else {
        if (data.error === "First and last name required for new users") {
          toast.info("Looks like you are new! Please enter your details.");
          setStep("register");
        } else {
          toast.error(data.error || "Verification failed");
        }
      }
    } catch (err) {
      toast.error("Network error.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-ivory">
      {/* Left Side - Image Panel */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0 bg-black/10 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80" 
          alt="Premium Jewelry" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute top-10 left-10 z-20">
          <Link to="/" className="text-white hover:text-gold transition-colors flex items-center gap-2 text-sm uppercase tracking-widest font-bold">
            <ArrowLeft size={16} /> Back to Store
          </Link>
        </div>
      </div>

      {/* Right Side - Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-[420px]">
          
          <div className="mb-12 text-center lg:text-left">
            <Link to="/" className="inline-block mb-10 lg:hidden">
              <Logo tone="forest" />
            </Link>
            <div className="hidden lg:block mb-8">
              <Logo tone="forest" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif text-forest mb-3">
              {step === "register" ? "Create Account" : "Welcome Back"}
            </h1>
            <p className="text-charcoal/60 uppercase tracking-widest text-xs font-body leading-relaxed">
              {step === "register" 
                ? "Join the Sanskruti family to track orders and save your favorites." 
                : "Sign in with your phone number to access your account."}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {step === "phone" && (
              <motion.form 
                key="phone-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleSendOtp} 
                className="space-y-6"
              >
                <div>
                  <label className="block text-xs uppercase tracking-widest font-bold text-forest mb-3">Phone Number</label>
                  <div className="flex border-b border-charcoal/20 focus-within:border-forest transition-colors">
                    <span className="flex items-center pr-4 text-charcoal/50 text-sm border-r border-charcoal/10 my-2">+91</span>
                    <input 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full p-3 bg-transparent outline-none text-base font-body text-charcoal placeholder-charcoal/30"
                      placeholder="Enter 10 digit number"
                      required
                    />
                  </div>
                </div>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full h-14 bg-forest text-ivory uppercase tracking-[0.2em] text-xs font-bold hover:bg-gold transition-colors disabled:opacity-50 mt-8"
                >
                  {isLoading ? "Sending OTP..." : "Continue"}
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    login({
                      id: "dev-user-id",
                      customerId: "DEV1234",
                      phone: "9999999999",
                      firstName: "Dev",
                      lastName: "User",
                    }, "mock-token");
                    navigate(from, { replace: true });
                  }}
                  className="w-full h-14 bg-transparent border border-forest text-forest uppercase tracking-[0.2em] text-xs font-bold hover:bg-forest/5 transition-colors mt-4"
                >
                  Bypass Login (Dev)
                </button>
              </motion.form>
            )}

            {step === "otp" && (
              <motion.form 
                key="otp-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleVerifyOtp} 
                className="space-y-6"
              >
                <div>
                  <div className="flex justify-between items-end mb-3">
                    <label className="block text-xs uppercase tracking-widest font-bold text-forest">Enter OTP</label>
                    <button 
                      type="button" 
                      onClick={() => setStep("phone")}
                      className="text-[10px] text-charcoal/50 uppercase tracking-widest hover:text-forest underline"
                    >
                      Change Number
                    </button>
                  </div>
                  <input 
                    type="text" 
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full p-4 border-b border-charcoal/20 bg-transparent outline-none text-xl font-body focus:border-forest text-center tracking-[1em] text-forest placeholder-charcoal/20 transition-colors"
                    placeholder="••••"
                    required
                    maxLength={4}
                  />
                  <p className="text-xs text-gold mt-4 text-center">Use mock OTP: 1234</p>
                </div>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full h-14 bg-forest text-ivory uppercase tracking-[0.2em] text-xs font-bold hover:bg-gold transition-colors disabled:opacity-50 mt-8"
                >
                  {isLoading ? "Verifying..." : "Verify & Login"}
                </button>
              </motion.form>
            )}

            {step === "register" && (
              <motion.form 
                key="register-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleVerifyOtp} 
                className="space-y-8"
              >
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs uppercase tracking-widest font-bold text-forest mb-2">First Name</label>
                    <input 
                      type="text" 
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full p-3 border-b border-charcoal/20 bg-transparent outline-none text-sm font-body focus:border-forest transition-colors"
                      placeholder="e.g. Ananya"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest font-bold text-forest mb-2">Last Name</label>
                    <input 
                      type="text" 
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full p-3 border-b border-charcoal/20 bg-transparent outline-none text-sm font-body focus:border-forest transition-colors"
                      placeholder="e.g. Sharma"
                      required
                    />
                  </div>
                </div>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full h-14 bg-forest text-ivory uppercase tracking-[0.2em] text-xs font-bold hover:bg-gold transition-colors disabled:opacity-50"
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}
