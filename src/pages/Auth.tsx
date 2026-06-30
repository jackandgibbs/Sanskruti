import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import Logo from "@/components/Logo";
import { supabase } from "@/lib/supabase";

type Mode = "login" | "signup";

const inputClass =
  "w-full p-3 border-b border-charcoal/20 bg-transparent outline-none text-sm font-body focus:border-forest transition-colors text-charcoal placeholder-charcoal/30";
const labelClass =
  "block text-xs uppercase tracking-widest font-bold text-forest mb-2";

export default function Auth() {
  const [mode, setMode] = useState<Mode>("login");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Login fields
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Sign-up fields
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    dob: "",
    gender: "",
    phone: "",
    email: "",
    password: "",
  });
  const setField = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  // --- Username + password login -------------------------------------------
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginUsername || !loginPassword)
      return toast.error("Enter your username and password");

    setIsLoading(true);
    try {
      // Resolve username -> email (Supabase signs in with email).
      const { data: email, error: rpcError } = await supabase.rpc(
        "email_for_username",
        { uname: loginUsername.trim() }
      );

      if (rpcError) throw rpcError;
      if (!email) {
        toast.error("No account found with that username");
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: loginPassword,
      });
      if (error) {
        toast.error(error.message || "Invalid username or password");
        return;
      }

      toast.success("Welcome back!");
      navigate(from, { replace: true });
    } catch (err: any) {
      toast.error(err?.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- Sign up --------------------------------------------------------------
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const { firstName, lastName, username, dob, gender, phone, email, password } =
      form;

    if (!firstName || !lastName || !username || !email || !password)
      return toast.error("Please fill in all required fields");
    if (!/^[a-zA-Z0-9_.]{3,}$/.test(username))
      return toast.error(
        "Username must be 3+ chars (letters, numbers, _ or . only)"
      );
    if (password.length < 6)
      return toast.error("Password must be at least 6 characters");

    setIsLoading(true);
    try {
      // Make sure the username isn't taken before creating the auth user.
      const { data: takenBy } = await supabase.rpc("email_for_username", {
        uname: username.trim(),
      });
      if (takenBy) {
        toast.error("That username is already taken");
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            username: username.trim(),
            dob: dob || null,
            gender: gender || null,
            phone: phone || null,
          },
        },
      });

      if (error) {
        toast.error(error.message || "Could not create account");
        return;
      }

      // If email confirmation is ON, there's no session yet.
      if (!data.session) {
        toast.success(
          "Account created! Check your email to confirm, then log in."
        );
        setMode("login");
        setLoginUsername(username.trim());
        return;
      }

      toast.success("Welcome to the Sanskruti family!");
      navigate(from, { replace: true });
    } catch (err: any) {
      toast.error(err?.message || "Sign up failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- Forgot password ------------------------------------------------------
  const handleForgotPassword = async () => {
    const email = window.prompt(
      "Enter the email address for your account and we'll send a reset link:"
    );
    if (!email) return;
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/auth/reset`,
      });
      if (error) throw error;
      toast.success("If that email has an account, a reset link is on its way.");
    } catch (err: any) {
      toast.error(err?.message || "Could not send reset email");
    }
  };

  // --- Google ---------------------------------------------------------------
  const handleGoogle = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      toast.error(error.message || "Google sign-in failed");
      setIsLoading(false);
    }
    // On success the browser redirects to Google, so no further code runs here.
  };

  return (
    <div className="min-h-screen flex bg-ivory">
      {/* Left Side - Image Panel */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0 bg-black/10 z-10" />
        <img
          src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80"
          alt="Premium Handcrafted Saree"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute top-10 left-10 z-20">
          <Link
            to="/"
            className="text-white hover:text-gold transition-colors flex items-center gap-2 text-sm uppercase tracking-widest font-bold"
          >
            <ArrowLeft size={16} /> Back to Store
          </Link>
        </div>
      </div>

      {/* Right Side - Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-[440px]">
          <div className="mb-8 text-center lg:text-left">
            <Link to="/" className="inline-block mb-10 lg:hidden">
              <Logo tone="forest" />
            </Link>
            <div className="hidden lg:block mb-8">
              <Logo tone="forest" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif text-forest mb-3">
              {mode === "signup" ? "Create Account" : "Welcome Back"}
            </h1>
            <p className="text-charcoal/60 uppercase tracking-widest text-xs font-body leading-relaxed">
              {mode === "signup"
                ? "Join the Sanskruti family to track orders and save your favorites."
                : "Sign in to access your account."}
            </p>
          </div>

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={isLoading}
            className="w-full h-12 flex items-center justify-center gap-3 border border-charcoal/20 text-charcoal uppercase tracking-[0.15em] text-xs font-bold hover:bg-forest/5 transition-colors disabled:opacity-50 mb-6"
          >
            <GoogleIcon /> Continue with Google
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-charcoal/10" />
            <span className="text-[10px] uppercase tracking-widest text-charcoal/40">
              or
            </span>
            <div className="h-px flex-1 bg-charcoal/10" />
          </div>

          <AnimatePresence mode="wait">
            {mode === "login" ? (
              <motion.form
                key="login-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleLogin}
                className="space-y-6"
              >
                <div>
                  <label className={labelClass}>Username</label>
                  <input
                    type="text"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    className={inputClass}
                    placeholder="e.g. ananya.s"
                    autoComplete="username"
                    required
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className={labelClass + " mb-0"}>Password</label>
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-[11px] uppercase tracking-widest font-bold text-charcoal/50 hover:text-gold transition-colors"
                    >
                      Forgot?
                    </button>
                  </div>
                  <PasswordInput
                    value={loginPassword}
                    onChange={(v) => setLoginPassword(v)}
                    show={showPassword}
                    toggle={() => setShowPassword((s) => !s)}
                    autoComplete="current-password"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 bg-forest text-ivory uppercase tracking-[0.2em] text-xs font-bold hover:bg-gold transition-colors disabled:opacity-50 mt-2"
                >
                  {isLoading ? "Signing in…" : "Sign In"}
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="signup-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleSignup}
                className="space-y-5"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>First Name</label>
                    <input
                      type="text"
                      value={form.firstName}
                      onChange={(e) => setField("firstName", e.target.value)}
                      className={inputClass}
                      placeholder="Ananya"
                      required
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Last Name</label>
                    <input
                      type="text"
                      value={form.lastName}
                      onChange={(e) => setField("lastName", e.target.value)}
                      className={inputClass}
                      placeholder="Sharma"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Username</label>
                  <input
                    type="text"
                    value={form.username}
                    onChange={(e) => setField("username", e.target.value)}
                    className={inputClass}
                    placeholder="ananya.s"
                    autoComplete="username"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Date of Birth</label>
                    <input
                      type="date"
                      value={form.dob}
                      onChange={(e) => setField("dob", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Gender</label>
                    <select
                      value={form.gender}
                      onChange={(e) => setField("gender", e.target.value)}
                      className={`${inputClass} cursor-pointer`}
                    >
                      <option value="">Select</option>
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Phone</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setField("phone", e.target.value)}
                    className={inputClass}
                    placeholder="10 digit number"
                  />
                </div>

                <div>
                  <label className={labelClass}>Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setField("email", e.target.value)}
                    className={inputClass}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>Password</label>
                  <PasswordInput
                    value={form.password}
                    onChange={(v) => setField("password", v)}
                    show={showPassword}
                    toggle={() => setShowPassword((s) => !s)}
                    autoComplete="new-password"
                    placeholder="At least 6 characters"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 bg-forest text-ivory uppercase tracking-[0.2em] text-xs font-bold hover:bg-gold transition-colors disabled:opacity-50 mt-2"
                >
                  {isLoading ? "Creating Account…" : "Create Account"}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Toggle mode */}
          <p className="text-center text-xs text-charcoal/60 mt-8 uppercase tracking-widest">
            {mode === "login" ? "New to Sanskruti?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="text-forest font-bold underline hover:text-gold transition-colors"
            >
              {mode === "login" ? "Create one" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

function PasswordInput({
  value,
  onChange,
  show,
  toggle,
  autoComplete,
  placeholder = "••••••••",
}: {
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  toggle: () => void;
  autoComplete?: string;
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputClass} pr-10`}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required
      />
      <button
        type="button"
        onClick={toggle}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-forest transition-colors"
        tabIndex={-1}
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.34A9 9 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.94H.96a9 9 0 0 0 0 8.12l3.01-2.34z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.47.9 11.43 0 9 0A9 9 0 0 0 .96 4.94l3.01 2.34C4.68 5.16 6.66 3.58 9 3.58z"
      />
    </svg>
  );
}
