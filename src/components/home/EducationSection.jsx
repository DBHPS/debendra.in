"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import data from "@/data/data";
import { useTheme } from "@/context/ThemeContext";
import SectionHeading from "@/components/SectionHeading";
import Image from "next/image";

export default function EducationSection() {
  const { theme } = useTheme();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="py-20" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading className={theme === "systems" ? "text-slate-900" : "text-[#2C2C2C]"}>
          Education
        </SectionHeading>

        <div className="grid md:grid-cols-3 gap-6 mt-8">
          {data.education.map((edu, i) => (
            <motion.div
              key={edu.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className={`p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-[5px] hover:scale-[1.02] ${
                theme === "systems"
                  ? "bg-white/60 backdrop-blur-sm border-slate-200 hover:shadow-[0_8px_30px_rgb(59,130,246,0.30)]"
                  : "bg-[#FFFDF9]/60 backdrop-blur-sm border-[#E8E4DF] hover:shadow-[0_8px_30px_rgb(0,0,0,0.15)]"
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                {edu.logo && (
                  <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                    <Image src={edu.logo} alt={edu.institution} width={40} height={40} className="object-contain" />
                  </div>
                )}
                <div>
                  <h3 className={`font-bold text-sm ${theme === "systems" ? "text-slate-900" : "text-[#2C2C2C]"}`}>
                    {edu.institution}
                  </h3>
                  {edu.period && (
                    <p className={`text-xs ${theme === "systems" ? "text-slate-400" : "text-[#A09890]"}`}>
                      {edu.period}
                    </p>
                  )}
                </div>
              </div>
              <p className={`font-medium text-sm ${theme === "systems" ? "text-blue-600" : "text-[#8B7E74]"}`}>
                {edu.degree}
              </p>
              {edu.grade && (
                <p className={`text-xs mt-1 font-semibold ${theme === "systems" ? "text-emerald-600" : "text-[#5A7A64]"}`}>
                  {edu.grade}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
