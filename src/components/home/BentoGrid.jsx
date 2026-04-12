"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import data from "@/data/data";
import { useTheme } from "@/context/ThemeContext";
import SectionHeading from "@/components/SectionHeading";
import MediaCard from "@/components/MediaCard";

function ProjectCard({ project, index, theme }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className={`group p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-[5px] hover:scale-[1.02] ${
        theme === "systems"
          ? "bg-white/60 backdrop-blur-sm border-slate-200 hover:shadow-[0_8px_30px_rgb(59,130,246,0.30)]"
          : "bg-[#FFFDF9]/60 backdrop-blur-sm border-[#E8E4DF] hover:shadow-[0_8px_30px_rgb(0,0,0,0.15)]"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
        <h3
          className={`font-bold text-lg leading-tight ${
            theme === "systems" ? "text-slate-900" : "text-[#2C2C2C]"
          }`}
        >
          {project.name}
        </h3>
        {project.result && (
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full sm:shrink-0 w-fit ${
              theme === "systems"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-[#E8F5E8] text-[#4A7C4A]"
            }`}
          >
            {project.result}
          </span>
        )}
      </div>

      <p
        className={`font-semibold text-sm mb-2 ${
          theme === "systems" ? "text-blue-600" : "text-[#8B7E74]"
        }`}
      >
        {project.impact}
      </p>

      <p
        className={`text-sm mb-4 leading-relaxed ${
          theme === "systems" ? "text-slate-500" : "text-[#8B8178]"
        }`}
      >
        {project.description}
      </p>

      {project.media && (
        <div className="mb-4">
          <MediaCard src={project.media} type={project.mediaType || "video"} />
        </div>
      )}


      <div className="flex flex-wrap gap-1.5">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors ${
              theme === "systems"
                ? "bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-700"
                : "bg-[#F0EBE4] text-[#8B7E74] group-hover:bg-[#E8E4DF] group-hover:text-[#6B6B6B]"
            }`}
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export default function BentoGrid() {
  const { theme } = useTheme();

  const dsProjects = [
    ...data.projects.filter((p) => p.category === "data-science"),
  ];
  const asProjects = [
    ...data.competitions,
    ...data.projects.filter((p) => p.category === "autonomous-systems"),
  ];

  return (
    <section id="projects" className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading className={theme === "systems" ? "text-slate-900" : "text-[#2C2C2C]"}>
          Projects
        </SectionHeading>
        <p className={`text-lg mb-12 max-w-2xl ${theme === "systems" ? "text-slate-700" : "text-[#8B7E74]"}`}>
          From predictive analytics to autonomous rovers — building systems that drive measurable outcomes.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Data Science Column */}
          <div className="space-y-6">
            <div
              className={`px-4 py-2 rounded-full inline-block text-xs font-bold tracking-wider uppercase mb-2 ${
                theme === "systems"
                  ? "bg-blue-50 text-blue-700"
                  : "bg-[#F0EBE4] text-[#8B7E74]"
              }`}
            >
              Data Science & Analytics
            </div>
            {dsProjects.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} theme={theme} />
            ))}
          </div>

          {/* Autonomous Systems Column */}
          <div className="space-y-6">
            <div
              className={`px-4 py-2 rounded-full inline-block text-xs font-bold tracking-wider uppercase mb-2 ${
                theme === "systems"
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-[#E8F0EB] text-[#5A7A64]"
              }`}
            >
              Autonomous Systems
            </div>
            {asProjects.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} theme={theme} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
