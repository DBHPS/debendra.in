"use client";
import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { useBackgroundSignal } from "@/context/BackgroundContext";
import { MODE_PATHS } from "@/context/ThemeContext";
import HeroSection from "@/components/home/HeroSection";
import BentoGrid from "@/components/home/BentoGrid";
import ExperienceSection from "@/components/home/ExperienceSection";
import EducationSection from "@/components/home/EducationSection";
import LeadershipSection from "@/components/home/LeadershipSection";
import SkillsSection from "@/components/home/SkillsSection";
import AwardsSection from "@/components/home/AwardsSection";

export default function SystemsView() {
  const router = useRouter();
  const bgSignal = useBackgroundSignal();

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

  /* ─── Feature 1: Scroll Fades, auto-narrative transition ───
     Ignore the first second after mount so that layout height settling cannot
     be mistaken for the visitor reaching the bottom of the page. */
  const [canAutoSwitch, setCanAutoSwitch] = useState(false);
  const hasNavigated = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => setCanAutoSwitch(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const { scrollYProgress } = useScroll();

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (!canAutoSwitch || hasNavigated.current) return;

    // Switch to narrative only when reaching the very end of the systems page
    if (latest >= 0.99) {
      hasNavigated.current = true;
      router.push(MODE_PATHS.narrative);
    }
  });

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
