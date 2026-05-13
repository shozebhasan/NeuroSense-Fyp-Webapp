"use client";

import { useRouter } from "next/navigation";

const TABS = [
  { label: "Results",  route: "/results",  bg: "#E8B84B", hover: "#d4a83a", text: "#fff"    },
  { label: "Take test",     route: "/test",     bg: "#BFCFE7", hover: "#a8bdda", text: "#4A6FA5" },
];

export default function TopNav() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center gap-3.5 py-4.5 px-8 shrink-0 bg-white border-b border-[rgba(26,86,219,.06)] font-sans">
      {TABS.map((tab) => (
        <button
          key={tab.label}
          onClick={() => router.push(tab.route)}
          //className="px-7 py-2.5 rounded-full border-none cursor-pointer text-[15px] font-bold tracking-[0.3px] transition-all duration-150"
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-600 text-sm font-medium hover:bg-blue-100 hover:text-gray-700 transition disabled:opacity-50 cursor-pointer"
          
          >
          {tab.label}
        </button>
      ))}
    </div>
  );
}