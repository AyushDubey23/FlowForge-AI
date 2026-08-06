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
  Activity,
  Play,
} from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  { id: 0, label: "01 PROMPT", title: "Natural Language Input" },
  { id: 1, label: "02 AST PARSE", title: "Gemini AST Compilation" },
  { id: 2, label: "03 BUILD GRAPH", title: "Node Graph Assembly" },
  { id: 3, label: "04 TELEMETRY", title: "Live Execution Telemetry" },
];

const nodeSequence = [
  { id: "node-1", label: "GitHub Webhook", type: "WEBHOOK", icon: <Zap className="h-4 w-4 text-cyan-400" /> },
  { id: "node-2", label: "Gemini AI Summarizer", type: "LLM PARSER", icon: <Sparkles className="h-4 w-4 text-emerald-400" /> },
  { id: "node-3", label: "Send Discord Message", type: "NOTIFICATION", icon: <MessageSquare className="h-4 w-4 text-sky-400" /> },
];

export default function ScrollVideoShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll Progress Tracking across a 300vh pinned section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Track translates cleanly during middle 80% of pinned travel (0.1 to 0.9)
  const translateX = useTransform(scrollYProgress, [0.1, 0.9], ["0%", "-75%"]);

  // 3D Perspective Tilt on Entrance & Exit
  const rotateX = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [12, 0, 0, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0.95, 1, 1, 0.96]);

  // Timeline progress bar
  const timelineWidth = useTransform(scrollYProgress, [0.1, 0.9], ["0%", "100%"]);

  return (
    <div ref={containerRef} className="relative h-[300vh] w-full">
      {/* Sticky Viewport Container (Locked firmly in viewport center) */}
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden px-4 md:px-8">
        {/* Ambient Aurora Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-cyan-500/10 rounded-full blur-[180px] pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-[450px] h-[450px] bg-emerald-500/5 rounded-full blur-[160px] pointer-events-none" />

        {/* Section Header (Clean Developer Copy, No Meta Scroll Mentions) */}
        <div className="text-center space-y-2 mb-6 z-10 max-w-xl">
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-cyan-400 font-semibold">
            Generative AI Compilation Engine
          </span>
          <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white">
            Watch Prompt-to-Node Compilation
          </h2>
          <p className="text-xs text-zinc-400">
            Observe how plain language triggers compile into typed AST execution graphs in real time.
          </p>
        </div>

        {/* macOS Three-Dots Hardware Frame Container */}
        <motion.div
          style={{ rotateX, scale }}
          className="perspective-1000 preserve-3d w-full max-w-4xl bezel-shell relative z-10 shadow-2xl"
        >
          <div className="bezel-core p-5 md:p-7 bg-[#080B11] border border-white/10 relative overflow-hidden flex flex-col justify-between">
            {/* macOS Three-Dots Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 z-20 bg-[#080B11]">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500/90 shadow-sm" />
                <div className="h-3 w-3 rounded-full bg-amber-500/90 shadow-sm" />
                <div className="h-3 w-3 rounded-full bg-emerald-500/90 shadow-sm" />
                <span className="text-[11px] font-mono text-zinc-400 font-semibold ml-2">flowforge_compiler_v1.6.2</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
                <Play className="h-3 w-3 fill-cyan-400" />
                <span>Interactive compilation stream</span>
              </div>
            </div>

            {/* Track Canvas Body (4 Phase Cards Side-by-Side) */}
            <div className="relative w-full overflow-hidden py-8 min-h-[260px]">
              <motion.div
                style={{ x: translateX }}
                className="flex w-[400%] h-full"
              >
                {/* Phase 1: Natural Language Prompt Input */}
                <div className="w-1/4 shrink-0 flex flex-col items-center justify-center space-y-4 px-6 text-center">
                  <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shadow-lg shadow-cyan-500/10">
                    <Cpu className="h-8 w-8 animate-pulse" />
                  </div>
                  <h3 className="text-base md:text-xl font-bold text-white max-w-lg leading-relaxed">
                    &quot;When a GitHub issue is created, summarize it with AI and send it to Discord.&quot;
                  </h3>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400/80 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
                    Step 01 — Natural Language Trigger Input
                  </span>
                </div>

                {/* Phase 2: Gemini AST Code Generation Stream */}
                <div className="w-1/4 shrink-0 flex flex-col items-center justify-center px-6">
                  <div className="w-full max-w-lg p-5 rounded-xl bg-black/80 border border-white/10 font-mono text-xs text-zinc-300 space-y-2 shadow-inner">
                    <div className="flex items-center justify-between text-zinc-500 border-b border-white/5 pb-2 text-[10px]">
                      <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
                        <Terminal className="h-3.5 w-3.5" />
                        ast_compiler.ts
                      </span>
                      <span className="text-emerald-400">Validated AST Schema</span>
                    </div>
                    <p><span className="text-cyan-400">&quot;trigger&quot;</span>: &#123; <span className="text-emerald-400">&quot;source&quot;</span>: <span className="text-sky-400">&quot;github_issues.opened&quot;</span> &#125;,</p>
                    <p><span className="text-cyan-400">&quot;pipeline&quot;</span>: [</p>
                    <p className="pl-4"><span className="text-emerald-400">&quot;gemini-1.5-pro.summarize&quot;</span>,</p>
                    <p className="pl-4"><span className="text-emerald-400">&quot;discord_webhook.send&quot;</span></p>
                    <p>],</p>
                    <p><span className="text-cyan-400">&quot;status&quot;</span>: <span className="text-emerald-400">&quot;AST_COMPILED_OK&quot;</span></p>
                  </div>
                </div>

                {/* Phase 3: Visual Node Graph Assembly */}
                <div className="w-1/4 shrink-0 flex items-center justify-center px-6">
                  <div className="flex flex-col md:flex-row items-center gap-4 w-full justify-center">
                    {nodeSequence.map((node, i) => (
                      <React.Fragment key={node.id}>
                        <div className="p-4 rounded-xl border border-cyan-500/40 bg-white/5 backdrop-blur-md shadow-lg shadow-cyan-500/10 flex items-center gap-3.5 w-56">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black border border-white/10 shrink-0">
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
                </div>

                {/* Phase 4: Live Execution Telemetry */}
                <div className="w-1/4 shrink-0 flex flex-col items-center justify-center space-y-4 px-6 text-center">
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-mono text-xs shadow-lg shadow-emerald-500/10">
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
                </div>
              </motion.div>
            </div>

            {/* Bottom Timeline Progress Bar */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between z-20 bg-[#080B11]">
              <div className="flex items-center gap-6 text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-400">
                {steps.map((s) => (
                  <span key={s.id} className="hover:text-white transition-colors">
                    {s.label}
                  </span>
                ))}
              </div>

              {/* Progress Bar Track */}
              <div className="w-40 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  style={{ width: timelineWidth }}
                  className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
