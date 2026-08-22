"use client";
import { useTheme, MODE_PATHS } from "@/context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import data from "@/data/data";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";

const SECTIONS = ["About", "Experience", "Projects", "Skills"];

export default function Navbar() {
  const { theme } = useTheme();
  const pathname = usePathname();

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

  /* ─── Mobile menu ─── */
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);

  // Close on navigation between modes, including browser back/forward. Adjusted
  // during render rather than in an effect so the panel never paints open on
  // the new route.
  const [renderedPath, setRenderedPath] = useState(pathname);
  if (renderedPath !== pathname) {
    setRenderedPath(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    const onPointerDown = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) setMenuOpen(false);
    };
    // A resize into the desktop layout leaves the panel orphaned.
    const desktop = window.matchMedia("(min-width: 768px)");
    const onBreakpoint = (e) => {
      if (e.matches) setMenuOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    desktop.addEventListener("change", onBreakpoint);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
      desktop.removeEventListener("change", onBreakpoint);
    };
  }, [menuOpen]);

  const sectionId = (item) =>
    theme === "systems" ? item.toLowerCase() : `narrative-${item.toLowerCase()}`;

  // Collapsing the panel animates its height, and a layout animation running
  // alongside a smooth scroll cancels the scroll outright. So when the panel is
  // open we remember where we are headed and start scrolling once it has shut.
  const pendingSection = useRef(null);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const goToSection = (e, item) => {
    e.preventDefault();
    const id = sectionId(item);
    if (!document.getElementById(id)) return;

    if (menuOpen) {
      pendingSection.current = id;
      setMenuOpen(false);
    } else {
      scrollToSection(id);
    }
  };

  const handleMenuClosed = () => {
    const id = pendingSection.current;
    pendingSection.current = null;
    if (id) scrollToSection(id);
  };

  return (
    <motion.nav
      ref={navRef}
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
          href={MODE_PATHS[theme]}
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
          {/* Hidden on the narrowest phones so the menu button and mode toggle
              both fit without crushing the logo. */}
          <span
            className={`hidden min-[380px]:inline font-semibold text-base sm:text-lg tracking-tight truncate transition-colors duration-500 ${
              theme === "systems" ? "text-slate-900" : "text-[#F1F1F1]"
            }`}
          >
            {data.personal.name.split(" ")[0]}
            <span className="text-blue-600">.in</span>
          </span>
        </Link>

        {/* Nav Links - Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {SECTIONS.map((item) => (
            <a
              key={item}
              href={`#${sectionId(item)}`}
              onClick={(e) => goToSection(e, item)}
              className={`text-sm font-medium transition-colors duration-300 hover:text-blue-600 ${
                theme === "systems" ? "text-slate-600" : "text-[#A1A1AA]"
              }`}
            >
              {item}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Menu button - mobile only */}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className={`md:hidden flex items-center justify-center w-9 h-9 rounded-full border transition-colors duration-300 cursor-pointer ${
              theme === "systems"
                ? "border-slate-200 bg-slate-100 text-slate-700 hover:border-slate-300"
                : "border-[#3F3F46] bg-[#252529] text-[#D4D4D8] hover:border-[#52525B]"
            }`}
          >
            <svg
              aria-hidden="true"
              className="w-4 h-4"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            >
              {menuOpen ? (
                <>
                  <path d="M3.5 3.5l9 9" />
                  <path d="M12.5 3.5l-9 9" />
                </>
              ) : (
                <>
                  <path d="M2 4.5h12" />
                  <path d="M2 8h12" />
                  <path d="M2 11.5h12" />
                </>
              )}
            </svg>
          </button>

          {/* Mode Toggle - with gentle nudge animation.
              These are real links because each mode is its own route; the
              sliding knob is positioned as a fraction of the track so it stays
              inside the pill when the track shrinks on narrow screens. */}
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
            <Link
              href={MODE_PATHS.systems}
              onClick={() => setShowNudge(false)}
              aria-current={theme === "systems" ? "page" : undefined}
              className={`relative z-10 flex-1 min-w-0 flex items-center justify-center h-full rounded-full text-xs font-semibold tracking-wide transition-colors duration-300 ${
                theme === "systems" ? "text-slate-900" : "text-slate-400"
              }`}
            >
              Systems
            </Link>
            <Link
              href={MODE_PATHS.narrative}
              onClick={() => setShowNudge(false)}
              aria-current={theme === "narrative" ? "page" : undefined}
              className={`relative z-10 flex-1 min-w-0 flex items-center justify-center h-full rounded-full text-xs font-semibold tracking-wide transition-all duration-300 ${
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
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile nav panel */}
      <AnimatePresence initial={false} onExitComplete={handleMenuClosed}>
        {menuOpen && (
          <motion.div
            id="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className={`md:hidden overflow-hidden border-t ${
              theme === "systems" ? "border-slate-200" : "border-[#2A2A2E]"
            }`}
          >
            <div className="px-4 sm:px-6 py-2 flex flex-col">
              {SECTIONS.map((item) => (
                <a
                  key={item}
                  href={`#${sectionId(item)}`}
                  onClick={(e) => goToSection(e, item)}
                  className={`py-3 text-sm font-medium transition-colors duration-300 ${
                    theme === "systems"
                      ? "text-slate-600 hover:text-blue-600"
                      : "text-[#A1A1AA] hover:text-blue-500"
                  }`}
                >
                  {item}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
