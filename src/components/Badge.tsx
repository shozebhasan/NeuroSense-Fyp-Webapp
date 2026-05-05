"use client";

export default function PoweredByAIBadge() {
  return (
    <>
      <style>{`
        @property --gemini-angle {
          syntax: "<angle>";
          inherits: false;
          initial-value: 0deg;
        }

        @keyframes gemini-spin {
          to {
            --gemini-angle: 360deg;
          }
        }

        .gemini-badge-wrap {
          position: relative;
          display: inline-flex;
          border-radius: 0.75rem;
          padding: 2px;
          background: conic-gradient(
            from var(--gemini-angle),
            #4285f4,
            #9b72cb,
            #d96570,
            #d96570,
            #f4a261,
            #4285f4,
            #4285f4,
            #9b72cb,
            #4285f4
          );
          animation: gemini-spin 3s linear infinite;
        }

        .gemini-badge-wrap::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 0.75rem;
          background: conic-gradient(
            from var(--gemini-angle),
            #4285f4,
            #9b72cb,
            #d96570,
            #d96570,
            #f4a261,
            #4285f4,
            #4285f4,
            #9b72cb,
            #4285f4
          );
          filter: blur(6px);
          opacity: 0.5;
          z-index: -1;
          animation: gemini-spin 3s linear infinite;
        }

        .gemini-badge-inner {
          font-family: "Red rose", sans-serif;
          font-size: 0.875rem;
          letter-spacing: 0.2em;
          font-weight: 800;
          text-transform: uppercase;
          color: #374151;
          background: #f9f9f9;
          padding: 0.375rem 0.75rem;
          border-radius: calc(0.75rem - 2px);
          position: relative;
          z-index: 1;
          white-space: nowrap;
        }
      `}</style>

      <div className="gemini-badge-wrap">
        <span className="gemini-badge-inner">Powered by AI</span>
      </div>
    </>
  );
}