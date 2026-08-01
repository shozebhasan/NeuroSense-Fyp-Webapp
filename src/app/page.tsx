"use client";

import {
  Knewave,
  Space_Mono,
  Oswald,
  Hanalei_Fill,
  Bungee_Inline,
  Bebas_Neue,
  Red_Rose,
  Roboto_Mono,
  Roboto
} from "next/font/google";
import { motion } from "framer-motion";
import LiquidGlassButton from "@/components/LiquidBtn";
import { useRouter } from "next/navigation"; 
import PoweredByAIBadge from "@/components/Badge";

const knewave = Knewave({ subsets: ["latin"], weight: "400" });
const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"] });
const oswald = Oswald({ subsets: ["latin"], weight: ["400", "700"] });
const hana = Hanalei_Fill({
  subsets: ["latin"],
  weight: "400",
});
const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
});

const bungee = Bungee_Inline({
  subsets: ["latin"],
  weight: "400",
});

const redrose = Red_Rose({
  subsets: ["latin"],
  weight: "700",
});

const roboto_mono = Roboto_Mono({
  subsets: ["latin"],
  weight: "400",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: "400",
});


function BlinkingCursor() {
  return (
    <motion.span
      animate={{ opacity: [1, 0, 1] }}
      transition={{ duration: 1.2, repeat: Infinity }}
      className="inline-block w-0.75 h-[1.1em] bg-blue-600 ml-1 align-middle"
    />
  );
}

export default function Home() {
  const router = useRouter()
  const descLines = [
    "Meet your AI-powered health assistant.",
    "Neuro Sense analyzes reports, detects patterns, suggests care plans",
    "so you can focus on better decisions and faster recovery",
  ];

  return (
    <div
      className="min-h-screen flex flex-col overflow-hidden"
      style={{
        backgroundImage: "url('')",
        backgroundSize: "cover",
        backgroundPosition: "center right",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#eff6ff", 
      }}
    >
      <motion.header
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="flex items-center justify-between px-8 pt-8 md:px-14 md:pt-10"
      >
        <div>
          <h1
            className={`${redrose.className} font-sans uppercase text-4xl md:text-5xl lg:text-6xl text-blue-700`}
          >
            Neuro Sense
          </h1>
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500 bg-blue-50/70 backdrop-blur-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600" />
          </span>
          <span
            className={`${spaceMono.className} text-xs text-blue-600 font-medium tracking-widest uppercase`}
          >
            ANALYZE REPORTS
          </span>
        </motion.div>
      </motion.header>



      <main className="flex-1 flex flex-col md:flex-row justify-between gap-8 px-8 py-10 md:px-14 md:gap-10">

        <div className="flex-1 flex flex-col justify-center max-w-xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-6 inline-flex items-center gap-2 w-fit"
          >
            <PoweredByAIBadge />
          </motion.div>

          <div className="space-y-3">
            {descLines.map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.7,
                  delay: 0.5 + i * 0.15,
                  ease: "easeOut",
                }}
                className={`font-sans leading-relaxed ${
                  i === 0 ? "font-extrabold text-4xl" : "font-medium text-xl"
                }`}
                style={{ color: i === 0 ? "#1d4ed8" : "#475569" }}
              >
                {i === 0 ? (
                  <>
                    {line}
                    <BlinkingCursor />
                  </>
                ) : (
                  line
                )}
              </motion.p>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="mt-10 flex gap-8"
          >
            {[
              { value: "10×", label: "Faster Screening" },
              { value: "98%", label: "Accuracy Rate" },
              { value: "24/7", label: "Always On" },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col gap-1">
                <span
                  className={`font-sans font-extrabold text-2xl md:text-3xl text-blue-600`}
                >
                  {value}
                </span>
                <span
                  className={`font-sans font-semibold text-[10px] uppercase tracking-widest text-gray-600`}
                >
                  {label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="flex-1 hidden md:block" />
      </main>

      <motion.footer
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="flex items-end justify-between px-8 pb-10 md:px-14 md:pb-12 gap-5 "
      >
        <LiquidGlassButton  onClick={() => setTimeout(() => router.push("/signup"), 50)}>
          Signup For Free
        </LiquidGlassButton>

        <LiquidGlassButton className="mr-260" onClick={() => setTimeout(() => router.push("/login"), 50)}>
          Login To Your Account
        </LiquidGlassButton>

        <div
          className={`font-sans text-[20px] font-bold uppercase text-gray-600 `}
        >
          Neuro Sense © 2026
        </div>

        
      </motion.footer>

      
    </div>
  );
}