"use client";
import { useTheme } from "@/context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import data from "@/data/data";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();

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
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo / Name */}
        <Link 
          href="/" 
          onClick={(e) => {
            if (window.scrollY > 0) {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          className="flex items-center gap-3 group"
        >
          <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-transparent group-hover:ring-blue-500 transition-all duration-300">
            <Image
              src={data.personal.profileImage}
              alt={data.personal.name}
              width={36}
              height={36}
              className="object-cover w-full h-full"
            />
          </div>
          <span
            className={`font-semibold text-lg tracking-tight transition-colors duration-500 ${
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

        {/* Theme Toggle */}
        <button
          onClick={() => {
            toggleTheme();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className={`relative flex items-center w-[180px] h-10 rounded-full p-1 transition-colors duration-500 cursor-pointer ${
            theme === "systems"
              ? "bg-slate-100 border border-slate-200"
              : "bg-[#252529] border border-[#3F3F46]"
          }`}
          aria-label="Toggle theme"
        >
          <motion.div
            layout
            transition={{ type: "spring", stiffness: 500, damping: 35 }}
            className={`absolute w-[86px] h-8 rounded-full shadow-sm ${
              theme === "systems" ? "bg-white left-1" : "bg-white left-[91px]"
            }`}
          />
          <span
            className={`relative z-10 flex-1 text-center text-xs font-semibold tracking-wide transition-colors duration-300 ${
              theme === "systems" ? "text-slate-900" : "text-slate-400"
            }`}
          >
            Systems
          </span>
          <span
            className={`relative z-10 flex-1 text-center text-xs font-semibold tracking-wide transition-colors duration-300 ${
              theme === "narrative" ? "text-[#F1F1F1]" : "text-slate-400"
            }`}
          >
            Narrative
          </span>
        </button>
      </div>
    </motion.nav>
  );
}
