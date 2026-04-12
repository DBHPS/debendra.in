"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import data from "@/data/data";
import { useTheme } from "@/context/ThemeContext";
import SectionHeading from "@/components/SectionHeading";

function SkillCategory({ title, skills, index, theme }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <h3
        className={`text-xs font-bold tracking-wider uppercase mb-3 ${
          theme === "systems" ? "text-slate-400" : "text-[#A09890]"
        }`}
      >
        {title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 ${
              theme === "systems"
                ? "bg-white border border-slate-200 text-slate-700 hover:border-blue-300 hover:text-blue-700 shadow-sm"
                : "bg-[#FFFDF9] border border-[#E8E4DF] text-[#6B6B6B] hover:border-[#C8BFB6] shadow-sm"
            }`}
          >
            {skill}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export default function SkillsSection() {
  const { theme } = useTheme();

  const categories = [
    { title: "Languages", skills: data.skills.languages },
    { title: "Frameworks & Libraries", skills: data.skills.frameworks },
    { title: "Tools & Platforms", skills: data.skills.tools },
    { title: "Domains", skills: data.skills.domains },
    { title: "Professional", skills: data.skills.professional },
  ];

  return (
    <section id="skills" className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading className={theme === "systems" ? "text-slate-500" : "text-[#2C2C2C]"}>
          Skills & Expertise
        </SectionHeading>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 mt-10">
          {categories.map((cat, i) => (
            <SkillCategory
              key={cat.title}
              title={cat.title}
              skills={cat.skills}
              index={i}
              theme={theme}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
