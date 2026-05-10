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
    <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 0" }}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#1A56DB",
            opacity: 0.5,
          }}
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

export default function ChatMessages({ messages, isTyping, chatError }: ChatMessagesProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        padding: "24px 48px",
      }}
    >
      <div style={{ maxWidth: 760, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: msg.role === "user" ? "flex-end" : "flex-start",
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  color: "#8FA3BF",
                  marginBottom: 5,
                  paddingLeft: 4,
                  paddingRight: 4,
                }}
              >
                {msg.role === "user" ? "You" : "Neura"}
              </span>
              <div
                style={{
                  maxWidth: "78%",
                  padding: "13px 18px",
                  borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                  background: msg.role === "user" ? "#E8F0FE" : "#fff",
                  border: msg.role === "user" ? "1.5px solid #BAD0FB" : "1.5px solid #E5EDF8",
                  color: "#1e3a5f",
                  fontSize: 14,
                  lineHeight: 1.65,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  boxShadow: "0 2px 10px rgba(26,86,219,0.07)",
                }}
              >
                {formatMessage(msg.content)}
              </div>
              <span
                style={{
                  fontSize: 10,
                  color: "#B0BEC5",
                  marginTop: 4,
                  paddingLeft: 4,
                  paddingRight: 4,
                }}
              >
                {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: 1,
                color: "#8FA3BF",
                marginBottom: 5,
                paddingLeft: 4,
              }}
            >
              Neuro Sense
            </span>
            <div
              style={{
                padding: "13px 18px",
                borderRadius: "18px 18px 18px 4px",
                background: "#fff",
                border: "1.5px solid #E5EDF8",
                boxShadow: "0 2px 10px rgba(26,86,219,0.07)",
              }}
            >
              <TypingDots />
            </div>
          </motion.div>
        )}

        {chatError && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding: "10px 16px",
              borderRadius: 12,
              background: "#FEF2F2",
              border: "1px solid #FECACA",
              color: "#EF4444",
              fontSize: 13,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            {chatError}
          </motion.div>
        )}

        <div ref={endRef} />
      </div>
    </div>
  );
}