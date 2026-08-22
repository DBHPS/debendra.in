"use client";
import { useTheme } from "@/context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import data from "@/data/data";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";

export default function Navbar() {
  const { theme, toggleTheme, setTheme } = useTheme();

  /* ─── Feature 2: Gentle Nudge ─── */
  const [showNudge, setShowNudge] = useState(false);
  const timerRef = useRef(null);

  const restartTimer = useCallback(() => {
    setShowNudge(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    
    // Only auto-trigger nudge if we are in systems mode
    if (theme === "systems") {
      timerRef.current = setTimeout(() => {
        setShowNudge(true);
      }, 5000);
    }
  }, [theme]);

  useEffect(() => {
    restartTimer();

    const events = ["scroll", "click", "touchstart", "mousemove", "keydown"];
    const handleInteraction = () => restartTimer();

    events.forEach((evt) => window.addEventListener(evt, handleInteraction, { passive: true }));

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach((evt) => window.removeEventListener(evt, handleInteraction));
    };
  }, [restartTimer]);

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b transition-colors duration-500 ${
        theme === "systems"
          ? "bg-white/80 border-slate-200"
          : "bg-[#18181A]/80 border-[#2A2A2E]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
        {/* Logo / Name */}
        <Link 
          href="/" 
          onClick={(e) => {
            if (window.scrollY > 0) {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          className="flex items-center gap-2 sm:gap-3 group min-w-0"
        >
          <div className="w-9 h-9 shrink-0 rounded-full overflow-hidden ring-2 ring-transparent group-hover:ring-blue-500 transition-all duration-300">
            <Image
              src={data.personal.profileImage}
              alt=""
              width={36}
              height={36}
              className="object-cover w-full h-full"
            />
          </div>
          <span
            className={`font-semibold text-base sm:text-lg tracking-tight truncate transition-colors duration-500 ${
              theme === "systems" ? "text-slate-900" : "text-[#F1F1F1]"
            }`}
          >
            {data.personal.name.split(" ")[0]}
            <span className="text-blue-600">.in</span>
          </span>
        </Link>

        {/* Nav Links - Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {["About", "Experience", "Projects", "Skills"].map((item) => {
            const sectionId = theme === "systems" ? item.toLowerCase() : `narrative-${item.toLowerCase()}`;
            return (
              <a
                key={item}
                href={`#${sectionId}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`text-sm font-medium transition-colors duration-300 hover:text-blue-600 ${
                  theme === "systems" ? "text-slate-600" : "text-[#A1A1AA]"
                }`}
              >
                {item}
              </a>
            );
          })}
        </div>

        {/* Theme Toggle - with gentle nudge animation.
            The sliding knob is positioned as a fraction of the track rather than
            in fixed pixels, so it stays inside the pill when the track shrinks
            on narrow screens. */}
        <div
          className={`relative flex items-center shrink-0 w-[150px] sm:w-[180px] h-10 rounded-full p-1 transition-colors duration-500 ${
            theme === "systems"
              ? "bg-slate-100 border border-slate-200"
              : "bg-[#252529] border border-[#3F3F46]"
          }`}
          role="group"
          aria-label="View mode"
        >
          <motion.div
            aria-hidden="true"
            animate={{ x: theme === "systems" ? "0%" : "100%" }}
            transition={{ type: "spring", stiffness: 500, damping: 35 }}
            className="absolute left-1 top-1 bottom-1 w-[calc(50%-4px)] rounded-full bg-white shadow-sm"
          />
          <button
            type="button"
            aria-pressed={theme === "systems"}
            onClick={() => {
              setShowNudge(false);
              setTheme("systems");
              window.scrollTo({ top: 0, behavior: "instant" });
            }}
            className={`relative z-10 flex-1 min-w-0 text-center text-xs font-semibold tracking-wide transition-colors duration-300 cursor-pointer ${
              theme === "systems" ? "text-slate-900" : "text-slate-400"
            }`}
          >
            Systems
          </button>
          <button
            type="button"
            aria-pressed={theme === "narrative"}
            onClick={() => {
              setShowNudge(false);
              setTheme("narrative");
              window.scrollTo({ top: 0, behavior: "instant" });
            }}
            className={`relative z-10 flex-1 min-w-0 flex items-center justify-center h-full rounded-full text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
              theme === "narrative" ? "text-slate-900" : "text-slate-400"
            } ${showNudge ? "text-blue-600" : ""}`}
          >
            {showNudge && (
              <svg aria-hidden="true" className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                <rect
                  x="0" y="0" width="100%" height="100%" rx="16"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="2"
                  className="wire-path"
                />
              </svg>
            )}
            Narrative
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
