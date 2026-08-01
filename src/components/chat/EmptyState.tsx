"use client";

import { motion } from "framer-motion";
import { Red_Rose, Space_Mono } from "next/font/google";

const redrose = Red_Rose({ subsets: ["latin"], weight: "700" });
const spaceMono = Space_Mono({ subsets: ["latin"], weight: "400" });

const SUGGESTIONS = [
  "I've been feeling low on energy lately, what could be causing it?",
  "I've can't sleep lately, what could be causing it?",
  "How can I improve my overall health with a busy schedule?",
  "Is intermittent fasting actually good for health?",
];

interface EmptyStateProps {
  onSuggestion: (text: string) => void;
}

export default function EmptyState({ onSuggestion }: EmptyStateProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-12 py-10">
      {/* Heading */}
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="font-sans text-6xl font-bold text-[#1A56DB] mb-2.5 text-center leading-[1.2]"
      >
        How can i help you today ?
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="font-sans text-[#8FA3BF] text-lg mb-11 text-center"
      >
        Anything specific you want to ask ?
      </motion.p>

      {/* Suggestion cards */}
      <div className="flex flex-wrap gap-4.5 justify-center max-w-275">
        {SUGGESTIONS.map((s, i) => (
          <button
            key={i}
            onClick={() => onSuggestion(s.replace(/\n/g, " "))}
            className="
              p-5 px-6 rounded-lg border-2 border-blue-500
              bg-white cursor-pointer text-left text-lg text-gray-700
              leading-relaxed font-medium w-64 min-w-64
              transition-transform duration-150 hover:-translate-y-0.5
              shadow-sm hover:shadow-md whitespace-pre-line
            "
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}