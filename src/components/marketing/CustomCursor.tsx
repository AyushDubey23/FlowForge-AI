"use client";

import React, { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";
import { prefersReducedMotion } from "@/lib/motion";

export default function CustomCursor() {
  const [cursorLabel, setCursorLabel] = useState<string>("");
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { stiffness: 500, damping: 50, bounce: 0 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (window.matchMedia("(pointer: coarse)").matches) return; // Hide on touch devices

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      // Check hover context from data-cursor attribute
      const target = e.target as HTMLElement | null;
      const cursorTarget = target?.closest("[data-cursor]") as HTMLElement | null;

      if (cursorTarget) {
        setCursorLabel(cursorTarget.getAttribute("data-cursor") || "");
        setIsHovered(true);
      } else {
        setCursorLabel("");
        setIsHovered(false);
      }
    };

    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [cursorX, cursorY, isVisible]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-50 flex items-center gap-2"
      style={{
        x: smoothX,
        y: smoothY,
        translateX: "-50%",
        translateY: "-50%",
      }}
    >
      {/* Reticle Dot */}
      <motion.div
        animate={{
          scale: isHovered ? 1.8 : 1,
          borderColor: isHovered ? "#FFB454" : "rgba(214, 226, 255, 0.4)",
        }}
        className="w-5 h-5 rounded-full border border-[var(--accent-signal)] bg-[rgba(255,180,84,0.1)] flex items-center justify-center backdrop-blur-xs transition-colors"
      >
        <div className="w-1 h-1 rounded-full bg-[var(--accent-signal)]" />
      </motion.div>

      {/* Context Label Tag */}
      {cursorLabel && (
        <motion.span
          initial={{ opacity: 0, x: -5, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -5, scale: 0.9 }}
          className="text-[10px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-[#171E36] border border-[#FFB454]/40 text-[#FFB454] shadow-md shadow-black/50 whitespace-nowrap"
        >
          {cursorLabel}
        </motion.span>
      )}
    </motion.div>
  );
}
