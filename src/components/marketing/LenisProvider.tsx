"use client";

import React, { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface LenisProviderProps {
  children: React.ReactNode;
}

export default function LenisProvider({ children }: LenisProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;

    // Synchronize GSAP ScrollTrigger with Lenis scroll updates
    lenis.on("scroll", ScrollTrigger.update);

    const updateFrame = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateFrame);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateFrame);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
