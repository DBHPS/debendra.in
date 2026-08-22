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

  // The background inverts from near-white to near-black across this section, so
  // the ink has to invert with it. Both hold their dark value while the backdrop
  // is still light, then cross over late and land on the same light tones the
  // sections below use: ending on slate-500/600 left the headings sitting at
  // 2.99:1 and 1.88:1 against the dark backdrop for the rest of the page.
  // The crossover is held late and kept narrow on purpose. The backdrop passes
  // through mid grey around 0.83, which is the one point where dark and light
  // ink score about the same against it; fading earlier or more slowly leaves
  // grey ink sitting on a grey backdrop and the heading disappears mid-scroll.
  const CROSSOVER = [0, 0.78, 0.88, 1];

  const headingColor = useTransform(
    expScroll,
    CROSSOVER,
    ["#0F172A", "#0F172A", "#CBD5E1", "#CBD5E1"] // slate-900 to slate-300
  );

  const subHeadingColor = useTransform(
    expScroll,
    CROSSOVER,
    ["#334155", "#334155", "#94A3B8", "#94A3B8"] // slate-700 to slate-400
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
