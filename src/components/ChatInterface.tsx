"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { signOut } from "next-auth/react";
import { Red_Rose, Space_Mono } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";

const redrose = Red_Rose({ subsets: ["latin"], weight: "700" });
const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"] });

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface Conversation {
  id: number;
  title: string;
  updated_at: string;
}

interface Props {
  user?: { name?: string | null; email?: string | null };
}

const SUGGESTIONS = [
  "Give me a daily walk plan?",
  "Analyze my Reports",
  "What is a stable blood pressure for a 30 year old",
  "How much water should I drink daily?",
];

function Spinner({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "spin 1s linear infinite", flexShrink: 0 }}>
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
    </svg>
  );
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 py-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-slate-400"
          animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  );
}

function groupByDate(convs: Conversation[]) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
  const week = new Date(today); week.setDate(today.getDate() - 7);
  const month = new Date(today); month.setDate(today.getDate() - 30);

  const groups: Record<string, Conversation[]> = {
    Today: [], Yesterday: [], "Last 7 days": [], "Last 30 days": [], Older: [],
  };

  for (const c of convs) {
    const d = new Date(c.updated_at);
    const day = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    if (day >= today) groups["Today"].push(c);
    else if (day >= yesterday) groups["Yesterday"].push(c);
    else if (d >= week) groups["Last 7 days"].push(c);
    else if (d >= month) groups["Last 30 days"].push(c);
    else groups["Older"].push(c);
  }

  return Object.entries(groups).filter(([, v]) => v.length > 0);
}

export default function ChatInterface({ user }: Props) {
  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatError, setChatError] = useState("");
  const [currentConvId, setCurrentConvId] = useState<number | null>(null);

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [convsLoading, setConvsLoading] = useState(true);
  const [activeConvId, setActiveConvId] = useState<number | null>(null);
  const [loadingConvId, setLoadingConvId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  // Auth
  const [loggingOut, setLoggingOut] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initials = user?.name
    ? user.name.slice(0, 2).toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() ?? "NS";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const fetchConversations = useCallback(async () => {
    setConvsLoading(true);
    try {
      const res = await fetch("/api/conversations");
      const data = await res.json();
      setConversations(data.conversations ?? []);
    } catch {
      // silent
    } finally {
      setConvsLoading(false);
    }
  }, []);

  useEffect(() => { fetchConversations(); }, [fetchConversations]);

  const loadConversation = async (convId: number) => {
    if (loadingConvId === convId) return;
    setLoadingConvId(convId);
    setChatError("");
    try {
      const res = await fetch(`/api/conversations/${convId}`);
      const data = await res.json();
      if (res.ok) {
        const msgs: Message[] = (data.messages ?? []).map((m: { id: number; role: string; content: string; created_at: string }) => ({
          id: String(m.id),
          role: m.role as "user" | "assistant",
          content: m.content,
          timestamp: new Date(m.created_at),
        }));
        setMessages(msgs);
        setCurrentConvId(convId);
        setActiveConvId(convId);
      }
    } catch {
      setChatError("Failed to load conversation.");
    } finally {
      setLoadingConvId(null);
    }
  };

  const deleteConversation = async (convId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingId(convId);
    try {
      await fetch(`/api/conversations/${convId}`, { method: "DELETE" });
      setConversations((prev) => prev.filter((c) => c.id !== convId));
      if (activeConvId === convId) {
        startNewChat();
      }
    } catch {
      // silent
    } finally {
      setDeletingId(null);
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setCurrentConvId(null);
    setActiveConvId(null);
    setChatError("");
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const autoResize = () => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = Math.min(ta.scrollHeight, 200) + "px";
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userContent = input.trim();
    const tempId = Date.now().toString();
    const userMsg: Message = { id: tempId, role: "user", content: userContent, timestamp: new Date() };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setChatError("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
          conversationId: currentConvId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setChatError(data.error ?? "Failed to get a response.");
        setIsTyping(false);
        return;
      }

      if (data.conversationId && !currentConvId) {
        setCurrentConvId(data.conversationId);
        setActiveConvId(data.conversationId);
        fetchConversations();
      } else if (data.conversationId) {
        setConversations((prev) =>
          prev.map((c) =>
            c.id === data.conversationId ? { ...c, updated_at: new Date().toISOString() } : c
          ).sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
        );
      }

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.reply,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setChatError("Network error. Please try again.");
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleLogout = async () => { setLoggingOut(true); await signOut({ callbackUrl: "/login" }); };

  const grouped = groupByDate(conversations);

  return (
    <div className="flex h-screen overflow-hidden bg-blue-50">
      {/* ══ SIDEBAR ══ */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 256 : 0, minWidth: sidebarOpen ? 256 : 0 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="bg-white border-r border-blue-100 flex flex-col overflow-hidden flex-shrink-0"
      >
        {/* Logo */}
        <div className="p-3.5 border-b border-blue-100 flex items-center gap-2 flex-shrink-0">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
            </svg>
          </div>
          <span className={`${redrose.className} text-sm font-bold text-blue-600`}>
            Neuro Sense
          </span>
        </div>

        {/* New chat button */}
        <div className="p-2.5 flex-shrink-0">
          <button
            onClick={startNewChat}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 border border-blue-200 bg-blue-50/50 hover:bg-blue-100 text-blue-600"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            New conversation
          </button>
        </div>

        {/* Conversation History */}
        <div className="flex-1 overflow-y-auto px-2 pb-2">
          {convsLoading ? (
            <div className="flex justify-center py-6 text-slate-400">
              <Spinner size={16} />
            </div>
          ) : conversations.length === 0 ? (
            <p className="text-xs text-center text-slate-500 py-6 px-3">
              No conversations yet.<br/>Start chatting to save history.
            </p>
          ) : (
            grouped.map(([label, convs]) => (
              <div key={label} className="mb-2">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 px-2 py-2">
                  {label}
                </p>
                {convs.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => loadConversation(conv.id)}
                    onMouseEnter={() => setHoveredId(conv.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg cursor-pointer transition-all duration-150 mb-0.5 ${
                      activeConvId === conv.id
                        ? "bg-blue-50 border border-blue-200"
                        : hoveredId === conv.id
                        ? "bg-slate-50 border border-transparent"
                        : "border border-transparent"
                    }`}
                  >
                    {loadingConvId === conv.id ? (
                      <Spinner size={10} />
                    ) : (
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400 flex-shrink-0">
                        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                      </svg>
                    )}
                    <span className={`flex-1 text-xs truncate ${activeConvId === conv.id ? "text-slate-800 font-medium" : "text-slate-500"}`}>
                      {conv.title}
                    </span>
                    {(hoveredId === conv.id || deletingId === conv.id) && (
                      <button
                        onClick={(e) => deleteConversation(conv.id, e)}
                        disabled={deletingId === conv.id}
                        className="p-0.5 rounded hover:text-red-500 transition-colors text-slate-400"
                      >
                        {deletingId === conv.id ? (
                          <Spinner size={10} />
                        ) : (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/>
                          </svg>
                        )}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ))
          )}
        </div>

        {/* Bottom section */}
        <div className="border-t border-blue-100 flex-shrink-0">
          {/* User info */}
          <div className="px-3.5 py-3 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full border border-blue-200 flex items-center justify-center text-[10px] font-semibold text-slate-500 flex-shrink-0 bg-blue-50">
              {initials}
            </div>
            <div className="overflow-hidden flex-1">
              <div className="text-xs font-medium text-slate-700 truncate">
                {user?.name || "User"}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {user?.email}
              </div>
            </div>
          </div>

          {/* Logout button */}
          <div className="px-2.5 pb-3">
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 border border-red-200 hover:bg-red-50 text-red-500"
            >
              {loggingOut ? (
                <><Spinner size={12} />Signing out…</>
              ) : (
                <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>Sign out</>
              )}
            </button>
          </div>
        </div>
      </motion.aside>

      {/* ══ MAIN CHAT AREA ══ */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="px-4 py-2.5 border-b border-blue-100 flex items-center gap-2 flex-shrink-0 bg-white">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded hover:bg-blue-50 transition-colors text-slate-400"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Messages container */}
        <div className="flex-1 overflow-y-auto py-5">
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-full px-6 text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center mb-5">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" fill="#3b82f6"/>
                </svg>
              </div>
              <h2 className={`${redrose.className} text-2xl font-bold text-blue-600 mb-1.5`}>
                How can I help you?
              </h2>
              <p className="text-sm text-slate-500 mb-7">
                Your health analysis companion
              </p>
              <div className="flex flex-wrap gap-2 justify-center max-w-md">
                {SUGGESTIONS.map((s, idx) => (
                  <motion.button
                    key={s}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => { setInput(s); textareaRef.current?.focus(); }}
                    className="px-3.5 py-2 rounded-full text-xs font-medium transition-all duration-150 border border-blue-200 bg-white hover:bg-blue-50 text-slate-600"
                  >
                    {s}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <div className="max-w-2xl mx-auto px-5">
              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mb-5 flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                  >
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1 px-1">
                      {msg.role === "user" ? "You" : "Neuro Sense"}
                    </span>
                    <div
                      className={`max-w-[82%] px-4 py-2.5 rounded-xl text-sm leading-relaxed whitespace-pre-wrap break-words ${
                        msg.role === "user"
                          ? "bg-blue-50 border border-blue-200 text-slate-700"
                          : "bg-white border border-blue-100 text-slate-600"
                      }`}
                    >
                      {msg.content}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 px-1">
                      {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-5 flex flex-col items-start"
                >
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1 px-1">
                    Neuro Sense
                  </span>
                  <div className="px-4 py-2.5 rounded-xl border border-blue-100 bg-white">
                    <TypingDots />
                  </div>
                </motion.div>
              )}

              {chatError && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-red-500 text-xs flex items-center gap-2"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                  </svg>
                  {chatError}
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="p-3 border-t border-blue-100 flex-shrink-0 bg-white">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-end gap-2 p-2 rounded-xl border border-blue-200 bg-white">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => { setInput(e.target.value); autoResize(); }}
                onKeyDown={handleKeyDown}
                placeholder="Message Neuro Sense…"
                rows={1}
                disabled={isTyping}
                className="flex-1 bg-transparent border-none outline-none text-sm resize-none py-1.5 px-2 text-slate-700 placeholder:text-slate-400"
                style={{ fontFamily: "'Inter', sans-serif", lineHeight: 1.5 }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150 ${
                  input.trim() && !isTyping
                    ? "bg-blue-500 hover:bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                }`}
              >
                {isTyping ? (
                  <Spinner size={12} />
                ) : (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19"/><polyline points="5 12 12 5 19 12"/>
                  </svg>
                )}
              </button>
            </div>
            <p className="text-center text-[10px] text-slate-400 mt-2">
              Enter to send · Shift+Enter for new line
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}