"use client";

import React from "react";

interface LiquidGlassButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
}

export default function LiquidGlassButton({
  children,
  onClick,
  className = "",
  type = "button",
}: LiquidGlassButtonProps) {
  return (
    <>
      <style>{`
        @property --lg-angle-1 {
          syntax: "<angle>";
          inherits: false;
          initial-value: -75deg;
        }

        @property --lg-angle-2 {
          syntax: "<angle>";
          inherits: false;
          initial-value: -45deg;
        }

        .lg-button-wrap {
          position: relative;
          z-index: 2;
          border-radius: 999vw;
          background: transparent;
          pointer-events: none;
          transition: all 400ms cubic-bezier(0.25, 1, 0.5, 1);
        }

        .lg-button {
          --border-width: clamp(1px, 0.0625em, 4px);
          all: unset;
          cursor: pointer;
          position: relative;
          -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
          pointer-events: auto;
          z-index: 3;
          font-size: clamp(0.875rem, 1.5vw, 1.125rem);
          background: linear-gradient(
            -75deg,
            rgba(255, 255, 255, 0.03),
            rgba(255, 255, 255, 0.1),
            rgba(255, 255, 255, 0.03)
          );
          border-radius: 999vw;
          box-shadow:
            inset 0 0.125em 0.125em rgba(0, 0, 0, 0.05),
            inset 0 -0.125em 0.125em rgba(255, 255, 255, 0.3),
            0 0.25em 0.125em -0.125em rgba(0, 0, 0, 0.15),
            0 0 0.05em 0.15em inset rgba(255, 255, 255, 0.15),
            0 0 0 0 rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(clamp(1px, 0.125em, 4px));
          -webkit-backdrop-filter: blur(clamp(1px, 0.125em, 4px));
          transition: all 400ms cubic-bezier(0.25, 1, 0.5, 1);
        }

        .lg-button:hover {
          transform: scale(0.975);
          backdrop-filter: blur(0.01em);
          -webkit-backdrop-filter: blur(0.01em);
          box-shadow:
            inset 0 0.125em 0.125em rgba(0, 0, 0, 0.05),
            inset 0 -0.125em 0.125em rgba(255, 255, 255, 0.3),
            0 0.15em 0.05em -0.1em rgba(0, 0, 0, 0.2),
            0 0 0.03em 0.08em inset rgba(255, 255, 255, 0.3),
            0 0 0 0 rgba(255, 255, 255, 0.8);
        }

        .lg-button span {
          position: relative;
          display: block;
          user-select: none;
          -webkit-user-select: none;
          font-family: "Inter", sans-serif;
          letter-spacing: -0.05em;
          font-weight: 500;
          font-size: 1em;
          color: rgba(50, 50, 50, 1);
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-shadow: 0em 0.15em 0.05em rgba(0, 0, 0, 0.08);
          transition: all 400ms cubic-bezier(0.25, 1, 0.5, 1);
          padding-inline: 2.5em;
          padding-block: 0.875em;
          white-space: nowrap;
        }

        .lg-button:hover span {
          text-shadow: 0.025em 0.025em 0.025em rgba(0, 0, 0, 0.1);
        }

        .lg-button span::after {
          content: "";
          display: block;
          position: absolute;
          z-index: 3;
          width: calc(100% - var(--border-width));
          height: calc(100% - var(--border-width));
          top: calc(0% + var(--border-width) / 2);
          left: calc(0% + var(--border-width) / 2);
          box-sizing: border-box;
          border-radius: 999vw;
          overflow: clip;
          background: linear-gradient(
            var(--lg-angle-2),
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.3) 40% 50%,
            rgba(255, 255, 255, 0) 55%
          );
          mix-blend-mode: screen;
          pointer-events: none;
          background-size: 200% 200%;
          background-position: 0% 50%;
          background-repeat: no-repeat;
          transition:
            background-position 500ms cubic-bezier(0.25, 1, 0.5, 1),
            --lg-angle-2 500ms cubic-bezier(0.25, 1, 0.5, 1);
        }

        .lg-button:hover span::after {
          background-position: 25% 50%;
        }

        .lg-button:active span::after {
          background-position: 50% 15%;
          --lg-angle-2: -15deg;
        }

        @media (hover: none) and (pointer: coarse) {
          .lg-button span::after,
          .lg-button:active span::after {
            --lg-angle-2: -45deg;
          }
        }

        .lg-button::after {
          content: "";
          position: absolute;
          z-index: 1;
          inset: 0;
          border-radius: 999vw;
          width: calc(100% + var(--border-width));
          height: calc(100% + var(--border-width));
          top: calc(0% - var(--border-width) / 2);
          left: calc(0% - var(--border-width) / 2);
          padding: var(--border-width);
          box-sizing: border-box;
          background: conic-gradient(
              from var(--lg-angle-1) at 50% 50%,
              rgba(0, 0, 0, 0.3),
              rgba(0, 0, 0, 0) 5% 40%,
              rgba(0, 0, 0, 0.3) 50%,
              rgba(0, 0, 0, 0) 60% 95%,
              rgba(0, 0, 0, 0.3)
            ),
            linear-gradient(180deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.3));
          mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          mask-composite: exclude;
          -webkit-mask: linear-gradient(#000 0 0) content-box,
            linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
          transition:
            all 400ms cubic-bezier(0.25, 1, 0.5, 1),
            --lg-angle-1 500ms ease;
          box-shadow: inset 0 0 0 calc(var(--border-width) / 3) rgba(255, 255, 255, 0.3);
        }

        .lg-button:hover::after {
          --lg-angle-1: -125deg;
        }

        .lg-button:active::after {
          --lg-angle-1: -75deg;
        }

        @media (hover: none) and (pointer: coarse) {
          .lg-button::after,
          .lg-button:hover::after,
          .lg-button:active::after {
            --lg-angle-1: -75deg;
          }
        }

        .lg-button-wrap:has(.lg-button:active) {
          transform: rotate3d(1, 0, 0, 25deg);
        }

        .lg-button-wrap:has(.lg-button:active) .lg-button {
          box-shadow:
            inset 0 0.125em 0.125em rgba(0, 0, 0, 0.05),
            inset 0 -0.125em 0.125em rgba(255, 255, 255, 0.3),
            0 0.125em 0.125em -0.125em rgba(0, 0, 0, 0.15),
            0 0 0.05em 0.15em inset rgba(255, 255, 25, 0.15),
            0 0.225em 0.05em 0 rgba(0, 0, 0, 0.05),
            0 0.25em 0 0 rgba(255, 255, 255, 0.5),
            inset 0 0.25em 0.05em 0 rgba(0, 0, 0, 0.1);
        }

        .lg-button-wrap:has(.lg-button:active) span {
          text-shadow: 0.025em 0.15em 0.05em rgba(0, 0, 0, 0.1);
        }
      `}</style>

      <div className={`lg-button-wrap ${className}`}>
        <button className="lg-button" type={type} onClick={onClick}>
          <span>{children}</span>
        </button>
      </div>
    </>
  );
}