"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Ripple {
  x: number;
  y: number;
  id: number;
}

interface RippleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "signal" | "outline" | "intelligence";
  className?: string;
  cursorLabel?: string;
}

export default function RippleButton({
  children,
  variant = "signal",
  className = "",
  cursorLabel,
  onClick,
  ...props
}: RippleButtonProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newRipple = { x, y, id: Date.now() };

    setRipples((prev) => [...prev, newRipple]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);

    if (onClick) onClick(e);
  };

  const variants = {
    signal: "bg-[#FFB454] hover:bg-[#ffa32b] text-black font-extrabold shadow-lg shadow-[#FFB454]/20 border border-[#FFB454]/50",
    intelligence: "bg-[#8C7CFF] hover:bg-[#7866ff] text-white font-extrabold shadow-lg shadow-[#8C7CFF]/20 border border-[#8C7CFF]/50",
    outline: "bg-white/5 hover:bg-white/10 text-[var(--ink)] font-semibold border border-white/10 hover:border-white/25",
  };

  return (
    <button
      onClick={handleClick}
      data-cursor={cursorLabel}
      className={cn(
        "relative overflow-hidden rounded-xl h-11 px-6 text-xs font-mono tracking-wider transition-all duration-300 active:scale-[0.98] inline-flex items-center justify-center gap-2 cursor-pointer select-none",
        variants[variant],
        className
      )}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>

      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          initial={{ scale: 0, opacity: 0.6 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            top: ripple.y,
            left: ripple.x,
            x: "-50%",
            y: "-50%",
          }}
          className="absolute w-20 h-20 rounded-full bg-white/40 pointer-events-none z-0"
        />
      ))}
    </button>
  );
}
