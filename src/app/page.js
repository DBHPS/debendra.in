"use client";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
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

function PageContent() {
  const { theme } = useTheme();

  return (
    <div
      className={`min-h-screen transition-colors duration-700 ${
        theme === "systems" ? "bg-[#FAFBFC]" : "bg-[#18181A]"
      }`}
    >
      {/* 3D Background — only on desktop */}
      <div className="hidden lg:block">
        <AnimatePresence mode="wait">
          {theme === "systems" ? (
            <motion.div
              key="network"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              <NetworkWireframe />
            </motion.div>
          ) : (
            <motion.div
              key="drone"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              <DroneMesh />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Navbar />

      <main>
        <AnimatePresence mode="wait">
          {theme === "systems" ? (
            <motion.div
              key="systems"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <HeroSection />
              <ExperienceSection />
              <BentoGrid />
              <LeadershipSection />
              <EducationSection />
              <SkillsSection />
              <AwardsSection />
            </motion.div>
          ) : (
            <motion.div
              key="narrative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
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
