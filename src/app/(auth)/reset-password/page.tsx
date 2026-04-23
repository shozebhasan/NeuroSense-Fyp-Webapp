"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

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
    paddingRight: "44px",
  });

  // Loading state
  if (validating) {
    return (
      <div style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-lg)",
        padding: "48px 36px",
        textAlign: "center",
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" style={{ animation: "spin 1s linear infinite", margin: "0 auto 16px", display: "block" }}>
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
        </svg>
        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Validating reset link...</p>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Invalid token
  if (!tokenValid) {
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
          background: "rgba(255,77,77,0.08)",
          border: "1px solid rgba(255,77,77,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 20px",
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--error)" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
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
          Link expired
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.6, marginBottom: "24px" }}>
          This password reset link is invalid or has expired. Reset links are only valid for 1 hour.
        </p>
        <Link href="/forgot-password" style={{
          display: "inline-block",
          padding: "11px 24px",
          background: "var(--text-primary)",
          color: "var(--bg-base)",
          borderRadius: "var(--radius)",
          textDecoration: "none",
          fontSize: "14px",
          fontWeight: 600,
          marginBottom: "16px",
        }}>
          Request new link
        </Link>
        <br />
        <Link href="/login" style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: "14px" }}>
          Back to sign in
        </Link>
      </div>
    );
  }

  // Success state
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
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12"/>
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
          Password updated
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.6 }}>
          Your password has been changed successfully. Redirecting you to sign in...
        </p>
        <div style={{
          marginTop: "20px",
          height: "3px",
          background: "var(--border)",
          borderRadius: "2px",
          overflow: "hidden",
        }}>
          <div style={{
            height: "100%",
            background: "#4ade80",
            borderRadius: "2px",
            animation: "progress 2.5s linear forwards",
          }} />
        </div>
        <style>{`@keyframes progress { from { width: 0% } to { width: 100% } }`}</style>
      </div>
    );
  }

  // Main form
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
          Set new password
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
          Choose a strong password for your account
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "var(--text-secondary)", marginBottom: "7px" }}>
            New password
          </label>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Min. 8 characters"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
              style={inputStyle("password")}
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
          {/* Strength bar */}
          {form.password && (
            <div style={{ marginTop: "8px" }}>
              <div style={{ display: "flex", gap: "4px", marginBottom: "4px" }}>
                {[1, 2, 3, 4].map((i) => (
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
              <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                {form.password.length < 6 ? "Weak" : form.password.length < 10 ? "Fair" : "Strong"}
              </span>
            </div>
          )}
        </div>

        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "var(--text-secondary)", marginBottom: "7px" }}>
            Confirm password
          </label>
          <div style={{ position: "relative" }}>
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Repeat your password"
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              onFocus={() => setFocusedField("confirm")}
              onBlur={() => setFocusedField(null)}
              style={{
                ...inputStyle("confirm"),
                borderColor: form.confirm && form.confirm !== form.password
                  ? "rgba(255,77,77,0.4)"
                  : focusedField === "confirm" ? "#3a3a3a" : "var(--border)",
              }}
              required
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              style={{
                position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)",
                padding: "4px", display: "flex", alignItems: "center",
              }}
            >
              {showConfirm ? (
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
          {form.confirm && form.confirm !== form.password && (
            <p style={{ fontSize: "12px", color: "var(--error)", marginTop: "6px" }}>Passwords do not match</p>
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
              Updating...
            </>
          ) : "Update password"}
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: "24px", fontSize: "14px", color: "var(--text-secondary)" }}>
        <Link href="/login" style={{
          color: "var(--text-secondary)",
          textDecoration: "none",
          display: "inline-flex",
          alignItems: "center",
          gap: "5px",
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Back to sign in
        </Link>
      </p>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        input::placeholder { color: var(--text-muted); }
      `}</style>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-lg)",
        padding: "48px 36px",
        textAlign: "center",
        color: "var(--text-muted)",
        fontSize: "14px",
      }}>
        Loading...
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}