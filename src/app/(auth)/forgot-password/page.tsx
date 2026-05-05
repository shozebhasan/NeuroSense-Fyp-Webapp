"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Red_Rose, Space_Mono } from "next/font/google";
import { motion } from "framer-motion";

const redrose = Red_Rose({ subsets: ["latin"], weight: "700" });
const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"] });

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        setSuccess(true);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div
        className="min-h-screen flex flex-col"
        style={{
          backgroundImage: "url('/kh5.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center right",
          backgroundRepeat: "no-repeat",
          backgroundColor: "#eff6ff",
        }}
      >
        <motion.header
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="flex items-center justify-between px-8 pt-8 md:px-14 md:pt-10"
        >
          <Link href="/" className="no-underline">
            <h1
              className={`${redrose.className} uppercase text-4xl md:text-5xl text-blue-700 cursor-pointer`}
            >
              Neuro Sense
            </h1>
          </Link>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500 bg-blue-50/70 backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600" />
            </span>
            <span
              className={`${spaceMono.className} text-xs text-blue-600 font-medium tracking-widest uppercase`}
            >
              PASSWORD RESET
            </span>
          </motion.div>
        </motion.header>

        <main className="flex-1 flex items-center justify-center px-8 py-12 md:px-14">
          <div className="w-full max-w-md">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mb-8"
            >
              <span className={`${redrose.className}`}>
                <h2 className="font-extrabold text-center text-4xl text-blue-700 leading-tight">
                  Check Your Email
                </h2>
              </span>
              <p className="text-slate-500 text-center text-base mt-2 font-medium">
                We&apos;ve sent a password reset link to{" "}
                <strong className="text-blue-600">{email}</strong>
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="rounded-2xl border border-blue-100 bg-white/70 backdrop-blur-md shadow-xl shadow-blue-100/60 px-8 py-8 text-center"
            >
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
              </div>
              <p className="text-slate-500 text-sm mb-6">
                The link expires in 1 hour. Didn&apos;t receive it? Check your spam folder or try again.
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setSuccess(false)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                >
                  ← Use a different email
                </button>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all duration-200"
                  style={{
                    background: "rgba(37,99,235,0.92)",
                    color: "#fff",
                    border: "1px solid rgba(59,130,246,0.4)",
                    boxShadow: "0 4px 24px rgba(37,99,235,0.25), inset 0 1px 0 rgba(255,255,255,0.2)",
                  }}
                >
                  Back to Sign In
                </Link>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundImage: "url('/kh5.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center right",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#eff6ff",
      }}
    >
      <motion.header
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="flex items-center justify-between px-8 pt-8 md:px-14 md:pt-10"
      >
        <Link href="/" className="no-underline">
          <h1
            className={`${redrose.className} uppercase text-4xl md:text-5xl text-blue-700 cursor-pointer`}
          >
            Neuro Sense
          </h1>
        </Link>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500 bg-blue-50/70 backdrop-blur-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600" />
          </span>
          <span
            className={`${spaceMono.className} text-xs text-blue-600 font-medium tracking-widest uppercase`}
          >
            PASSWORD RESET
          </span>
        </motion.div>
      </motion.header>

      <main className="flex-1 flex items-center justify-center px-8 py-12 md:px-14">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mb-8"
          >
            <span className={`${redrose.className}`}>
              <h2 className="font-extrabold text-center text-4xl text-blue-700 leading-tight">
                Reset Password
              </h2>
            </span>
            <p className="text-slate-500 text-center text-base mt-2 font-medium">
              Enter your email and we&apos;ll send a reset link
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="rounded-2xl border border-blue-100 bg-white/70 backdrop-blur-md shadow-xl shadow-blue-100/60 px-8 py-8"
          >
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label
                  className={`${spaceMono.className} block text-[11px] text-blue-600 tracking-widest uppercase mb-2`}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  required
                  autoComplete="email"
                  className="w-full px-4 py-3 rounded-xl border text-slate-800 text-sm font-medium placeholder:text-slate-400 outline-none transition-all duration-150"
                  style={{
                    background: focusedField === "email" ? "#eff6ff" : "#f8fafc",
                    borderColor: focusedField === "email" ? "#3b82f6" : "#e2e8f0",
                    boxShadow: focusedField === "email" ? "0 0 0 3px rgba(59,130,246,0.12)" : "none",
                  }}
                />
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-500 text-sm"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                  </svg>
                  {error}
                </motion.div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="relative mt-1 w-full py-3.5 rounded-xl font-bold text-sm tracking-wide overflow-hidden transition-all duration-200 group"
                style={{
                  background: loading
                    ? "rgba(219,234,254,0.7)"
                    : "rgba(37,99,235,0.92)",
                  color: loading ? "#94a3b8" : "#fff",
                  border: "1px solid rgba(59,130,246,0.4)",
                  boxShadow: loading
                    ? "none"
                    : "0 4px 24px rgba(37,99,235,0.25), inset 0 1px 0 rgba(255,255,255,0.2)",
                  cursor: loading ? "not-allowed" : "pointer",
                  backdropFilter: "blur(8px)",
                }}
              >
                {!loading && (
                  <span
                    className="absolute inset-0 rounded-xl pointer-events-none"
                    style={{
                      background: "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 60%)",
                    }}
                  />
                )}
                <span className="relative flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "spin 1s linear infinite" }}>
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </span>
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-blue-50 text-center">
              <p className="text-slate-500 text-sm">
                Remember your password?{" "}
                <Link
                  href="/login"
                  className="text-blue-600 font-semibold hover:text-blue-700 no-underline transition-colors"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        input::placeholder { color: #94a3b8; }
      `}</style>
    </div>
  );
}