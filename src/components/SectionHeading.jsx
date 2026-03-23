"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function SectionHeading({ children, className = "" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.h2
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`text-3xl md:text-4xl font-bold tracking-tight mb-4 ${className}`}
    >
      {children}
    </motion.h2>
  );
}
