"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";

interface ReportUploaderProps {
  onAnalysisComplete: (data: {
    reportId: number;
    conversationId: number;
    analysis: string;
    summaryTitle: string;
  }) => void;
  onCancel: () => void;
}

function Spinner() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="animate-spin"
    >
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}

const STEPS = [
  { icon: "📤", label: "Uploading PDF..." },
  { icon: "🔍", label: "Extracting text from report..." },
  { icon: "🧠", label: "AI is analyzing your report..." },
  { icon: "✅", label: "Analysis complete!" },
];

export default function ReportUploader({
  onAnalysisComplete,
  onCancel,
}: ReportUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(-1);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    if (!f.name.toLowerCase().endsWith(".pdf")) {
      setError("Only PDF files are accepted.");
      return;
    }
    if (f.size > 20 * 1024 * 1024) {
      setError("File too large. Maximum size is 20 MB.");
      return;
    }
    setError("");
    setFile(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFile(dropped);
  };

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    setStep(0);

    try {
      const form = new FormData();
      form.append("file", file);

      setStep(1);
      await new Promise((r) => setTimeout(r, 400));

      setStep(2);
      const res = await fetch("/api/reports/analyze", {
        method: "POST",
        body: form,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Analysis failed. Please try again.");
        setStep(-1);
        setLoading(false);
        return;
      }

      setStep(3);
      await new Promise((r) => setTimeout(r, 600));

      onAnalysisComplete({
        reportId: data.reportId,
        conversationId: data.conversationId,
        analysis: data.analysis,
        summaryTitle: data.summaryTitle,
      });
    } catch {
      setError("Network error. Please check your connection.");
      setStep(-1);
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center  px-12 py-10  gap-0 overflow-y-auto font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-140 flex flex-col gap-6"
      >
        {/* Header */}
        <div className="text-center sm:mt-10">
          
          <h2 className="text-[28px] font-extrabold text-[#1A56DB] mb-2 mt-0 tracking-[-0.5px]">
            Analyze Medical Report
          </h2>
          <p className="text-sm m-0 leading-[1.65]">
            Upload a medical PDF (lab results, prescriptions, diagnostic
            reports) and our AI will extract all findings, flag concerns, and
            explain everything in plain English.
          </p>
        </div>

        {/* What it does */}
        <div className="bg-[rgba(26,86,219,0.04)] border border-[rgba(26,86,219,0.10)] rounded-2xl px-5 py-4 flex flex-col gap-2.5 font-bold">
          {[
            ["🔍", "Analyzes your PDF report"],
            ["🧠", "Identifies diagnoses, test results & abnormal values"],
            ["⚠️", "Flags areas that may need medical attention"],
            [
              "💬",
              "Explains everything in simple, easy-to-understand language",
            ],
            ["🗨️", "Lets you ask follow-up questions about your report"],
          ].map(([icon, text]) => (
            <div key={text} className="flex items-start gap-2.5">
              <span className="text-[15px] leading-5.5 shrink-0">{icon}</span>
              <span className="text-sm text-[#2D4A7A] leading-normal ">
                {text}
              </span>
            </div>
          ))}
        </div>

        {/* Upload zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => !loading && fileInputRef.current?.click()}
          className={[
            "rounded-2xl px-6 py-8 text-center transition-all duration-200",
            loading ? "cursor-not-allowed" : "cursor-pointer",
            dragging
              ? "border-2 border-dashed border-[#1A56DB] bg-[rgba(26,86,219,0.04)]"
              : file
              ? "border-2 border-dashed border-[#31C48D] bg-[rgba(49,196,141,0.04)]"
              : "border-2 border-dashed border-[#BAD0FB] bg-[#fafcff]",
          ].join(" ")}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />

          {file ? (
            <div className="flex flex-col items-center gap-2">
              <span className="text-[32px]">📄</span>
              <p className="text-sm font-semibold text-[#1e3a5f] m-0">
                {file.name}
              </p>
              <p className="text-xs text-[#8FA3BF] m-0 font-['Inter',sans-serif]">
                {(file.size / 1024).toFixed(0)} KB · Click to change
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <span className="text-[32px]">📁</span>
              <p className="text-sm font-semibold text-[#1e3a5f] m-0 font-['Inter',sans-serif]">
                Drop your PDF here, or click to browse
              </p>
              <p className="text-xs text-[#8FA3BF] m-0">
                PDF only · Max 20 MB
              </p>
            </div>
          )}
        </div>

        {/* Progress steps */}
        {loading && step >= 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-[rgba(26,86,219,0.04)] border border-[rgba(26,86,219,0.10)] rounded-xl px-5 py-4 flex flex-col gap-2.5"
          >
            {STEPS.map((s, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 transition-opacity duration-300"
                style={{ opacity: i <= step ? 1 : 0.3 }}
              >
                <span className="text-base w-5.5 text-center">
                  {i < step ? "✅" : i === step ? <Spinner /> : s.icon}
                </span>
                <span
                  className={[
                    "text-[13px] font-['Inter',sans-serif]",
                    i === step
                      ? "text-[#1A56DB] font-semibold"
                      : i < step
                      ? "text-[#31C48D] font-normal"
                      : "text-[#8FA3BF] font-normal",
                  ].join(" ")}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </motion.div>
        )}

        {/* Error */}
        {error && (
          <div className="px-3.5 py-2.5 rounded-[10px] bg-[#FEF2F2] border border-[#FECACA] text-[#EF4444] text-[13px] flex items-center gap-2 font-['Inter',sans-serif]">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            {error}
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-3.25 rounded-[50px] bg-transparent border-[1.5px] border-[#D1DDEF] text-[#6B87B8] text-sm font-semibold cursor-pointer font-['Inter',sans-serif] transition-all duration-150 hover:border-[#1A56DB] disabled:cursor-not-allowed"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={!file || loading}
            className={[
              "flex-2 py-3.25 rounded-[50px] border-none text-sm font-bold cursor-pointer font-['Inter',sans-serif] flex items-center justify-center gap-2 transition-all duration-150",
              !file || loading
                ? "bg-[#D1DDEF] text-[#8FA3BF] cursor-not-allowed shadow-none"
                : "bg-[#1A56DB] text-white shadow-[0_4px_16px_rgba(26,86,219,0.30)] hover:bg-[#1547c2]",
            ].join(" ")}
          >
            {loading ? (
              <>
                <Spinner /> Analyzing…
              </>
            ) : (
              "Analyze Report"
            )}
          </button>
        </div>

        <p className="text-md text-center m-0">
          Your report is processed securely and never shared.
        </p>
      </motion.div>
    </div>
  );
}