"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const BACK_ROUTES: Record<string, string> = {
  "/login":           "/",
  "/signup":          "/",
  "/forgot-password": "/login",
  "/reset-password":  "/forgot-password",
};

const PAGE_TITLES: Record<string, string> = {
  "/login":           "Sign in",
  "/signup":          "Create account",
  "/forgot-password": "Forgot password",
  "/reset-password":  "Reset password",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const backHref = BACK_ROUTES[pathname] ?? "/";
  const pageTitle = PAGE_TITLES[pathname] ?? "";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-base)",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle grid */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)
          `,
          backgroundSize: "52px 52px",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Top glow */}
      <div
        style={{
          position: "fixed",
          top: "-25%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "700px",
          height: "500px",
          background:
            "radial-gradient(ellipse at center, rgba(255,255,255,0.025) 0%, transparent 68%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Top bar — back button left, logo center */}
      <header
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "18px 24px",
        }}
      >
        {/* Back button — absolute left */}
        <button
          onClick={() => router.push(backHref)}
          style={{
            position: "absolute",
            left: "24px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "var(--bg-elevated)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            padding: "7px 12px",
            color: "var(--text-secondary)",
            fontSize: "13px",
            fontFamily: "'Inter', sans-serif",
            cursor: "pointer",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-hover)";
            (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-elevated)";
            (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)";
          }}
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back
        </button>

        {/* Logo — centered */}
        <Link href="/" style={{ textDecoration: "none" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "9px",
            }}
          >
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "7px",
                background: "linear-gradient(135deg, #e0e0e0 0%, #707070 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"
                  fill="#111"
                />
              </svg>
            </div>
            <span
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "16px",
                fontWeight: 700,
                color: "var(--text-primary)",
                letterSpacing: "-0.2px",
              }}
            >
              Neuro Sense
            </span>
          </div>
        </Link>
      </header>

      {/* Page title pill */}
      {pageTitle && (
        <div
          style={{
            position: "relative",
            zIndex: 1,
            textAlign: "center",
            marginTop: "8px",
            marginBottom: "4px",
          }}
        >
          <span
            style={{
              display: "inline-block",
              fontSize: "11px",
              fontWeight: 500,
              letterSpacing: "0.6px",
              textTransform: "uppercase",
              color: "var(--text-muted)",
            }}
          >
            {pageTitle}
          </span>
        </div>
      )}

      {/* Card content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px 24px 48px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ width: "100%", maxWidth: "400px" }}>{children}</div>
      </div>
    </div>
  );
}