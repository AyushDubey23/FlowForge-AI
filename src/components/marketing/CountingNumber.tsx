"use client";

import React, { useEffect, useState } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";

interface CountingNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}

export default function CountingNumber({
  value,
  prefix = "",
  suffix = "",
  duration = 2,
  className = "",
}: CountingNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    stiffness: 100,
    damping: 30,
    duration: duration * 1000,
  });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      if (prefersReducedMotion()) {
        setDisplayValue(value);
        return;
      }
      motionValue.set(value);
    }
  }, [isInView, value, motionValue]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      setDisplayValue(Math.floor(latest));
    });
  }, [springValue]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  );
}
