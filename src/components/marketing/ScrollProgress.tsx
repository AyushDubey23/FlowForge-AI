"use client";

import React from "react";
import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#FFB454] via-[#8C7CFF] to-[#6EE7B7] z-50 origin-left shadow-sm shadow-[#FFB454]/50"
      style={{ scaleX }}
    />
  );
}
