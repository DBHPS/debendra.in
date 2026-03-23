"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import data from "@/data/data";
import { useTheme } from "@/context/ThemeContext";
import Image from "next/image";

export default function HeroSection() {
  const { theme } = useTheme();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <section
      ref={ref}
      id="about"
      className="min-h-screen flex items-center pt-24 pb-16"
    >
      <div className="max-w-7xl mx-auto px-6 w-full">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-[1fr,auto] gap-12 items-center"
        >
          <div>
            <motion.div variants={itemVariants} className="mb-4">
              <span
                className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase ${
                  theme === "systems"
                    ? "bg-blue-50 text-blue-700 border border-blue-100"
                    : "bg-[#F0EBE4] text-[#8B7E74] border border-[#DDD7CF]"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Open to Opportunities
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className={`text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6 ${
                theme === "systems" ? "text-slate-900" : "text-[#2C2C2C]"
              }`}
            >
              {data.personal.name.split(" ").map((word, i) => (
                <span key={i}>
                  {i === data.personal.name.split(" ").length - 1 ? (
                    <span className="text-blue-600">{word}</span>
                  ) : (
                    word
                  )}{" "}
                </span>
              ))}
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className={`text-xl md:text-2xl font-light leading-relaxed mb-3 ${
                theme === "systems" ? "text-slate-500" : "text-[#8B7E74]"
              }`}
            >
              {theme === "systems"
                ? data.personal.tagline
                : data.personal.narrativeTagline}
            </motion.p>

            <motion.p
              variants={itemVariants}
              className={`text-base max-w-2xl mb-8 ${
                theme === "systems" ? "text-slate-400" : "text-[#A09890]"
              }`}
            >
              {data.personal.title}
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
              <a
                href={data.personal.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={`px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 ${
                  theme === "systems"
                    ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40"
                    : "bg-[#2C2C2C] text-[#FAF8F5] hover:bg-[#1a1a1a] shadow-lg shadow-black/10"
                }`}
              >
                LinkedIn →
              </a>
              <a
                href={data.personal.github}
                target="_blank"
                rel="noopener noreferrer"
                className={`px-6 py-3 rounded-full font-semibold text-sm border transition-all duration-300 ${
                  theme === "systems"
                    ? "border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                    : "border-[#DDD7CF] text-[#6B6B6B] hover:border-[#C8BFB6] hover:bg-[#F5F2ED]"
                }`}
              >
                GitHub →
              </a>
            </motion.div>
          </div>

          <motion.div
            variants={itemVariants}
            className="hidden md:block"
          >
            <div
              className={`w-56 h-56 rounded-3xl overflow-hidden shadow-2xl ring-4 transition-all duration-500 ${
                theme === "systems"
                  ? "ring-blue-100 shadow-blue-600/10"
                  : "ring-[#E8E4DF] shadow-black/5"
              }`}
            >
              <Image
                src={data.personal.profileImage}
                alt={data.personal.name}
                width={224}
                height={224}
                className="object-cover w-full h-full"
                priority
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
