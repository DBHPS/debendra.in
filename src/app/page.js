"use client";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import dynamic from "next/dynamic";
import { AnimatePresence, motion, useScroll, useTransform, useMotionValueEvent, useMotionValue } from "framer-motion";
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

function SystemsContent({ bgSignal }) {
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

  const headingColor = useTransform(
    expScroll,
    [0, 1],
    ["#0F172A", "#64748B"] // slate-900 to slate-500
  );
  
  const subHeadingColor = useTransform(
    expScroll,
    [0, 1],
    ["#334155", "#475569"] // slate-700 to slate-600
  );

  useMotionValueEvent(systemsBg, "change", (latest) => {
    if (bgSignal) bgSignal.set(latest);
  });

  useEffect(() => {
    if (bgSignal) bgSignal.set(systemsBg.get());
  }, [bgSignal, systemsBg]);

  return (
    <>
      <HeroSection />
      <div ref={expRef}>
        <ExperienceSection headingColor={headingColor} subHeadingColor={subHeadingColor} />
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

  const bgSignal = useMotionValue(theme === "systems" ? "#FAFBFC" : "#18181A");

  useEffect(() => {
    if (theme === "narrative") {
      bgSignal.set("#18181A");
    }
  }, [theme, bgSignal]);

  // Allow the browser to restore manual scroll positions first
  // We ignore auto-switching for the first 1000ms after ANY theme change
  // This prevents layout height recalculations from falsely triggering a bottom-scroll transition before the window smooth-scrolls to the top.
  useEffect(() => {
    setCanAutoSwitch(false);
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
      {/* Global Background */}
      <motion.div
        className="fixed inset-0 -z-30 transition-colors duration-500 ease-in-out"
        style={{ backgroundColor: theme === "systems" ? bgSignal : "#18181A" }}
      />

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
        <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' })}>
          {theme === "systems" ? (
            <motion.div
              key="systems"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <SystemsContent bgSignal={bgSignal} />
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
