"use client";

import { useTheme } from "@/context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      className="
        px-4 py-2 rounded-xl border
        bg-gray-100 dark:bg-zinc-800
        text-black dark:text-white
        border-gray-300 dark:border-zinc-700
        hover:scale-105 transition
      "
    >
      {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
    </button>
  );
}