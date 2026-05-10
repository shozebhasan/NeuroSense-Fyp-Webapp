"use client";

import { useRouter } from "next/navigation";
import { Red_Rose } from "next/font/google";
import { motion } from "framer-motion";

const redrose = Red_Rose({ subsets: ["latin"], weight: "700" });

interface BackPageLayoutProps {
  title: string;
  accentColor: string;
  children: React.ReactNode;
}

export default function BackPageLayout({ title, accentColor, children }: BackPageLayoutProps) {
  const router = useRouter();

  return (
    <div style={{
      minHeight: "100vh",
      background: "#F7FAFF",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Top bar */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "0 28px",
          height: 68,
          background: "#fff",
          borderBottom: "1px solid rgba(26,86,219,.08)",
          flexShrink: 0,
        }}
      >
        {/* Back button */}
        <button
          onClick={() => router.push("/chat")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            padding: "8px 16px",
            borderRadius: 50,
            background: "rgba(26,86,219,.07)",
            border: "1.5px solid rgba(26,86,219,.18)",
            cursor: "pointer",
            color: "#1A56DB",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: .5,
            transition: "background .15s, border-color .15s",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(26,86,219,.13)";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(26,86,219,.35)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(26,86,219,.07)";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(26,86,219,.18)";
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back
        </button>

        {/* Title */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 10, height: 10, borderRadius: "50%",
            background: accentColor,
            boxShadow: `0 0 0 3px ${accentColor}33`,
          }} />
          <span className={redrose.className} style={{
            fontSize: 20,
            color: "#1A3A6B",
            textTransform: "uppercase",
            letterSpacing: 1,
          }}>
            {title}
          </span>
        </div>
      </motion.div>

      {/* Page content */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        style={{ flex: 1, padding: "40px 48px" }}
      >
        {children}
      </motion.div>
    </div>
  );
}