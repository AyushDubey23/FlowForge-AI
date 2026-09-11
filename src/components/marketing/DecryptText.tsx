"use client";

import React, { useEffect, useState } from "react";
import { DECRYPT_CHARACTERS, prefersReducedMotion } from "@/lib/motion";

interface DecryptTextProps {
  text: string;
  className?: string;
  speed?: number; // ms per tick
  delay?: number; // ms before start
  animateOnMount?: boolean;
  trigger?: boolean;
  onComplete?: () => void;
}

export default function DecryptText({
  text,
  className = "",
  speed = 30,
  delay = 0,
  animateOnMount = true,
  trigger = true,
  onComplete,
}: DecryptTextProps) {
  const [displayText, setDisplayText] = useState(animateOnMount ? "" : text);
  const [isDecrypting, setIsDecrypting] = useState(false);

  useEffect(() => {
    if (!trigger) return;
    if (prefersReducedMotion()) {
      setDisplayText(text);
      if (onComplete) onComplete();
      return;
    }

    let intervalId: NodeJS.Timeout;
    let iteration = 0;

    const timeoutId = setTimeout(() => {
      setIsDecrypting(true);

      intervalId = setInterval(() => {
        setDisplayText(
          text
            .split("")
            .map((char, index) => {
              if (char === " " || char === "\n") return char;
              if (index < iteration) {
                return text[index];
              }
              return DECRYPT_CHARACTERS[
                Math.floor(Math.random() * DECRYPT_CHARACTERS.length)
              ];
            })
            .join("")
        );

        if (iteration >= text.length) {
          clearInterval(intervalId);
          setIsDecrypting(false);
          setDisplayText(text);
          if (onComplete) onComplete();
        }

        iteration += 1 / 2;
      }, speed);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [text, speed, delay, trigger, onComplete]);

  return (
    <span className={className}>
      {displayText}
    </span>
  );
}
