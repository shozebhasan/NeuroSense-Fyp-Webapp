"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Signup failed");
        setLoading(false);
        return;
      }

      // Auto sign in after signup
      const signInResult = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (signInResult?.ok) {
        router.push("/chat");
      } else {
        router.push("/login");
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
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
          Create your account
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
          Start building with Neuro Sense today
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "var(--text-secondary)", marginBottom: "7px" }}>
            Username
          </label>
          <input
            type="text"
            placeholder="yourname"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            onFocus={() => setFocusedField("username")}
            onBlur={() => setFocusedField(null)}
            style={inputStyle("username")}
            required
            autoComplete="username"
          />
        </div>

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
          <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "var(--text-secondary)", marginBottom: "7px" }}>
            Password
          </label>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Min. 8 characters"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
              style={{ ...inputStyle("password"), paddingRight: "44px" }}
              required
              autoComplete="new-password"
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
          {form.password && (
            <div style={{ marginTop: "8px", display: "flex", gap: "4px" }}>
              {[1,2,3,4].map((i) => (
                <div key={i} style={{
                  flex: 1, height: "3px", borderRadius: "2px",
                  background: form.password.length >= i * 2
                    ? form.password.length >= 10 ? "#4ade80"
                    : form.password.length >= 6 ? "#facc15"
                    : "#f87171"
                    : "var(--border)",
                  transition: "background 0.2s",
                }} />
              ))}
            </div>
          )}
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
              Creating account...
            </>
          ) : "Create account"}
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: "24px", fontSize: "14px", color: "var(--text-secondary)" }}>
        Already have an account?{" "}
        <Link href="/login" style={{ color: "var(--text-primary)", textDecoration: "none", fontWeight: 500 }}>
          Sign in
        </Link>
      </p>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        input::placeholder { color: var(--text-muted); }
      `}</style>
    </div>
  );
}