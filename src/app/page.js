"use client";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import dynamic from "next/dynamic";
import { AnimatePresence, motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/home/HeroSection";
import BentoGrid from "@/components/home/BentoGrid";
import ExperienceSection from "@/components/home/ExperienceSection";
import EducationSection from "@/components/home/EducationSection";
import LeadershipSection from "@/components/home/LeadershipSection";
import SkillsSection from "@/components/home/SkillsSection";
import AwardsSection from "@/components/home/AwardsSection";
import NarrativeTimeline from "@/components/narrative/NarrativeTimeline";

// Dynamic import for 3D (no SSR)
const NetworkWireframe = dynamic(
  () => import("@/components/three/NetworkWireframe"),
  { ssr: false }
);
const DroneMesh = dynamic(
  () => import("@/components/three/DroneMesh"),
  { ssr: false }
);

function SystemsContent() {
  const expRef = useRef(null);
  const { scrollYProgress: expScroll } = useScroll({
    target: expRef,
    offset: ["start 80%", "start 20%"]
  });

  const systemsBg = useTransform(
    expScroll,
    [0, 1],
    ["#FAFBFC", "#2A2A30"]
  );

  return (
    <>
      {/* Background isolated inside the mounting component to keep useScroll sync'd */}
      <motion.div
        className="fixed inset-0 -z-20"
        style={{ backgroundColor: systemsBg }}
      />
      <HeroSection />
      <div ref={expRef}>
        <ExperienceSection />
      </div>
      <BentoGrid />
      <LeadershipSection />
      <EducationSection />
      <SkillsSection />
      <AwardsSection />
    </>
  );
}

function PageContent() {
  const { theme, setTheme } = useTheme();
  const scrollRef = useRef(null);
  const [canAutoSwitch, setCanAutoSwitch] = useState(false);

  // Allow the browser to restore manual scroll positions first
  // We ignore auto-switching for the first 1000ms after ANY theme change
  // This prevents layout height recalculations from falsely triggering a bottom-scroll transition before the window smooth-scrolls to the top.
  useEffect(() => {
    setCanAutoSwitch(false);
    setTimeout(() => window.scrollTo(0, 0), 10);
    const timer = setTimeout(() => setCanAutoSwitch(true), 1000);
    return () => clearTimeout(timer);
  }, [theme]);

  /* ─── Feature 1: Scroll Fades — auto-narrative transition ─── */
  const { scrollYProgress } = useScroll();

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (!canAutoSwitch) return; // Prevent initial refresh jumps from firing logic

    // Switch to narrative only when reaching the very end of the systems page
    if (latest >= 0.99 && theme !== "narrative") {
      setTheme("narrative");
      // Jump to the top so narrative starts fresh
      setTimeout(() => window.scrollTo(0, 0), 10);
    }
  });

  /* ─── Performance Optimization: 3D Unmounting ─── */
  const [activeCanvas, setActiveCanvas] = useState(theme);

  useEffect(() => {
    // Wait for the 1000ms CSS fade-opacity transition to finish, then unmount the old canvas entirely
    const timer = setTimeout(() => {
      setActiveCanvas(theme);
    }, 1000);
    return () => clearTimeout(timer);
  }, [theme]);

  return (
    <div ref={scrollRef} className="min-h-screen transition-colors duration-700 overflow-x-hidden">
      {/* Narrative dark background fallback */}
      <div className="fixed inset-0 -z-30 bg-[#18181A]" />

      {/* 3D Backgrounds */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div
          className={`transition-opacity duration-1000 ease-in-out ${
            theme === "systems" ? "opacity-100" : "opacity-0"
          }`}
        >
          {(activeCanvas === "systems" || theme === "systems") && <NetworkWireframe />}
        </div>
        <div
          className={`transition-opacity duration-1000 ease-in-out ${
            theme === "narrative" ? "opacity-100" : "opacity-0"
          }`}
        >
          {(activeCanvas === "narrative" || theme === "narrative") && <DroneMesh isNarrative={theme === "narrative"} />}
        </div>
      </div>

      <Navbar />

      <main className="relative z-10">
        <AnimatePresence mode="wait">
          {theme === "systems" ? (
            <motion.div
              key="systems"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <SystemsContent />
            </motion.div>
          ) : (
            <motion.div
              key="narrative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="pt-24"
            >
              <NarrativeTimeline />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}

export default function Home() {
  return (
    <ThemeProvider>
      <PageContent />
    </ThemeProvider>
  );
}
