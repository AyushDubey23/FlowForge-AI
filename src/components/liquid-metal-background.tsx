"use client";

import React, { useEffect, useState } from "react";
import { LiquidMetal } from "@paper-design/shaders-react";

export function LiquidMetalBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="absolute inset-0 -z-10 bg-[#00042e]" />;
  }

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none select-none">
      <LiquidMetal
        width="100%"
        height="100%"
        colorBack="#00042e"
        colorTint="#5b4dc7"
        repetition={4}
        softness={0.45}
        shiftRed={-0.5}
        shiftBlue={-1}
        distortion={0.1}
        contour={1}
        shape="none"
        speed={0.4}
        scale={2.2}
      />
    </div>
  );
}

export default LiquidMetalBackground;
