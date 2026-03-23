"use client";
import data from "@/data/data";
import { useTheme } from "@/context/ThemeContext";
import { motion } from "framer-motion";

export default function Footer() {
  const { theme } = useTheme();

  return (
    <footer
      className={`border-t py-12 transition-colors duration-500 ${
        theme === "systems"
          ? "bg-slate-50 border-slate-200 text-slate-600"
          : "bg-[#141415] border-[#2A2A2E] text-[#A1A1AA]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="font-semibold text-lg">
              <span className={theme === "systems" ? "text-slate-900" : "text-[#F1F1F1]"}>
                {data.personal.name}
              </span>
            </p>
            <p className="text-sm mt-1">{data.personal.title}</p>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <a
              href={`mailto:${data.personal.email}`}
              className="text-sm hover:text-blue-600 transition-colors"
            >
              {data.personal.email}
            </a>
            <a
              href="mailto:truedebendra@gmail.com"
              className="text-sm hover:text-blue-600 transition-colors"
            >
              truedebendra@gmail.com
            </a>
            <a
              href={data.personal.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm hover:text-blue-600 transition-colors"
            >
              LinkedIn
            </a>
            <a
              href={data.personal.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm hover:text-blue-600 transition-colors"
            >
              GitHub
            </a>
            <a
              href={data.personal.resumeDriveLink || data.personal.resumeLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`px-4 py-1.5 rounded-full font-semibold text-xs border transition-all duration-300 ${
                theme === "systems"
                  ? "border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50 shadow-sm"
                  : "border-[#3F3F46] text-[#D4D4D8] hover:border-[#52525B] hover:bg-[#252529] shadow-black/20"
              }`}
            >
              Resume
            </a>
          </div>
        </div>

        <div className="mt-8 text-center text-xs opacity-60">
          © {new Date().getFullYear()} {data.personal.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
