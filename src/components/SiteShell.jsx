"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { motion, useMotionValue } from "framer-motion";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { BackgroundSignalContext } from "@/context/BackgroundContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Dynamic import for 3D (no SSR)
const NetworkWireframe = dynamic(
  () => import("@/components/three/NetworkWireframe"),
  { ssr: false }
);
const DroneMesh = dynamic(
  () => import("@/components/three/DroneMesh"),
  { ssr: false }
);

/**
 * Chrome that is shared by both modes. It lives in the root layout, so
 * navigating between / and /narrative preserves it: the WebGL contexts are
 * created once and cross-faded rather than torn down and rebuilt.
 */
function Shell({ children }) {
  const { theme } = useTheme();
  const pathname = usePathname();

  const bgSignal = useMotionValue(theme === "systems" ? "#FAFBFC" : "#18181A");

  useEffect(() => {
    if (theme === "narrative") {
      bgSignal.set("#18181A");
    }
  }, [theme, bgSignal]);

  /* ─── Performance: keep the outgoing canvas mounted only for the length of
     the opacity cross-fade, then drop it. On a first load the correct canvas
     is the only one that ever mounts, because the mode is known up front. ─── */
  const [activeCanvas, setActiveCanvas] = useState(theme);

  useEffect(() => {
    const timer = setTimeout(() => setActiveCanvas(theme), 1000);
    return () => clearTimeout(timer);
  }, [theme]);

  return (
    <BackgroundSignalContext.Provider value={bgSignal}>
      <div className="min-h-screen transition-colors duration-700 overflow-x-hidden">
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
            {(activeCanvas === "narrative" || theme === "narrative") && (
              <DroneMesh isNarrative={theme === "narrative"} />
            )}
          </div>
        </div>

        <Navbar />

        {/* Keyed on the route so each mode fades in on arrival. */}
        <motion.main
          key={pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10"
        >
          {children}
        </motion.main>

        <Footer />
      </div>
    </BackgroundSignalContext.Provider>
  );
}

export default function SiteShell({ children }) {
  return (
    <ThemeProvider>
      <Shell>{children}</Shell>
    </ThemeProvider>
  );
}
