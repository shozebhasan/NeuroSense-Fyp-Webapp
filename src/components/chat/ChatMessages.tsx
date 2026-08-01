"use client";

import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Red_Rose } from "next/font/google";
import { formatMessage } from "@/app/utils/formatMessage";

const redrose = Red_Rose({ subsets: ["latin"], weight: "700" });

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 py-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="h-2 w-2 rounded-full bg-[#1A56DB] opacity-50"
          animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.75, repeat: Infinity, delay: i * 0.18 }}
        />
      ))}
    </div>
  );
}

interface ChatMessagesProps {
  messages: Message[];
  isTyping: boolean;
  chatError: string;
}

export default function ChatMessages({
  messages,
  isTyping,
  chatError,
}: ChatMessagesProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6 lg:px-12">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex flex-col ${
                msg.role === "user" ? "items-end" : "items-start"
              }`}
            >
              <span className="mb-1 px-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8FA3BF] sm:text-[11px]">
                {msg.role === "user" ? "You" : "Neura"}
              </span>

              <div
                className={`max-w-[92%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm sm:max-w-[80%] sm:px-4 sm:py-3.5 sm:text-[14px] ${
                  msg.role === "user"
                    ? "rounded-br-sm border border-[#BAD0FB] bg-[#E8F0FE] text-[#1e3a5f]"
                    : "rounded-bl-sm border border-[#E5EDF8] bg-white text-[#1e3a5f]"
                }`}
              >
                {formatMessage(msg.content)}
              </div>

              <span className="mt-1 px-1 text-[10px] text-[#B0BEC5]">
                {msg.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-start"
          >
            <span className="mb-1 px-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8FA3BF] sm:text-[11px]">
              Neuro Sense
            </span>
            <div className="rounded-2xl rounded-bl-sm border border-[#E5EDF8] bg-white px-4 py-3 shadow-sm">
              <TypingDots />
            </div>
          </motion.div>
        )}

        {chatError && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-2.5 text-sm text-[#EF4444]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            <span className="break-words">{chatError}</span>
          </motion.div>
        )}

        <div ref={endRef} />
      </div>
    </div>
  );
}