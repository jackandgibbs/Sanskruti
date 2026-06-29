import { useState } from "react";
import { motion } from "motion/react";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Newsletter() {
  const [email, setEmail] = useState("");

  return (
    <section className="bg-beige">
      <div className="mx-auto max-w-[1400px] px-5 py-20 lg:px-10 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease }}
          className="mx-auto max-w-xl text-center"
        >
          <span className="eyebrow">Stay Connected</span>

          <h2 className="mt-3 font-heading text-4xl text-forest sm:text-[2.7rem]">
            Get 10% Off Your First Order
          </h2>

          <div className="gold-rule mx-auto mt-5 h-px w-20" />

          <p className="mt-5 text-sm leading-relaxed text-charcoal/60">
            Subscribe to our newsletter for exclusive early access to new
            collections, styling tips, and members-only offers.
          </p>

          {/* Email form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setEmail("");
            }}
            className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:gap-0"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 border border-forest/20 bg-white px-5 py-3.5 text-sm text-charcoal outline-none placeholder:text-charcoal/40 focus:border-forest/50"
            />
            <button type="submit" className="btn-primary shrink-0">
              Subscribe
            </button>
          </form>

          <p className="mt-4 text-xs text-charcoal/40">
            By subscribing you agree to our Privacy Policy. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
