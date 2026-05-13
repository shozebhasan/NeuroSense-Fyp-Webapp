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
    <div className="min-h-screen bg-[#F7FAFF] flex flex-col font-sans">
      {/* Top bar */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex items-center gap-4 px-7 h-17 bg-white border-b border-[rgba(26,86,219,0.08)] shrink-0"
      >
        {/* Back button */}
        <button
          onClick={() => router.push("/chat")}
          className="
            flex items-center gap-2 px-4 py-2 rounded-full
            bg-[rgba(26,86,219,0.07)] border-[1.5px] border-[rgba(26,86,219,0.18)]
            cursor-pointer text-[#1A56DB] text-[13px] font-bold tracking-[0.5px]
            transition-[background,border-color] duration-150
            hover:bg-[rgba(26,86,219,0.13)] hover:border-[rgba(26,86,219,0.35)]
          "
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back
        </button>

        {/* Title */}
        <div className="flex items-center gap-2.5">
          {/* accentColor is dynamic — must stay inline */}
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{
              background: accentColor,
              boxShadow: `0 0 0 3px ${accentColor}33`,
            }}
          />
          <span
            className="font-sans text-[20px] text-[#1A3A6B] uppercase tracking-[1px] font-bold"
          >
            {title}
          </span>
        </div>
      </motion.div>

      {/* Page content */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex-1 p-10 px-12"
      >
        {children}
      </motion.div>
    </div>
  );
}