"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Red_Rose, Space_Mono } from "next/font/google";
import { motion } from "framer-motion";

const redrose = Red_Rose({ subsets: ["latin"], weight: "700" });
const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"] });

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [form, setForm] = useState({ password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!token) {
      setValidating(false);
      setTokenValid(false);
      return;
    }

    fetch(`/api/auth/reset-password?token=${token}`)
      .then((r) => r.json())
      .then((d) => {
        setTokenValid(d.valid);
        setValidating(false);
      })
      .catch(() => {
        setTokenValid(false);
        setValidating(false);
      });
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: form.password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        setSuccess(true);
        setTimeout(() => router.push("/login"), 2500);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (validating) {
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
              RESET PASSWORD
            </span>
          </motion.div>
        </motion.header>

        <main className="flex-1 flex items-center justify-center px-8 py-12 md:px-14">
          <div className="w-full max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="rounded-2xl border border-blue-100 bg-white/70 backdrop-blur-md shadow-xl shadow-blue-100/60 px-8 py-12 text-center"
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
                className="mx-auto mb-4"
                style={{ animation: "spin 1s linear infinite" }}
              >
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
              <p className="text-slate-500 text-base font-medium">
                Validating reset link...
              </p>
            </motion.div>
          </div>
        </main>
      </div>
    );
  }

  // Invalid token
  if (!tokenValid) {
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
              RESET PASSWORD
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
                  Link Expired
                </h2>
              </span>
              <p className="text-slate-500 text-center text-base mt-2 font-medium">
                This password reset link is no longer valid
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="rounded-2xl border border-blue-100 bg-white/70 backdrop-blur-md shadow-xl shadow-blue-100/60 px-8 py-8 text-center"
            >
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                </div>
              </div>
              <p className="text-slate-500 text-sm mb-6">
                Password reset links are only valid for 1 hour. Please request a new link to continue.
              </p>
              <div className="flex flex-col gap-3">
                <Link
                  href="/forgot-password"
                  className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all duration-200"
                  style={{
                    background: "rgba(37,99,235,0.92)",
                    color: "#fff",
                    border: "1px solid rgba(59,130,246,0.4)",
                    boxShadow: "0 4px 24px rgba(37,99,235,0.25), inset 0 1px 0 rgba(255,255,255,0.2)",
                  }}
                >
                  Request New Link
                </Link>
                <Link
                  href="/login"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                >
                  ← Back to Sign In
                </Link>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    );
  }

  // Success state
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
              PASSWORD UPDATED
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
                  Password Updated!
                </h2>
              </span>
              <p className="text-slate-500 text-center text-base mt-2 font-medium">
                Your password has been changed successfully
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
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              </div>
              <p className="text-slate-500 text-sm mb-6">
                Redirecting you to sign in...
              </p>
              <div className="w-full bg-blue-100 rounded-full h-1.5 overflow-hidden">
                <motion.div
                  className="bg-green-500 h-full rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2.5, ease: "linear" }}
                />
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    );
  }

  // Main form
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
            RESET PASSWORD
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
                Set New Password
              </h2>
            </span>
            <p className="text-slate-500 text-center text-base mt-2 font-medium">
              Choose a strong password for your account
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="rounded-2xl border border-blue-100 bg-white/70 backdrop-blur-md shadow-xl shadow-blue-100/60 px-8 py-8"
          >
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* New Password */}
              <div>
                <label
                  className={`${spaceMono.className} block text-[11px] text-blue-600 tracking-widest uppercase mb-2`}
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    required
                    autoComplete="new-password"
                    className="w-full px-4 py-3 pr-12 rounded-xl border text-slate-800 text-sm font-medium placeholder:text-slate-400 outline-none transition-all duration-150"
                    style={{
                      background: focusedField === "password" ? "#eff6ff" : "#f8fafc",
                      borderColor: focusedField === "password" ? "#3b82f6" : "#e2e8f0",
                      boxShadow: focusedField === "password" ? "0 0 0 3px rgba(59,130,246,0.12)" : "none",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500 transition-colors p-1"
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Password strength indicator */}
                {form.password && (
                  <div className="mt-3">
                    <div className="flex gap-1 mb-1.5">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="h-1 rounded-full flex-1 transition-all duration-200"
                          style={{
                            background:
                              form.password.length >= i * 2
                                ? form.password.length >= 8
                                  ? form.password.length >= 12
                                    ? "#22c55e"
                                    : "#facc15"
                                  : "#f87171"
                                : "#e2e8f0",
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] font-medium text-slate-400">
                      {form.password.length < 6
                        ? "Weak"
                        : form.password.length < 10
                        ? "Fair"
                        : "Strong"}
                    </span>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  className={`${spaceMono.className} block text-[11px] text-blue-600 tracking-widest uppercase mb-2`}
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Repeat your password"
                    value={form.confirm}
                    onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                    onFocus={() => setFocusedField("confirm")}
                    onBlur={() => setFocusedField(null)}
                    required
                    autoComplete="new-password"
                    className="w-full px-4 py-3 pr-12 rounded-xl border text-slate-800 text-sm font-medium placeholder:text-slate-400 outline-none transition-all duration-150"
                    style={{
                      background: focusedField === "confirm" ? "#eff6ff" : "#f8fafc",
                      borderColor:
                        form.confirm && form.confirm !== form.password
                          ? "#f87171"
                          : focusedField === "confirm"
                          ? "#3b82f6"
                          : "#e2e8f0",
                      boxShadow:
                        focusedField === "confirm"
                          ? "0 0 0 3px rgba(59,130,246,0.12)"
                          : "none",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500 transition-colors p-1"
                  >
                    {showConfirm ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                {form.confirm && form.confirm !== form.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-red-500 mt-1.5 font-medium"
                  >
                    Passwords do not match
                  </motion.p>
                )}
              </div>

              {/* Error */}
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

              {/* Submit */}
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
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        style={{ animation: "spin 1s linear infinite" }}
                      >
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                      </svg>
                      Updating...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </span>
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-blue-50 text-center">
              <Link
                href="/login"
                className="text-slate-500 hover:text-blue-600 text-sm font-medium transition-colors inline-flex items-center gap-1 no-underline"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 5l-7 7 7 7" />
                </svg>
                Back to Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </main>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        input::placeholder {
          color: #94a3b8;
        }
      `}</style>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-screen flex items-center justify-center"
          style={{
            backgroundImage: "url('/kh5.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center right",
            backgroundRepeat: "no-repeat",
            backgroundColor: "#eff6ff",
          }}
        >
          <div className="rounded-2xl border border-blue-100 bg-white/70 backdrop-blur-md shadow-xl shadow-blue-100/60 px-8 py-12 text-center">
            <p className="text-slate-500 text-base font-medium">Loading...</p>
          </div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}