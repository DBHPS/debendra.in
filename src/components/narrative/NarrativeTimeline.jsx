"use client";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect } from "react";
import data from "@/data/data";
import { useTheme } from "@/context/ThemeContext";
import Image from "next/image";

export default function NarrativeTimeline() {
  const { theme } = useTheme();
  
  /* ─── Feature 6: Text Spotlight ─── */
  const timelineRef = useRef(null);

  useEffect(() => {
    if (window.innerWidth < 768) return; // Keep default center on mobile

    const updatePointer = (e) => {
      if (!timelineRef.current) return;
      const rect = timelineRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      timelineRef.current.style.setProperty("--mouse-x", `${x}px`);
      timelineRef.current.style.setProperty("--mouse-y", `${y}px`);
    };

    window.addEventListener("mousemove", updatePointer);
    return () => window.removeEventListener("mousemove", updatePointer);
  }, []);

  return (
    <div id="narrative-about" className="py-20 relative" ref={timelineRef}>
      {/* Dynamic Cursor Highlight Overlay */}
      <div 
        className="pointer-events-none absolute inset-0 z-0 hidden md:block transition duration-300"
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.06), transparent 40%)`
        }}
      />
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        {/* Narrative Hero */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20"
        >
          <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-6 ring-4 ring-[#2A2A2E] shadow-xl">
            <Image
              src={data.personal.profileImage}
              alt={data.personal.name}
              width={128}
              height={128}
              className="object-cover w-full h-full"
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#F1F1F1] tracking-tight mb-4">
            {data.personal.narrativeTagline}
          </h1>
          <p className="text-lg text-[#A1A1AA] max-w-xl mx-auto leading-relaxed">
            A chronological journey through physics, robotics, AI research, and strategic leadership
            — tracing how each chapter builds on the last.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-[#3F3F46] md:-translate-x-px" />

          {data.timeline.map((item, i) => {
            const isLeft = i % 2 === 0;
            return <TimelineItem key={i} item={item} index={i} isLeft={isLeft} />;
          })}
        </div>

        {/* Experience Detail Cards */}
        <div id="narrative-experience" className="mt-24">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-[#F1F1F1] mb-4"
          >
            Detailed Experience
          </motion.h2>
          <p className="text-[#A1A1AA] mb-10">
            Deep dives into each role and its impact.
          </p>

          <div className="space-y-8">
            {data.experience.map((exp, i) => (
              <NarrativeExpCard key={exp.id} exp={exp} index={i} />
            ))}
          </div>
        </div>

        {/* Leadership */}
        <div className="mt-24">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-[#F1F1F1] mb-10"
          >
            Leadership & Strategy
          </motion.h2>

          <div className="space-y-8">
            {data.leadership.map((item, i) => (
              <NarrativeLeadershipCard key={item.id} item={item} index={i} />
            ))}
          </div>
        </div>

        {/* Projects */}
        <div id="narrative-projects" className="mt-24">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-[#F1F1F1] mb-10"
          >
            Selected Projects
          </motion.h2>

          <div className="space-y-6">
            {[...data.projects, ...data.competitions].map((proj, i) => (
              <NarrativeProjectCard key={proj.id} project={proj} index={i} />
            ))}
          </div>
        </div>

        {/* Skills */}
        <div id="narrative-skills" className="mt-24">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-[#F1F1F1] mb-8"
          >
            Skills & Toolkit
          </motion.h2>

          <div className="space-y-6">
            {Object.entries(data.skills).map(([category, skills]) => (
              <div key={category}>
                <h3 className="text-xs font-bold tracking-wider uppercase text-[#A1A1AA] mb-3">
                  {category.replace(/([A-Z])/g, " $1").trim()}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 rounded-full text-sm bg-[#252529] border border-[#3F3F46] text-[#D4D4D8]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Awards */}
        <div className="mt-24 mb-10">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-[#F1F1F1] mb-8"
          >
            Recognition
          </motion.h2>
          <div className="space-y-4">
            {data.awards.map((award, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-3 p-4 rounded-xl bg-[#1E1E22] border border-[#3F3F46]"
              >
                <span className="text-xl">🏆</span>
                <p className="text-sm text-[#A1A1AA]">{award}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Feature 1: Timeline items with scroll-based horizontal slide-in ─── */
function TimelineItem({ item, index, isLeft }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  // Scroll-based x-axis slide: from left for even, from right for odd
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  const xOffset = useTransform(
    scrollYProgress,
    [0, 1],
    [isLeft ? -80 : 80, 0]
  );

  const itemOpacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

  return (
    <motion.div
      ref={ref}
      style={{ x: xOffset, opacity: itemOpacity }}
      className={`relative flex items-center mb-10 ${
        isLeft ? "md:flex-row" : "md:flex-row-reverse"
      } flex-row`}
    >
      {/* Dot */}
      <div className="absolute left-6 md:left-1/2 w-3 h-3 rounded-full bg-[#34D399] border-2 border-[#18181A] -translate-x-1/2 z-10 shadow-sm" />

      {/* Content */}
      <div
        className={`ml-14 md:ml-0 md:w-5/12 ${
          isLeft ? "md:pr-12 md:text-right" : "md:pl-12 md:text-left"
        }`}
      >
        <span className="text-xs font-bold tracking-wider text-[#FBBF24] uppercase">
          {item.year}
        </span>
        <p className="text-sm text-[#F1F1F1] font-medium mt-1 leading-relaxed">
          {item.label}
        </p>
      </div>

      {/* Spacer for the other side */}
      <div className="hidden md:block md:w-5/12" />
    </motion.div>
  );
}

function NarrativeExpCard({ exp, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="p-6 rounded-2xl bg-[#1E1E22] border border-[#3F3F46] hover:shadow-lg transition-shadow"
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-bold text-lg text-[#F1F1F1]">{exp.role}</h3>
          <p className="text-sm text-[#A1A1AA]">{exp.organization}</p>
        </div>
        <span className="text-xs text-[#FBBF24] shrink-0">{exp.period}</span>
      </div>
      <p className="font-semibold text-sm text-[#34D399] mt-2 mb-3">↗ {exp.impact}</p>
      <ul className="space-y-1.5">
        {exp.highlights.map((h, i) => (
          <li key={i} className="text-sm text-[#D4D4D8] pl-4 relative before:content-['–'] before:absolute before:left-0">
            {h}
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-1.5 mt-4">
        {exp.tags.map((tag) => (
          <span key={tag} className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#252529] text-[#A1A1AA]">
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

function NarrativeLeadershipCard({ item, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="p-6 rounded-2xl bg-[#1E1E22] border border-[#3F3F46] hover:shadow-lg transition-shadow"
    >
      <h3 className="font-bold text-base text-[#F1F1F1]">{item.role}</h3>
      <p className="text-sm text-[#A1A1AA] mb-1">{item.organization}</p>
      <p className="text-xs italic text-[#A1A1AA] mb-2">{item.subtitle}</p>
      <p className="font-semibold text-sm text-[#34D399] mb-3">↗ {item.impact}</p>
      <ul className="space-y-1.5">
        {item.highlights.map((h, i) => (
          <li key={i} className="text-sm text-[#D4D4D8] pl-4 relative before:content-['–'] before:absolute before:left-0">
            {h}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

function NarrativeProjectCard({ project, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 25 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      className="p-5 rounded-xl bg-[#1E1E22] border border-[#3F3F46] hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-1">
        <h3 className="font-bold text-sm text-[#F1F1F1]">{project.name}</h3>
        {project.result && (
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#34D399]/10 text-[#34D399] shrink-0 ml-3">
            {project.result}
          </span>
        )}
      </div>
      <p className="text-sm text-[#34D399] font-medium mb-1">{project.impact}</p>
      <p className="text-xs text-[#D4D4D8]">{project.description}</p>
      <div className="flex flex-wrap gap-1.5 mt-3">
        {project.tags.map((tag) => (
          <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#252529] text-[#A1A1AA]">
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
