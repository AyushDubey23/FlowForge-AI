"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Sparkles,
  Zap,
  MessageSquare,
  ChevronRight,
  Terminal,
  Clock,
  CheckCircle2,
  Cpu,
  Layers,
  Activity,
  Play,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nodeSequence = [
  { id: "node-1", label: "GitHub Webhook", type: "WEBHOOK", icon: <Zap className="h-4 w-4 text-cyan-400" />, status: "active" },
  { id: "node-2", label: "Gemini AI Summarizer", type: "LLM PARSER", icon: <Sparkles className="h-4 w-4 text-emerald-400" />, status: "active" },
  { id: "node-3", label: "Send Discord Message", type: "NOTIFICATION", icon: <MessageSquare className="h-4 w-4 text-sky-400" />, status: "active" },
];

export default function ScrollVideoShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll Progress Tracking (300vh height sticky container)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // 3D Perspective Transforms (Apple/Linear Style)
  const rotateX = useTransform(scrollYProgress, [0, 0.4, 0.8, 1], [18, 0, 0, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.92, 1, 1.02, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0.4, 1, 1, 0.8]);

  // Phase Step Transitions (Non-Overlapping)
  const phase1Opacity = useTransform(scrollYProgress, [0, 0.18, 0.23], [1, 1, 0]);
  const phase2Opacity = useTransform(scrollYProgress, [0.25, 0.30, 0.43, 0.48], [0, 1, 1, 0]);
  const phase3Opacity = useTransform(scrollYProgress, [0.50, 0.55, 0.68, 0.73], [0, 1, 1, 0]);
  const phase4Opacity = useTransform(scrollYProgress, [0.75, 0.80, 1], [0, 1, 1]);

  // Timeline Progress Bar Widths
  const timelineProgress = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={containerRef} className="relative h-[300vh] w-full">
      {/* Sticky Scrollytelling Viewport */}
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden px-4 md:px-8">
        {/* Ambient Aurora Light Glow behind Scrollytelling Canvas */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-cyan-500/10 rounded-full blur-[180px] pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[160px] pointer-events-none" />

        {/* Section Header */}
        <div className="text-center space-y-2 mb-6 z-10 max-w-xl">
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-cyan-400 font-semibold">
            Interactive Scrollytelling Engine
          </span>
          <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white">
            Scroll to Watch Compilation
          </h2>
          <p className="text-xs text-zinc-400">
            Control the live transformation of prompts into executable node graphs as you scroll.
          </p>
        </div>

        {/* 3D Perspective Card Canvas Container */}
        <motion.div
          style={{
            rotateX,
            scale,
            opacity,
          }}
          className="perspective-1000 preserve-3d w-full max-w-4xl bezel-shell relative z-10 shadow-2xl transition-shadow"
        >
          <div className="bezel-core p-6 md:p-8 bg-[#090C13] border border-white/10 relative overflow-hidden min-h-[380px] flex flex-col justify-between">
            {/* Top Frame Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 z-10">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500/80" />
                <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                <span className="text-[11px] font-mono text-zinc-500 ml-2">flowforge_compiler_v1.6.2</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
                <Play className="h-3 w-3 fill-cyan-400" />
                <span>Interactive Frame Scrubbing</span>
              </div>
            </div>

            {/* Canvas Body Content (Dynamic Scrollytelling Phases) */}
            <div className="relative flex-1 py-8 flex items-center justify-center min-h-[260px]">
              {/* Phase 1: Natural Language Prompt Input */}
              <motion.div
                style={{ opacity: phase1Opacity }}
                className="absolute inset-0 flex flex-col items-center justify-center space-y-4 px-4 text-center"
              >
                <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                  <Cpu className="h-8 w-8 animate-pulse" />
                </div>
                <h3 className="text-lg font-bold text-white max-w-md">
                  &quot;When a GitHub issue is created, summarize it with AI and send it to Discord.&quot;
                </h3>
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                  Phase 01 — Natural Language Trigger Input
                </span>
              </motion.div>

              {/* Phase 2: Gemini AST Code Generation Stream */}
              <motion.div
                style={{ opacity: phase2Opacity }}
                className="absolute inset-0 flex flex-col items-center justify-center p-4"
              >
                <div className="w-full max-w-lg p-5 rounded-xl bg-black/80 border border-white/10 font-mono text-xs text-zinc-300 space-y-2 shadow-inner">
                  <div className="flex items-center justify-between text-zinc-500 border-b border-white/5 pb-2 text-[10px]">
                    <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
                      <Terminal className="h-3.5 w-3.5" />
                      ast_compiler.ts
                    </span>
                    <span>Parsing Schema tokens...</span>
                  </div>
                  <p><span className="text-cyan-400">&quot;trigger&quot;</span>: &#123; <span className="text-emerald-400">&quot;source&quot;</span>: <span className="text-sky-400">&quot;github_issues.opened&quot;</span> &#125;,</p>
                  <p><span className="text-cyan-400">&quot;pipeline&quot;</span>: [</p>
                  <p className="pl-4"><span className="text-emerald-400">&quot;gemini-1.5-pro.summarize&quot;</span>,</p>
                  <p className="pl-4"><span className="text-emerald-400">&quot;discord_webhook.send&quot;</span></p>
                  <p>],</p>
                  <p><span className="text-cyan-400">&quot;status&quot;</span>: <span className="text-emerald-400">&quot;AST_VALIDATED&quot;</span></p>
                </div>
              </motion.div>

              {/* Phase 3: Visual Node Graph Assembly */}
              <motion.div
                style={{ opacity: phase3Opacity }}
                className="absolute inset-0 flex items-center justify-center px-4"
              >
                <div className="flex flex-col md:flex-row items-center gap-6 w-full justify-center">
                  {nodeSequence.map((node, i) => (
                    <React.Fragment key={node.id}>
                      <div className="p-4 rounded-xl border border-cyan-500/40 bg-white/5 backdrop-blur-md shadow-lg shadow-cyan-500/10 flex items-center gap-3 w-52">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black border border-white/10">
                          {node.icon}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-white truncate">{node.label}</h4>
                          <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider">{node.type}</span>
                        </div>
                      </div>
                      {i < nodeSequence.length - 1 && (
                        <div className="hidden md:flex items-center text-cyan-400 animate-pulse">
                          <ChevronRight className="h-6 w-6" />
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </motion.div>

              {/* Phase 4: Live Execution Telemetry */}
              <motion.div
                style={{ opacity: phase4Opacity }}
                className="absolute inset-0 flex flex-col items-center justify-center space-y-4 px-4 text-center"
              >
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-mono text-xs">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                  <span className="font-bold">Workflow Executed Successfully (200 OK)</span>
                </div>
                <div className="flex items-center gap-6 text-xs font-mono text-zinc-400">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-cyan-400" /> Latency: 142ms
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Activity className="h-4 w-4 text-emerald-400" /> Status: Live Triggered
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Bottom Timeline Step Bar */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between z-10">
              <div className="flex items-center gap-6 text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-400">
                <span className="text-cyan-400 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
                  01 Prompt
                </span>
                <span>02 AST Parse</span>
                <span>03 Build Graph</span>
                <span>04 Telemetry</span>
              </div>
              {/* Progress track */}
              <div className="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div style={{ width: timelineProgress }} className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
