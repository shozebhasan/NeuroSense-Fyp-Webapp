"use client";

import { AnimatePresence } from "framer-motion";
import { Red_Rose } from "next/font/google";

const redrose = Red_Rose({ subsets: ["latin"], weight: "700" });

interface Conversation {
  id: number;
  title: string;
  updated_at: string;
}

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
  onNewChat: () => void;
  conversations: Conversation[];
  convsLoading: boolean;
  activeConvId: number | null;
  loadingConvId: number | null;
  deletingId: number | null;
  onLoadConversation: (id: number) => void;
  onDeleteConversation: (id: number, e: React.MouseEvent) => void;
  user?: { name?: string | null; email?: string | null };
  loggingOut: boolean;
  onLogout: () => void;
}

function groupByDate(convs: Conversation[]) {
  const groups: Record<string, Conversation[]> = {};
  for (const c of convs) {
    const d = new Date(c.updated_at);
    const label = `${String(d.getDate()).padStart(2, "0")}/${String(
      d.getMonth() + 1
    ).padStart(2, "0")}/${d.getFullYear()}`;
    if (!groups[label]) groups[label] = [];
    groups[label].push(c);
  }
  return Object.entries(groups);
}

function Spinner({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
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

export default function Sidebar({
  open,
  onToggle,
  onNewChat,
  conversations,
  convsLoading,
  activeConvId,
  loadingConvId,
  deletingId,
  onLoadConversation,
  onDeleteConversation,
  user,
  loggingOut,
  onLogout,
}: SidebarProps) {
  const grouped = groupByDate(conversations);
  const initials =
    user?.name?.slice(0, 2).toUpperCase() ??
    user?.email?.slice(0, 2).toUpperCase() ??
    "NS";

  return (
    <>
      <AnimatePresence mode="wait" initial={false}>

        {/* ── COLLAPSED STRIP ── */}
        {!open && (
          <div
            key="sb-strip"
            className="w-17 min-w-17 h-screen flex flex-col items-center shrink-0 relative bg-blue-700"
            
          >
            {/* Top logo area */}
            <div className="w-full h-18 flex items-center justify-center border-b border-white/10 relative shrink-0">
              <div className="w-8.5 h-8.5 rounded-[10px] bg-white/16 border border-white/22 flex items-center justify-center text-white text-xs font-bold tracking-[0.5px]">
                NS
              </div>

              {/* Right-edge arrow to open */}
              <button
                onClick={onToggle}
                title="Open sidebar"
                className="absolute top-1/2 -right-3.25 -translate-y-1/2 w-6.5 h-6.5 rounded-full bg-[#1A56DB] border-2 border-white shadow-[0_2px_10px_rgba(26,86,219,0.38)] cursor-pointer flex items-center justify-center text-white z-30 transition-all duration-150 hover:bg-[#1547c2] hover:scale-110"
              >
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.8"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>

            {/* Icon buttons */}
            <div className="flex-1 flex flex-col items-center pt-5 gap-2.5">
              <button
                className="w-10 h-10 rounded-full bg-white/[0.14] border-[1.5px] border-white/25 cursor-pointer flex items-center justify-center text-white transition-colors duration-150 hover:bg-white/24"
                onClick={() => {
                  onToggle();
                  onNewChat();
                }}
                title="New chat"
              >
                <svg
                  width="17"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
            </div>

            {/* User avatar */}
            <div className="pb-5">
              <button
                className="w-10 h-10 rounded-full bg-white/[0.14] border-[1.5px] border-white/25 cursor-pointer flex items-center justify-center text-white text-[11px] font-bold transition-colors duration-150 hover:bg-white/24"
                onClick={onToggle}
                title="Open sidebar"
              >
                {initials}
              </button>
            </div>
          </div>
        )}

        {/* ── EXPANDED PANEL ── */}
        {open && (
          <div
            key="sb-expanded"
            className="w-75 min-w-75 h-screen flex flex-col shrink-0 overflow-hidden border-r border-[rgba(26,86,219,0.10)] shadow-[4px_0_24px_rgba(26,86,219,0.07)]"
            style={{
              background: "rgba(232,242,255,0.92)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
            }}
          >
            {/* Header */}
            <div
              className="px-4 h-16 flex items-center justify-between shrink-0 gap-2.5"
              style={{
                background: "linear-gradient(135deg,#1A56DB 0%,#1e3fa8 100%)",
              }}
            >
              <span
                className={`${redrose.className} text-white text-[19px] font-bold tracking-[1.2px] uppercase leading-none`}
              >
                Neuro Sense
              </span>
              <button
                className="bg-white/12 border border-white/20 rounded-lg cursor-pointer w-8 h-8 flex items-center justify-center text-white/90 transition-all duration-150 hover:bg-white/22 hover:text-white shrink-0"
                onClick={onToggle}
                title="Close sidebar"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
            </div>

            {/* New Chat */}
            <div className="px-3.5 pt-3.5 pb-1.5">
              <button
                className="w-full py-3 rounded-lg bg-blue-600 border-none cursor-pointer text-white text-[13px] font-bold tracking-[1.2px] uppercase transition-all duration-150  hover:bg-blue-700 hover:-translate-y-px hover:shadow-[0_6px_22px_rgba(26,86,219,0.40)] active:translate-y-0"
                onClick={onNewChat}
              >
                + New Chat
              </button>
            </div>

            {/* Conversation list */}
            <div
              className="flex-1 overflow-y-auto px-2.5 pb-2 pt-1 [&::-webkit-scrollbar]:w-0.75 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[rgba(26,86,219,0.18)] [&::-webkit-scrollbar-thumb]:rounded-sm [&::-webkit-scrollbar-thumb:hover]:bg-[rgba(26,86,219,0.34)]"
            >
              {convsLoading ? (
                <div className="flex justify-center pt-9 text-[#1A56DB]">
                  <Spinner size={20} />
                </div>
              ) : conversations.length === 0 ? (
                <div className="text-center py-10 px-5">
                  <div className="w-12 h-12 rounded-full bg-[rgba(26,86,219,0.07)] flex items-center justify-center mx-auto mb-3">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#1A56DB"
                      strokeWidth="1.8"
                    >
                      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                    </svg>
                  </div>
                  <p className="text-[13px] text-[#6B87B8] leading-[1.65] m-0">
                    No conversations yet.
                    <br />
                    Start a new chat!
                  </p>
                </div>
              ) : (
                grouped.map(([dateLabel, convs], groupIdx) => (
                  <div key={dateLabel}>
                    <div className="flex items-center gap-2 my-3.5 mx-1">
                      <div className="flex-1 h-px bg-[rgba(26,86,219,0.10)]" />
                      <span className="text-[10px] font-extrabold text-[#7A9EC2] tracking-[0.5px] whitespace-nowrap uppercase">
                        {dateLabel}
                      </span>
                      <div className="flex-1 h-px bg-[rgba(26,86,219,0.10)]" />
                    </div>

                    {convs.map((conv, idx) => {
                      const num = groupIdx * 10 + idx + 1;
                      const isActive = activeConvId === conv.id;
                      return (
                        <div
                          key={conv.id}
                          className={[
                            "flex items-center gap-2.5 px-2.75 py-2.25 rounded-xl cursor-pointer mb-0.75 border transition-all duration-150 relative group",
                            isActive
                              ? "bg-[rgba(26,86,219,0.09)] border-[rgba(26,86,219,0.22)]"
                              : "border-transparent hover:bg-white/60 hover:border-[rgba(26,86,219,0.14)]",
                          ].join(" ")}
                          onClick={() => onLoadConversation(conv.id)}
                        >
                          <div
                            className={[
                              "w-6.5 h-6.5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 transition-all duration-150",
                              isActive
                                ? "bg-[#1A56DB] text-white"
                                : "bg-[rgba(26,86,219,0.11)] text-[#1A56DB]",
                            ].join(" ")}
                          >
                            {loadingConvId === conv.id ? (
                              <Spinner size={10} />
                            ) : (
                              num
                            )}
                          </div>
                          <span
                            className={[
                              "flex-1 text-[13px] overflow-hidden text-ellipsis whitespace-nowrap leading-[1.4]",
                              isActive
                                ? "text-[#122D6B] font-semibold"
                                : "text-[#2D4A7A] font-normal",
                            ].join(" ")}
                          >
                            {conv.title}
                          </span>
                          <button
                            onClick={(e) => onDeleteConversation(conv.id, e)}
                            disabled={deletingId === conv.id}
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-120 bg-transparent border-none cursor-pointer text-[#9DB5CC] p-0.5 flex items-center shrink-0 rounded hover:text-[#EF4444] disabled:cursor-not-allowed"
                          >
                            {deletingId === conv.id ? (
                              <Spinner size={11} />
                            ) : (
                              <svg
                                width="13"
                                height="13"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6l-1 14H6L5 6" />
                                <path d="M10 11v6M14 11v6" />
                              </svg>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="px-3.5 pt-2.5 pb-4.5 shrink-0 border-t border-[rgba(26,86,219,0.09)]">
              <div className="flex items-center gap-2.5 px-2.75 py-2.25 rounded-xl bg-white/60 border border-[rgba(26,86,219,0.09)] mb-2.5">
                <div
                  className="w-7.5 h-7.5 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0"
                  style={{
                    background: "linear-gradient(135deg,#1A56DB,#60a5fa)",
                  }}
                >
                  {initials}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-[13px] font-semibold text-[#122D6B] m-0 overflow-hidden text-ellipsis whitespace-nowrap font-sans">
                    {user?.name || "User"}
                  </p>
                  <p className="text-[11px] text-[#6B87B8] m-0 overflow-hidden text-ellipsis whitespace-nowrap">
                    {user?.email}
                  </p>
                </div>
              </div>
              <button
                className="w-full py-2.75 rounded-[50px] bg-transparent border-[1.5px] border-[rgba(239,68,68,0.40)] cursor-pointer text-[#EF4444] text-xs font-bold tracking-[1px] uppercase transition-all duration-150 flex items-center justify-center gap-1.75 hover:bg-[rgba(239,68,68,0.07)] hover:border-[rgba(239,68,68,0.65)] disabled:opacity-60 disabled:cursor-not-allowed"
                onClick={onLogout}
                disabled={loggingOut}
              >
                {loggingOut ? (
                  <>
                    <Spinner size={12} />
                    Signing out…
                  </>
                ) : (
                  <>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Log Out
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}