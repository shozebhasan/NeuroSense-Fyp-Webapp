import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/chat");
  }

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
      {/* Background grid */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "fixed",
          top: "-20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "900px",
          height: "700px",
          background:
            "radial-gradient(ellipse at center, rgba(255,255,255,0.04) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />

      {/* Nav */}
      <nav
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 40px",
          borderBottom: "1px solid var(--border-subtle)",
          backdropFilter: "blur(12px)",
          background: "rgba(8,8,8,0.7)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "7px",
              background: "linear-gradient(135deg, #fff 0%, #888 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"
                fill="#000"
              />
            </svg>
          </div>
          <span
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "17px",
              fontWeight: 700,
              color: "var(--text-primary)",
              letterSpacing: "-0.3px",
            }}
          >
            Neuro Sense
          </span>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <Link
            href="/login"
            style={{
              padding: "8px 18px",
              color: "var(--text-secondary)",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: 500,
              borderRadius: "var(--radius)",
              border: "1px solid var(--border)",
            }}
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            style={{
              padding: "8px 18px",
              background: "var(--text-primary)",
              color: "var(--bg-base)",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: 600,
              borderRadius: "var(--radius)",
            }}
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "80px 24px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 14px",
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "100px",
            marginBottom: "32px",
            fontSize: "12px",
            color: "var(--text-secondary)",
            letterSpacing: "0.5px",
            textTransform: "uppercase",
            fontWeight: 500,
          }}
        >
          <div
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#4ade80",
            }}
          />
          Now available
        </div>

        <h1
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(42px, 7vw, 80px)",
            fontWeight: 800,
            color: "var(--text-primary)",
            letterSpacing: "-2px",
            lineHeight: 1.05,
            marginBottom: "24px",
            maxWidth: "800px",
          }}
        >
          Intelligence that
          <br />
          <span style={{ color: "var(--text-muted)" }}>adapts to you</span>
        </h1>

        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "18px",
            lineHeight: 1.7,
            maxWidth: "520px",
            marginBottom: "40px",
          }}
        >
          Neuro Sense is your AI workspace — built for deep thinking, fast
          answers, and seamless conversation.
        </p>

        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <Link
            href="/signup"
            style={{
              padding: "14px 32px",
              background: "var(--text-primary)",
              color: "var(--bg-base)",
              textDecoration: "none",
              fontSize: "15px",
              fontWeight: 600,
              borderRadius: "var(--radius)",
            }}
          >
            Start for free
          </Link>
          <Link
            href="/login"
            style={{
              padding: "14px 32px",
              background: "transparent",
              color: "var(--text-secondary)",
              textDecoration: "none",
              fontSize: "15px",
              fontWeight: 500,
              borderRadius: "var(--radius)",
              border: "1px solid var(--border)",
            }}
          >
            Sign in
          </Link>
        </div>
      </main>
    </div>
  );
}