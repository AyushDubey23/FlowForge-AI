"use client";

import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  z: number;
  color: string;
}

export default function ThreeDBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Re-initialize particles on resize
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Create 3D particles
    const particleCount = 120;
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: (Math.random() - 0.5) * 2000,
        y: (Math.random() - 0.5) * 2000,
        z: Math.random() * 2000,
        color: Math.random() > 0.5 ? "124, 58, 237" : "99, 102, 241", // Purple or indigo
      });
    }

    // Focal length for 3D projection
    const fov = 400;

    // Mouse position coordinates for camera tilt effect
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX - width / 2) * 0.15;
      mouseY = (e.clientY - height / 2) * 0.15;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Animation Loop
    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
      ctx.fillRect(0, 0, width, height);

      // Camera rotations based on mouse and timer
      const time = Date.now() * 0.00015;
      const camX = mouseX + Math.sin(time) * 40;
      const camY = mouseY + Math.cos(time) * 40;

      // Project and draw particles
      const projected: Array<{ sx: number; sy: number; size: number; alpha: number; color: string }> = [];

      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];

        // Move particles forward in Z space
        p.z -= 1.8;
        if (p.z <= 0) {
          p.z = 2000;
          p.x = (Math.random() - 0.5) * 2000;
          p.y = (Math.random() - 0.5) * 2000;
        }

        // Apply camera shift
        const rx = p.x - camX;
        const ry = p.y - camY;
        const rz = p.z;

        // Project Z space to 2D
        const scale = fov / (fov + rz);
        const sx = width / 2 + rx * scale;
        const sy = height / 2 + ry * scale;

        // Size based on depth
        const size = Math.max(0.5, scale * 3.5);
        const alpha = Math.min(1, (1 - rz / 2000) * 0.8);

        if (sx >= 0 && sx <= width && sy >= 0 && sy <= height) {
          projected.push({ sx, sy, size, alpha, color: p.color });

          // Render particle point
          ctx.beginPath();
          ctx.arc(sx, sy, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.color}, ${alpha})`;
          ctx.fill();
        }
      }

      // Draw faint constellation lines between close points
      ctx.lineWidth = 0.5;
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const p1 = projected[i];
          const p2 = projected[j];

          const dx = p1.sx - p2.sx;
          const dy = p1.sy - p2.sy;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Only draw lines for close particles
          if (dist < 85) {
            const lineAlpha = Math.min(p1.alpha, p2.alpha) * (1 - dist / 85) * 0.22;
            ctx.beginPath();
            ctx.moveTo(p1.sx, p1.sy);
            ctx.lineTo(p2.sx, p2.sy);
            ctx.strokeStyle = `rgba(${p1.color}, ${lineAlpha})`;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 mix-blend-screen opacity-35"
      style={{ filter: "blur(0.5px)" }}
    />
  );
}
