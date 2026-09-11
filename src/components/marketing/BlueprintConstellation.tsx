"use client";

import React, { useEffect, useRef } from "react";

interface NodePoint {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  label: string;
  type: "trigger" | "ai" | "action";
}

export default function BlueprintConstellation() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Mouse parallax tracking
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX - width / 2) * 0.02;
      mouseY = (e.clientY - height / 2) * 0.02;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Initialize floating schematic nodes
    const nodeCount = 14;
    const labels = [
      "WEBHOOK_IN", "GEMINI_PARSE", "DISCORD_OUT", "STRIPE_EVENT",
      "POSTGRES_DB", "SLACK_NOTIFY", "AI_SUMMARIZE", "REST_ENDPOINT",
      "AUTH_JWT", "CRON_SCHEDULE", "TELEMETRY_LOG", "QUEUE_DISPATCH"
    ];

    const nodes: NodePoint[] = [];
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        width: 90 + Math.random() * 40,
        height: 32,
        label: labels[i % labels.length],
        type: i % 3 === 0 ? "ai" : i % 2 === 0 ? "trigger" : "action",
      });
    }

    let pulseOffset = 0;

    const render = () => {
      // Deep desaturated blueprint canvas clear
      ctx.fillStyle = "#12172A";
      ctx.fillRect(0, 0, width, height);

      // Draw faint schematic grid lines
      ctx.strokeStyle = "rgba(214, 226, 255, 0.04)";
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      pulseOffset += 0.015;

      // Update & render schematic nodes
      nodes.forEach((node, i) => {
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off bounds
        if (node.x < 50 || node.x > width - 150) node.vx *= -1;
        if (node.y < 50 || node.y > height - 100) node.vy *= -1;

        const posX = node.x + mouseX;
        const posY = node.y + mouseY;

        // Draw connections to nearby nodes
        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const otherX = other.x + mouseX;
          const otherY = other.y + mouseY;

          const dx = otherX - posX;
          const dy = otherY - posY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 220) {
            const lineAlpha = (1 - dist / 220) * 0.25;
            ctx.beginPath();
            ctx.moveTo(posX + node.width / 2, posY + node.height / 2);

            // Bezier curve connector
            const cp1x = posX + dx * 0.5;
            const cp1y = posY;
            const cp2x = posX + dx * 0.5;
            const cp2y = otherY;
            ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, otherX + other.width / 2, otherY + other.height / 2);

            ctx.strokeStyle = node.type === "ai"
              ? `rgba(140, 124, 255, ${lineAlpha})`
              : `rgba(255, 180, 84, ${lineAlpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();

            // Traveling signal pulse dot along edge
            const progress = (pulseOffset + i * 0.1) % 1;
            const px = (1 - progress) * (1 - progress) * posX + 2 * (1 - progress) * progress * cp1x + progress * progress * otherX;
            const py = (1 - progress) * (1 - progress) * posY + 2 * (1 - progress) * progress * cp1y + progress * progress * otherY;

            ctx.beginPath();
            ctx.arc(px, py, 2, 0, Math.PI * 2);
            ctx.fillStyle = node.type === "ai" ? "rgba(140, 124, 255, 0.8)" : "rgba(255, 180, 84, 0.9)";
            ctx.fill();
          }
        }

        // Draw node card box
        ctx.fillStyle = "rgba(18, 23, 42, 0.7)";
        ctx.strokeStyle = node.type === "ai" ? "rgba(140, 124, 255, 0.3)" : "rgba(214, 226, 255, 0.12)";
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.roundRect(posX, posY, node.width, node.height, 6);
        ctx.fill();
        ctx.stroke();

        // Node LED indicator dot
        ctx.beginPath();
        ctx.arc(posX + 10, posY + 16, 3, 0, Math.PI * 2);
        ctx.fillStyle = node.type === "ai" ? "#8C7CFF" : "#FFB454";
        ctx.fill();

        // Node monospace label
        ctx.fillStyle = "rgba(241, 240, 234, 0.5)";
        ctx.font = "10px monospace";
        ctx.fillText(node.label, posX + 20, posY + 19);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 opacity-60"
    />
  );
}
