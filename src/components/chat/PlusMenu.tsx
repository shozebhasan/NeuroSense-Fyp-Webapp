"use client";

import { useEffect, useRef, RefObject } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PlusMenuProps {
  open: boolean;
  onClose: () => void;
  onAnalyzeReport: () => void;
  anchorRef: RefObject<HTMLButtonElement | null>;
}

const MENU_ITEMS = [
  {
    id: "analyze-report",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    label: "Analyze Report",
    description: "Upload a medical PDF for AI analysis",
    color: "text-[#1A56DB]",
    bgColor: "bg-[rgba(26,86,219,0.07)]",
    borderColor: "border-[rgba(26,86,219,0.15)]",
    hoverBg: "hover:bg-[rgba(26,86,219,0.07)]",
  },
];

export default function PlusMenu({
  open,
  onClose,
  onAnalyzeReport,
  anchorRef,
}: PlusMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onClose, anchorRef]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, y: 8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.96 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="absolute bottom-[calc(100%+10px)] left-1/2 -translate-x-1/2 z-1000 bg-white border-[1.5px] border-[rgba(26,86,219,0.12)] rounded-2xl shadow-[0_8px_32px_rgba(26,86,219,0.16),0_2px_8px_rgba(0,0,0,0.06)] min-w-60 overflow-hidden"
        >
          {/* Header */}
          <div className="px-4 pt-3 pb-2 border-b border-[rgba(26,86,219,0.07)]">
            <p className="text-[11px] font-bold text-[#8FA3BF] uppercase tracking-[0.8px] m-0 font-['Inter',sans-serif]">
              Features
            </p>
          </div>

          {/* Items */}
          <div className="p-2">
            {MENU_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onClose();
                  onAnalyzeReport();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[10px] border-none bg-transparent cursor-pointer text-left transition-colors duration-130 font-['Inter',sans-serif] ${item.hoverBg}`}
              >
                {/* Icon */}
                <div
                  className={`w-9.5 h-9.5 rounded-[10px] ${item.bgColor} border ${item.borderColor} flex items-center justify-center ${item.color} shrink-0`}
                >
                  {item.icon}
                </div>

                {/* Text */}
                <div>
                  <p className="text-sm font-semibold text-[#1e3a5f] m-0 leading-[1.3]">
                    {item.label}
                  </p>
                  <p className="text-xs text-[#8FA3BF] mt-0.5 m-0 leading-[1.3]">
                    {item.description}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Arrow pointing down */}
          <div className="absolute -bottom-1.75 left-1/2 w-3.5 h-3.5 bg-white border-[1.5px] border-[rgba(26,86,219,0.12)] border-t-0 border-l-0 -translate-x-1/2 rotate-45" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}