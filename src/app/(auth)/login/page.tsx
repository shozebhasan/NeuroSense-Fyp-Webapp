"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/chat";
  const authError = searchParams.get("error");

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(
    authError === "CredentialsSignin" ? "Invalid email or password" : ""
  );
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  };

  const inputStyle = (field: string) => ({
    width: "100%",
    padding: "12px 16px",
    background: focusedField === field ? "var(--bg-elevated)" : "var(--bg-card)",
    border: `1px solid ${focusedField === field ? "#3a3a3a" : "var(--border)"}`,
    borderRadius: "var(--radius)",
    color: "var(--text-primary)",
    fontSize: "15px",
    fontFamily: "'DM Sans', sans-serif",
    outline: "none",
    transition: "all 0.15s ease",
    boxSizing: "border-box" as const,
  });

  return (
    <div style={{
      background: "var(--bg-surface)",
      border: "1px solid var(--border-subtle)",
      borderRadius: "var(--radius-lg)",
      padding: "36px",
    }}>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "24px",
          fontWeight: 700,
          color: "var(--text-primary)",
          marginBottom: "6px",
          letterSpacing: "-0.4px",
        }}>
          Welcome back
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
          Sign in to continue to Neuro Sense
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "var(--text-secondary)", marginBottom: "7px" }}>
            Email
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            onFocus={() => setFocusedField("email")}
            onBlur={() => setFocusedField(null)}
            style={inputStyle("email")}
            required
            autoComplete="email"
          />
        </div>

        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "7px" }}>
            <label style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-secondary)" }}>
              Password
            </label>
            <Link href="/forgot-password" style={{ fontSize: "13px", color: "var(--text-secondary)", textDecoration: "none" }}>
              Forgot password?
            </Link>
          </div>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
              style={{ ...inputStyle("password"), paddingRight: "44px" }}
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)",
                padding: "4px", display: "flex", alignItems: "center",
              }}
            >
              {showPassword ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
                  <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div style={{
            padding: "12px 14px",
            background: "rgba(255,77,77,0.08)",
            border: "1px solid rgba(255,77,77,0.2)",
            borderRadius: "var(--radius)",
            color: "var(--error)",
            fontSize: "13px",
            display: "flex", alignItems: "center", gap: "8px",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "13px",
            background: loading ? "var(--bg-elevated)" : "var(--text-primary)",
            color: loading ? "var(--text-muted)" : "var(--bg-base)",
            border: "none",
            borderRadius: "var(--radius)",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "15px",
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            transition: "all 0.15s ease",
            marginTop: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          {loading ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "spin 1s linear infinite" }}>
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
              </svg>
              Signing in...
            </>
          ) : "Sign in"}
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: "24px", fontSize: "14px", color: "var(--text-secondary)" }}>
        Don&apos;t have an account?{" "}
        <Link href="/signup" style={{ color: "var(--text-primary)", textDecoration: "none", fontWeight: 500 }}>
          Create one
        </Link>
      </p>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        input::placeholder { color: var(--text-muted); }
      `}</style>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ color: "var(--text-muted)", textAlign: "center" }}>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}