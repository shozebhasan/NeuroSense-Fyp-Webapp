"use client";

import { useState, useCallback, useEffect } from "react";
import { signOut } from "next-auth/react";

import Sidebar from "@/components/chat/Sidebar";
import TopNav from "@/components/chat/TopNav";
import EmptyState from "@/components/chat/EmptyState";
import ChatMessages, { Message } from "@/components/chat/ChatMessages";
import ChatInput from "@/components/chat/ChatInput";
import ReportUploader from "@/components/reports/ReportUploader";

interface Conversation {
  id: number;
  title: string;
  updated_at: string;
}

// What the center area is showing
type CenterMode =
  | "empty" // default empty state
  | "chat" // active chat messages
  | "report-upload" // ReportUploader form
  | "report-chat"; // chat that is follow-up on a report

interface ActiveReport {
  reportId: number;
  conversationId: number;
  analysis: string; // full AI analysis, sent with every follow-up
  summaryTitle: string;
}

interface Props {
  user?: { name?: string | null; email?: string | null };
}

export default function ChatInterface({ user }: Props) {
  // ── Center mode ─────────────────────────────────────────────────────────────
  const [centerMode, setCenterMode] = useState<CenterMode>("empty");
  const [activeReport, setActiveReport] = useState<ActiveReport | null>(null);

  // ── Chat state ──────────────────────────────────────────────────────────────
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatError, setChatError] = useState("");
  const [currentConvId, setCurrentConvId] = useState<number | null>(null);

  // ── Sidebar state ───────────────────────────────────────────────────────────
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [convsLoading, setConvsLoading] = useState(true);
  const [activeConvId, setActiveConvId] = useState<number | null>(null);
  const [loadingConvId, setLoadingConvId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  // ── Load conversations ──────────────────────────────────────────────────────
  const fetchConversations = useCallback(async () => {
    setConvsLoading(true);
    try {
      const res = await fetch("/api/conversations");
      const data = await res.json();
      setConversations(data.conversations ?? []);
    } catch {
      /* silent */
    } finally {
      setConvsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // ── Load a saved conversation ───────────────────────────────────────────────
  const loadConversation = async (convId: number) => {
    if (loadingConvId === convId) return;
    setLoadingConvId(convId);
    setChatError("");
    try {
      const res = await fetch(`/api/conversations/${convId}`);
      const data = await res.json();
      if (res.ok) {
        const msgs: Message[] = (data.messages ?? []).map(
          (m: {
            id: number;
            role: string;
            content: string;
            created_at: string;
          }) => ({
            id: String(m.id),
            role: m.role as "user" | "assistant",
            content: m.content,
            timestamp: new Date(m.created_at),
          }),
        );
        setMessages(msgs);
        setCurrentConvId(convId);
        setActiveConvId(convId);
        setActiveReport(null);
        setCenterMode(msgs.length > 0 ? "chat" : "empty");
      }
    } catch {
      setChatError("Failed to load conversation.");
    } finally {
      setLoadingConvId(null);
    }
  };

  // ── Delete conversation ─────────────────────────────────────────────────────
  const deleteConversation = async (convId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingId(convId);
    try {
      await fetch(`/api/conversations/${convId}`, { method: "DELETE" });
      setConversations((prev) => prev.filter((c) => c.id !== convId));
      if (activeConvId === convId) startNewChat();
    } catch {
      /* silent */
    } finally {
      setDeletingId(null);
    }
  };

  // ── New chat ────────────────────────────────────────────────────────────────
  const startNewChat = () => {
    setMessages([]);
    setCurrentConvId(null);
    setActiveConvId(null);
    setActiveReport(null);
    setChatError("");
    setInput("");
    setCenterMode("empty");
  };

  // ── Regular chat send ───────────────────────────────────────────────────────
  const handleSend = async () => {
    // If we're in report-chat mode, delegate to report follow-up
    if (centerMode === "report-chat" && activeReport) {
      return handleReportFollowup();
    }

    if (!input.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setChatError("");
    setCenterMode("chat");
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
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
          prev
            .map((c) =>
              c.id === data.conversationId
                ? { ...c, updated_at: new Date().toISOString() }
                : c,
            )
            .sort(
              (a, b) =>
                new Date(b.updated_at).getTime() -
                new Date(a.updated_at).getTime(),
            ),
        );
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.reply,
          timestamp: new Date(),
        },
      ]);
    } catch {
      setChatError("Network error — is the server running?");
    } finally {
      setIsTyping(false);
    }
  };

  // ── Report follow-up send ───────────────────────────────────────────────────
  const handleReportFollowup = async () => {
    if (!input.trim() || isTyping || !activeReport) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setChatError("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/reports/followup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analysis: activeReport.analysis,
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          conversationId: activeReport.conversationId,
          reportId: activeReport.reportId,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setChatError(data.error ?? "Follow-up failed.");
        setIsTyping(false);
        return;
      }

      // Update conversation position in sidebar
      setConversations((prev) =>
        prev
          .map((c) =>
            c.id === activeReport.conversationId
              ? { ...c, updated_at: new Date().toISOString() }
              : c,
          )
          .sort(
            (a, b) =>
              new Date(b.updated_at).getTime() -
              new Date(a.updated_at).getTime(),
          ),
      );

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.reply,
          timestamp: new Date(),
        },
      ]);
    } catch {
      setChatError("Network error — is the server running?");
    } finally {
      setIsTyping(false);
    }
  };

  // ── Report analysis complete ────────────────────────────────────────────────
  const handleAnalysisComplete = (data: {
    reportId: number;
    conversationId: number;
    analysis: string;
    summaryTitle: string;
  }) => {
    setActiveReport(data);
    setCurrentConvId(data.conversationId);
    setActiveConvId(data.conversationId);
    setCenterMode("report-chat");

    // Show the analysis as the first assistant message
    setMessages([
      {
        id: "report-analysis",
        role: "assistant",
        content: data.analysis,
        timestamp: new Date(),
      },
    ]);

    fetchConversations(); // update sidebar
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    await signOut({ callbackUrl: "/login" });
  };

  // ── Determine what to show in the center ───────────────────────────────────
  const showUploader = centerMode === "report-upload";
  const showMessages =
    (centerMode === "chat" || centerMode === "report-chat") &&
    messages.length > 0;
  const showEmpty =
    centerMode === "empty" && messages.length === 0 && !isTyping;

  return (
    <div className="flex h-screen overflow-hidden bg-[#F7FAFF] font-sans">
      <Sidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen((v) => !v)}
        onNewChat={startNewChat}
        conversations={conversations}
        convsLoading={convsLoading}
        activeConvId={activeConvId}
        loadingConvId={loadingConvId}
        deletingId={deletingId}
        onLoadConversation={loadConversation}
        onDeleteConversation={deleteConversation}
        user={user}
        loggingOut={loggingOut}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col overflow-hidden bg-white">
        <TopNav />

        {/* ── CENTER AREA ── */}
        {showUploader && (
          <ReportUploader
            onAnalysisComplete={handleAnalysisComplete}
            onCancel={() => setCenterMode("empty")}
          />
        )}

        {showEmpty && <EmptyState onSuggestion={(text) => setInput(text)} />}

        {(showMessages || (!showUploader && !showEmpty && isTyping)) && (
          <ChatMessages
            messages={messages}
            isTyping={isTyping}
            chatError={chatError}
          />
        )}

        {/* ── INPUT — hidden during upload ── */}
        {!showUploader && (
          <ChatInput
            value={input}
            onChange={setInput}
            onSend={handleSend}
            isTyping={isTyping}
            onAnalyzeReport={() => {
              startNewChat();
              setCenterMode("report-upload");
            }}
          />
        )}
      </div>
    </div>
  );
}
