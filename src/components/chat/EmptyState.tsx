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
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-8 sm:px-6 sm:py-10 lg:px-12">
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="mb-3 text-center text-3xl font-bold leading-tight text-[#1A56DB] sm:text-4xl lg:text-6xl"
      >
        How can i help you today ?
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="mb-8 text-center text-sm text-[#8FA3BF] sm:text-base lg:text-lg"
      >
        Anything specific you want to ask ?
      </motion.p>

      <div className="grid w-full max-w-5xl grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-2 xl:grid-cols-4">
        {SUGGESTIONS.map((s, i) => (
          <button
            key={i}
            onClick={() => onSuggestion(s.replace(/\n/g, " "))}
            className="
              w-full rounded-lg border-2 border-blue-500 bg-white p-4
              text-left text-sm font-medium leading-relaxed text-gray-700
              shadow-sm transition-transform duration-150 hover:-translate-y-0.5
              hover:shadow-md sm:p-5 sm:text-base lg:text-lg
            "
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}