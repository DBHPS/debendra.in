"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import data from "@/data/data";
import { useTheme } from "@/context/ThemeContext";
import SectionHeading from "@/components/SectionHeading";

export default function AwardsSection() {
  const { theme } = useTheme();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="py-20" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading className={theme === "systems" ? "text-slate-900" : "text-[#2C2C2C]"}>
          Awards & Recognition
        </SectionHeading>

        <div className="grid md:grid-cols-3 gap-6 mt-8">
          {data.awards.map((award, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className={`p-5 rounded-2xl border transition-all duration-500 hover:shadow-lg ${
                theme === "systems"
                  ? "bg-white/60 backdrop-blur-sm border-slate-200 hover:border-blue-200"
                  : "bg-[#FFFDF9]/60 backdrop-blur-sm border-[#E8E4DF] hover:border-[#C8BFB6]"
              }`}
            >
              <div className="text-2xl mb-3">🏆</div>
              <p className={`text-sm leading-relaxed ${theme === "systems" ? "text-slate-600" : "text-[#6B6B6B]"}`}>
                {award}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
