"use client";

import { useRef, useState, useEffect, useCallback } from "react";
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

// Pulse ring animation for recording state
function RecordingRing() {
  return (
    <span className="absolute inset-0 rounded-full animate-ping bg-red-400 opacity-30 pointer-events-none" />
  );
}

// Extend Window to include SpeechRecognition types
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
  
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

  // Voice state
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  // Keep a ref to the latest `value` so the interim/final handlers can read it
  const valueRef = useRef(value);
  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  // Check browser support once on mount
  useEffect(() => {
    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    setSpeechSupported(!!SpeechRecognitionAPI);
  }, []);

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

  const stopRecording = useCallback(() => {
    recognitionRef.current?.stop();
    setIsRecording(false);
  }, []);

  const startRecording = useCallback(() => {
    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) return;

    const recognition = new SpeechRecognitionAPI();
    recognition.lang = "en-US";
    recognition.interimResults = true; // show words as they come
    recognition.continuous = false;    // stop after first pause
    recognitionRef.current = recognition;

    // Snapshot the text already in the box before we start
    const baseText = valueRef.current;

    recognition.onresult = (event: any) => {
      let interim = "";
      let final = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript;
        } else {
          interim += transcript;
        }
      }

      // Show live transcription: base text + what we've heard so far
      const appended = (final || interim).trim();
      const separator = baseText.trim() ? " " : "";
      onChange(baseText + (appended ? separator + appended : ""));
      autoResize();
    };

    recognition.onerror = () => {
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
    setIsRecording(true);
  }, [onChange]);

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Stop recording if component unmounts
  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
    };
  }, []);

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
        <div className="flex-1 flex items-end bg-white rounded-[26px] border-[1.5px] border-[#D1DDEF] px-5 py-2 pr-3.5 gap-2.5 transition-colors duration-150">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              autoResize();
            }}
            onKeyDown={handleKeyDown}
            placeholder={isRecording ? "Listening…" : "Enter a message..."}
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
          title={
            !speechSupported
              ? "Speech recognition not supported in this browser"
              : isRecording
              ? "Stop recording"
              : "Voice input"
          }
          disabled={!speechSupported}
          onClick={toggleRecording}
          className={[
            "relative w-11.5 h-11.5 rounded-full border-[1.5px] flex items-center justify-center shrink-0 mb-1 transition-all duration-150",
            !speechSupported
              ? "bg-[#F0F4FA] border-[#D1DDEF] text-[#C0CCD8] cursor-not-allowed opacity-50"
              : isRecording
              ? "bg-red-50 border-red-400 text-red-500 cursor-pointer"
              : "bg-[#F0F4FA] border-[#D1DDEF] text-[#7A95B8] cursor-pointer hover:bg-[#E8F0FE] hover:border-[#1A56DB] hover:text-[#1A56DB]",
          ].join(" ")}
        >
          {isRecording && <RecordingRing />}

          {isRecording ? (
            // Stop icon while recording
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="relative z-10"
            >
              <rect x="6" y="6" width="12" height="12" rx="2" />
            </svg>
          ) : (
            // Mic icon when idle
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
          )}
        </button>
      </div>

      {/* Recording status bar */}
      {isRecording && (
        <div className="max-w-200 mx-auto mt-1 flex items-center gap-2 pl-[calc(2.875rem+0.75rem+1.25rem)]">
          <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs text-red-500 font-medium tracking-wide">
            Recording… click the button again to stop
          </span>
        </div>
      )}
    </div>
  );
}