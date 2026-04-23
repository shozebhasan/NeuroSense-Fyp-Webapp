"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [focused, setFocused] = useState(false);

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
      <div style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-lg)",
        padding: "36px",
        textAlign: "center",
      }}>
        <div style={{
          width: "52px",
          height: "52px",
          borderRadius: "50%",
          background: "rgba(74,222,128,0.1)",
          border: "1px solid rgba(74,222,128,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 20px",
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2">
            <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
        </div>
        <h2 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "20px",
          fontWeight: 700,
          color: "var(--text-primary)",
          marginBottom: "8px",
          letterSpacing: "-0.3px",
        }}>
          Check your inbox
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.6, marginBottom: "24px" }}>
          If an account exists for <strong style={{ color: "var(--text-primary)" }}>{email}</strong>, we&apos;ve sent a password reset link. It expires in 1 hour.
        </p>
        <Link href="/login" style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          color: "var(--text-secondary)",
          textDecoration: "none",
          fontSize: "14px",
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Back to sign in
        </Link>
      </div>
    );
  }

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
          Reset your password
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
          Enter your email and we&apos;ll send a reset link
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "var(--text-secondary)", marginBottom: "7px" }}>
            Email address
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={{
              width: "100%",
              padding: "12px 16px",
              background: focused ? "var(--bg-elevated)" : "var(--bg-card)",
              border: `1px solid ${focused ? "#3a3a3a" : "var(--border)"}`,
              borderRadius: "var(--radius)",
              color: "var(--text-primary)",
              fontSize: "15px",
              fontFamily: "'DM Sans', sans-serif",
              outline: "none",
              transition: "all 0.15s ease",
              boxSizing: "border-box",
            }}
            required
            autoComplete="email"
          />
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
              Sending...
            </>
          ) : "Send reset link"}
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: "24px", fontSize: "14px", color: "var(--text-secondary)" }}>
        Remember your password?{" "}
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