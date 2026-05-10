"use client";

import { useRef, useState } from "react";
import PlusMenu from "@/components/chat/PlusMenu";

interface ChatInputProps {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  isTyping: boolean;
  onAnalyzeReport: () => void;
}

function Spinner() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="animate-spin shrink-0"
    >
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}

export default function ChatInput({
  value,
  onChange,
  onSend,
  isTyping,
  onAnalyzeReport,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const plusBtnRef = useRef<HTMLButtonElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const autoResize = () => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = Math.min(ta.scrollHeight, 180) + "px";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isTyping && value.trim()) onSend();
    }
  };

  const canSend = value.trim().length > 0 && !isTyping;

  return (
    <div className="px-10 pb-6 pt-3.5 shrink-0 bg-white border-t border-[rgba(26,86,219,0.06)]">
      <div className="max-w-200 mx-auto flex items-end gap-3">

        {/* + button with popup menu */}
        <div className="relative shrink-0 mb-0.5">
          <button
            ref={plusBtnRef}
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            title="Features"
            className={[
              "w-11.5 h-11.5 rounded-full border-[1.5px] mb-1 cursor-pointer flex items-center justify-center shrink-0 transition-all duration-150",
              menuOpen
                ? "bg-[#E8F0FE] border-[#1A56DB] text-[#1A56DB]"
                : "bg-[#F0F4FA] border-[#D1DDEF] text-[#7A95B8]",
            ].join(" ")}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              
              className="transition-transform duration-200"
              style={{ transform: menuOpen ? "rotate(45deg)" : "rotate(0deg)" }}
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>

          <PlusMenu
            open={menuOpen}
            onClose={() => setMenuOpen(false)}
            onAnalyzeReport={onAnalyzeReport}
            anchorRef={plusBtnRef}
          />
        </div>

        {/* Text input pill */}
        <div className="flex-1 flex items-end bg-white rounded-[26px] border-[1.5px] border-[#D1DDEF] px-5 py-2.5 pr-3.5 gap-2.5 transition-colors duration-150">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              autoResize();
            }}
            onKeyDown={handleKeyDown}
            placeholder="Enter a message..."
            rows={1}
            disabled={isTyping}
            className="flex-1 bg-transparent border-none mb-2 outline-none text-[15px] text-[#1e3a5f] resize-none leading-[1.55] font-['Inter',sans-serif] max-h-45 pt-0.5 placeholder:text-[#9DB3CC] disabled:opacity-70"
          />
          <button
            type="button"
            onClick={() => {
              if (canSend) onSend();
            }}
            disabled={!canSend}
            className={[
              "w-9 h-9 rounded-full border-none flex items-center justify-center text-white shrink-0 transition-all duration-150",
              canSend
                ? "bg-[#1A56DB] cursor-pointer hover:bg-[#1547c2] hover:scale-[1.08]"
                : "bg-[#D1DDEF] cursor-not-allowed",
            ].join(" ")}
          >
            {isTyping ? (
              <Spinner />
            ) : (
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="19" x2="12" y2="5" />
                <polyline points="5 12 12 5 19 12" />
              </svg>
            )}
          </button>
        </div>

        {/* Mic button */}
        <button
          type="button"
          title="Voice input"
          className="w-11.5 h-11.5 rounded-full bg-[#F0F4FA] border-[1.5px] border-[#D1DDEF] cursor-pointer flex items-center justify-center text-[#7A95B8] shrink-0 mb-2 transition-all duration-150 hover:bg-[#E8F0FE] hover:border-[#1A56DB] hover:text-[#1A56DB] "
        >
          <svg
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
            <path d="M19 10v2a7 7 0 01-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </svg>
        </button>
      </div>
    </div>
  );
}