"use client";

import { motion } from "framer-motion";
import { Red_Rose, Space_Mono } from "next/font/google";

const redrose = Red_Rose({ subsets: ["latin"], weight: "700" });
const spaceMono = Space_Mono({ subsets: ["latin"], weight: "400" });

const SUGGESTIONS = [
  "I've been feeling low on energy lately,\nwhat could be causing it?",
  "I've been feeling low on energy lately,\nwhat could be causing it?",
  "How can I improve my overall health with a busy schedule?",
  "Is intermittent fasting actually good for health?",
];

interface EmptyStateProps {
  onSuggestion: (text: string) => void;
}

export default function EmptyState({ onSuggestion }: EmptyStateProps) {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 48px",
        gap: 0,
      }}
    >
      {/* Heading */}
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="font-sans"
        style={{
          fontSize: 40,
          fontWeight: 700,
          color: "#1A56DB",
          marginBottom: 10,
          textAlign: "center",
          lineHeight: 1.2,
        }}
      >
        How can i help you today ?
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="font-sans"
        style={{
          color: "#8FA3BF",
          fontSize: 14,
          marginBottom: 44,
          textAlign: "center",
        }}
      >
        choose a conversation ...
      </motion.p>

      {/* Suggestion cards */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 18,
          justifyContent: "center",
          maxWidth: 1100,
        }}
      >
        {SUGGESTIONS.map((s, i) => (
          <button
            key={i}
            
            onClick={() => onSuggestion(s.replace(/\n/g, " "))}
            className="p-5 px-6 rounded-xl border-2 hover:-translate-y-px border-blue-500 bg-white cursor-pointer text-left text-sm text-gray-700 leading-relaxed font-medium max-w-65 min-w-65 transition-transform duration-150 shadow-transition whitespace-pre-line"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}