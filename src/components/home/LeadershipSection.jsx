"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import data from "@/data/data";
import { useTheme } from "@/context/ThemeContext";
import SectionHeading from "@/components/SectionHeading";

function LeadershipCard({ item, index }) {
  const { theme } = useTheme();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className={`p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-[5px] hover:scale-[1.02] ${
        theme === "systems"
          ? "bg-white/60 backdrop-blur-sm border-slate-200 hover:shadow-[0_8px_30px_rgb(59,130,246,0.30)]"
          : "bg-[#FFFDF9]/60 backdrop-blur-sm border-[#E8E4DF] hover:shadow-[0_8px_30px_rgb(0,0,0,0.15)]"
      }`}
    >
      <div className="flex items-start justify-between mb-1">
        <h3
          className={`font-bold text-base ${theme === "systems" ? "text-slate-900" : "text-[#2C2C2C]"}`}
        >
          {item.role}
        </h3>
        <span className={`text-xs shrink-0 ml-3 ${theme === "systems" ? "text-slate-400" : "text-[#A09890]"}`}>
          {item.period}
        </span>
      </div>

      <p className={`text-sm mb-1 ${theme === "systems" ? "text-blue-600" : "text-[#8B7E74]"}`}>
        {item.organization}
      </p>
      <p className={`text-xs mb-3 italic ${theme === "systems" ? "text-slate-400" : "text-[#A09890]"}`}>
        {item.subtitle}
      </p>

      <p className={`font-semibold text-sm mb-3 ${theme === "systems" ? "text-emerald-600" : "text-[#5A7A64]"}`}>
        ↗ {item.impact}
      </p>

      <ul className="space-y-1.5">
        {item.highlights.map((h, i) => (
          <li
            key={i}
            className={`text-sm leading-relaxed pl-4 relative before:content-['–'] before:absolute before:left-0 ${
              theme === "systems" ? "text-slate-500" : "text-[#8B8178]"
            }`}
          >
            {h}
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap gap-1.5 mt-4">
        {item.tags.map((tag) => (
          <span
            key={tag}
            className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${
              theme === "systems"
                ? "bg-slate-100 text-slate-600"
                : "bg-[#F0EBE4] text-[#8B7E74]"
            }`}
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export default function LeadershipSection() {
  const { theme } = useTheme();

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading className={theme === "systems" ? "text-slate-900" : "text-[#2C2C2C]"}>
          Leadership & Impact
        </SectionHeading>
        <p className={`text-lg mb-12 max-w-2xl ${theme === "systems" ? "text-slate-500" : "text-[#8B7E74]"}`}>
          Scaling teams, securing partnerships, and driving revenue through technical leadership.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.leadership.map((item, i) => (
            <LeadershipCard key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
