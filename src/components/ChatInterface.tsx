"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { signOut } from "next-auth/react";
import { useTheme } from "@/context/ThemeContext";

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
  "How much wawter should i drink daily?",
];

function SunIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
    </svg>
  );
}

function Spinner({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "spin 1s linear infinite", flexShrink: 0 }}>
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
    </svg>
  );
}

function TypingDots() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "4px", padding: "2px 0" }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--text-muted)", animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
      ))}
    </div>
  );
}

// Group conversations by relative date
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
  const { theme, toggle } = useTheme();

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

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Load conversation list on mount
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

  // Load a specific conversation's messages
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

  // Delete a conversation
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

  // Start a fresh chat (no ID yet — gets created on first send)
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

      // If new conversation was created, update state + sidebar
      if (data.conversationId && !currentConvId) {
        setCurrentConvId(data.conversationId);
        setActiveConvId(data.conversationId);
        // Refresh sidebar to show new conversation
        fetchConversations();
      } else if (data.conversationId) {
        // Bump updated_at in sidebar without full refetch
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

  // ── styles ──
  const s = {
    sidebarBtn: {
      width: "100%", padding: "8px 12px", background: "transparent",
      border: "1px solid var(--border)", borderRadius: "var(--radius)",
      color: "var(--text-secondary)", fontSize: "13px", cursor: "pointer",
      display: "flex", alignItems: "center", gap: "7px", transition: "all 0.15s",
      fontFamily: "'Inter', sans-serif",
    } as React.CSSProperties,
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: "var(--bg-base)", overflow: "hidden", fontFamily: "'Inter', sans-serif" }}>

      {/* ══ SIDEBAR ══ */}
      <aside style={{
        width: sidebarOpen ? "256px" : "0", minWidth: sidebarOpen ? "256px" : "0",
        background: "var(--bg-surface)", borderRight: "1px solid var(--border-subtle)",
        display: "flex", flexDirection: "column", overflow: "hidden",
        transition: "all 0.2s ease", flexShrink: 0,
      }}>

        {/* Logo */}
        <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
          <div style={{ width: "22px", height: "22px", borderRadius: "5px", background: "linear-gradient(135deg, #d0d0d0 0%, #606060 100%)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" fill="#111"/>
            </svg>
          </div>
          <span style={{ fontFamily: "'Syne', sans-serif", fontSize: "14px", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.1px" }}>Neuro Sense</span>
        </div>

        {/* New chat */}
        <div style={{ padding: "10px", flexShrink: 0 }}>
          <button onClick={startNewChat} style={s.sidebarBtn}
            onMouseEnter={(e) => { const b = e.currentTarget as HTMLButtonElement; b.style.background = "var(--bg-elevated)"; b.style.color = "var(--text-primary)"; }}
            onMouseLeave={(e) => { const b = e.currentTarget as HTMLButtonElement; b.style.background = "transparent"; b.style.color = "var(--text-secondary)"; }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New conversation
          </button>
        </div>

        {/* ── HISTORY ── */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0 8px 8px" }}>
          {convsLoading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "24px 0", color: "var(--text-muted)" }}>
              <Spinner size={16} />
            </div>
          ) : conversations.length === 0 ? (
            <p style={{ fontSize: "12px", color: "var(--text-muted)", textAlign: "center", padding: "24px 12px" }}>
              No conversations yet.<br/>Start chatting to save history.
            </p>
          ) : (
            grouped.map(([label, convs]) => (
              <div key={label} style={{ marginBottom: "8px" }}>
                <p style={{ fontSize: "10px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.6px", padding: "10px 8px 5px" }}>
                  {label}
                </p>
                {convs.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => loadConversation(conv.id)}
                    onMouseEnter={() => setHoveredId(conv.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    style={{
                      display: "flex", alignItems: "center", gap: "6px",
                      padding: "7px 8px",
                      borderRadius: "var(--radius)",
                      cursor: "pointer",
                      background: activeConvId === conv.id ? "var(--bg-card)" : hoveredId === conv.id ? "var(--bg-elevated)" : "transparent",
                      border: activeConvId === conv.id ? "1px solid var(--border)" : "1px solid transparent",
                      transition: "all 0.12s",
                      marginBottom: "2px",
                    }}
                  >
                    {loadingConvId === conv.id ? (
                      <div style={{ color: "var(--text-muted)", flexShrink: 0 }}><Spinner size={12} /></div>
                    ) : (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" style={{ flexShrink: 0, opacity: 0.6 }}>
                        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                      </svg>
                    )}

                    {/* Title */}
                    <span style={{
                      flex: 1, fontSize: "12px",
                      color: activeConvId === conv.id ? "var(--text-primary)" : "var(--text-secondary)",
                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                      lineHeight: 1.4,
                    }}>
                      {conv.title}
                    </span>

                    {/* Delete button — appears on hover */}
                    {(hoveredId === conv.id || deletingId === conv.id) && (
                      <button
                        onClick={(e) => deleteConversation(conv.id, e)}
                        disabled={deletingId === conv.id}
                        style={{
                          background: "none", border: "none", cursor: "pointer",
                          color: "var(--text-muted)", padding: "2px", display: "flex",
                          borderRadius: "4px", flexShrink: 0, transition: "color 0.1s",
                        }}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "var(--error)")}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)")}
                        title="Delete conversation"
                      >
                        {deletingId === conv.id
                          ? <Spinner size={11} />
                          : <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>
                        }
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ))
          )}
        </div>

        {/* ── BOTTOM: theme + user + logout ── */}
        <div style={{ borderTop: "1px solid var(--border-subtle)", flexShrink: 0 }}>

          {/* Theme row */}
          <div style={{ padding: "10px 14px 6px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-muted)" }}>
              {theme === "dark" ? <MoonIcon /> : <SunIcon />}
              <span style={{ fontSize: "12px", fontWeight: 500, color: "var(--text-muted)" }}>
                {theme === "dark" ? "Dark" : "Light"}
              </span>
            </div>
            {/* Toggle switch */}
            <button onClick={toggle} style={{ width: "36px", height: "20px", borderRadius: "10px", border: "1px solid var(--border-strong)", background: theme === "dark" ? "var(--bg-card)" : "var(--bg-elevated)", cursor: "pointer", position: "relative", transition: "all 0.2s", padding: 0 }}>
              <div style={{ position: "absolute", top: "2px", left: theme === "dark" ? "2px" : "16px", width: "14px", height: "14px", borderRadius: "50%", background: theme === "dark" ? "var(--text-muted)" : "var(--text-secondary)", transition: "left 0.2s ease" }} />
            </button>
          </div>

          {/* User info */}
          <div style={{ padding: "6px 14px 8px", display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "var(--bg-card)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 600, color: "var(--text-secondary)", flexShrink: 0 }}>
              {initials}
            </div>
            <div style={{ overflow: "hidden", flex: 1 }}>
              <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", lineHeight: 1.3 }}>
                {user?.name || "User"}
              </div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: "1px" }}>
                {user?.email}
              </div>
            </div>
          </div>

          {/* Logout */}
          <div style={{ padding: "0 10px 12px" }}>
            <button onClick={handleLogout} disabled={loggingOut}
              style={{ ...s.sidebarBtn, color: loggingOut ? "var(--text-muted)" : "var(--text-secondary)", cursor: loggingOut ? "not-allowed" : "pointer" }}
              onMouseEnter={(e) => { if (loggingOut) return; const b = e.currentTarget as HTMLButtonElement; b.style.background = "rgba(248,113,113,0.07)"; b.style.borderColor = "rgba(248,113,113,0.3)"; b.style.color = "var(--error)"; }}
              onMouseLeave={(e) => { const b = e.currentTarget as HTMLButtonElement; b.style.background = "transparent"; b.style.borderColor = "var(--border)"; b.style.color = "var(--text-secondary)"; }}>
              {loggingOut ? <><Spinner size={13} />Signing out…</> : (
                <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>Sign out</>
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* ══ MAIN ══ */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "var(--bg-base)" }}>

        {/* Topbar */}
        <div style={{ padding: "10px 16px", borderBottom: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", gap: "10px", background: "var(--bg-base)", flexShrink: 0 }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: "5px", display: "flex", borderRadius: "6px", transition: "color 0.15s" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          {!sidebarOpen && (
            <button onClick={toggle}
              style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: "5px", display: "flex", transition: "color 0.15s" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)")}>
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            </button>
          )}
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 0" }}>
          {messages.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", padding: "40px 24px", textAlign: "center" }}>
              <div style={{ width: "46px", height: "46px", borderRadius: "12px", background: "var(--bg-card)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "18px" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" fill="var(--text-secondary)"/>
                </svg>
              </div>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "20px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "6px", letterSpacing: "-0.3px" }}>
                How can I help you?
              </h2>
              <p style={{ color: "var(--text-muted)", fontSize: "13px", marginBottom: "28px" }}>
                Neuro Sense, Alll rights reserved
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center", maxWidth: "480px" }}>
                {SUGGESTIONS.map((s) => (
                  <button key={s} onClick={() => { setInput(s); textareaRef.current?.focus(); }}
                    style={{ padding: "8px 14px", background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: "100px", color: "var(--text-secondary)", fontSize: "12px", cursor: "pointer", transition: "all 0.15s" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-elevated)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-surface)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)"; }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ maxWidth: "680px", margin: "0 auto", padding: "0 20px" }}>
              {messages.map((msg) => (
                <div key={msg.id} style={{ marginBottom: "20px", display: "flex", flexDirection: "column", alignItems: msg.role === "user" ? "flex-end" : "flex-start" }}>
                  <span style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "5px", padding: "0 4px" }}>
                    {msg.role === "user" ? "You" : "Neuro Sense"}
                  </span>
                  <div style={{
                    maxWidth: "82%", padding: "11px 15px",
                    borderRadius: msg.role === "user" ? "12px 12px 3px 12px" : "12px 12px 12px 3px",
                    background: msg.role === "user" ? "var(--bg-card)" : "var(--bg-surface)",
                    border: "1px solid var(--border-subtle)",
                    color: "var(--text-primary)", fontSize: "14px", lineHeight: 1.65,
                    whiteSpace: "pre-wrap", wordBreak: "break-word",
                  }}>
                    {msg.content}
                  </div>
                  <span style={{ fontSize: "10px", color: "var(--text-faint)", marginTop: "4px", padding: "0 4px" }}>
                    {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              ))}

              {isTyping && (
                <div style={{ marginBottom: "20px", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                  <span style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "5px", padding: "0 4px" }}>
                    Neuro Sense
                  </span>
                  <div style={{ padding: "11px 15px", borderRadius: "12px 12px 12px 3px", background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}>
                    <TypingDots />
                  </div>
                </div>
              )}

              {chatError && (
                <div style={{ marginBottom: "16px", padding: "10px 14px", background: "rgba(248,113,113,0.07)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: "var(--radius)", color: "var(--error)", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                  {chatError}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div style={{ padding: "12px 20px 18px", borderTop: "1px solid var(--border-subtle)", background: "var(--bg-base)", flexShrink: 0 }}>
          <div style={{ maxWidth: "680px", margin: "0 auto", background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: "12px", display: "flex", alignItems: "flex-end", gap: "8px", padding: "9px 10px 9px 14px" }}>
            <textarea ref={textareaRef} value={input}
              onChange={(e) => { setInput(e.target.value); autoResize(); }}
              onKeyDown={handleKeyDown}
              placeholder="Message Neuro Sense…"
              rows={1} disabled={isTyping}
              style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "var(--text-primary)", fontSize: "14px", fontFamily: "'Inter', sans-serif", resize: "none", lineHeight: 1.6, paddingTop: "1px" }}
            />
            <button onClick={handleSend} disabled={!input.trim() || isTyping}
              style={{ width: "32px", height: "32px", borderRadius: "8px", background: input.trim() && !isTyping ? "var(--text-primary)" : "var(--bg-elevated)", border: "none", cursor: input.trim() && !isTyping ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s" }}>
              {isTyping
                ? <Spinner size={13} />
                : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={input.trim() ? "var(--bg-base)" : "var(--text-muted)"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>
              }
            </button>
          </div>
          <p style={{ textAlign: "center", fontSize: "11px", color: "var(--text-faint)", marginTop: "8px" }}>
            Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes bounce { 0%, 80%, 100% { transform: translateY(0); opacity: 0.4; } 40% { transform: translateY(-5px); opacity: 1; } }
      `}</style>
    </div>
  );
}