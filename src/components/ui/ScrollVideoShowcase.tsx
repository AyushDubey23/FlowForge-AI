"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
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
  const [activeStep, setActiveStep] = useState(0);

  // Scroll Progress Tracking across a compact 160vh section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Dynamically update activeStep based on scroll progress
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest < 0.25) setActiveStep(0);
    else if (latest < 0.5) setActiveStep(1);
    else if (latest < 0.75) setActiveStep(2);
    else setActiveStep(3);
  });

  return (
    <div ref={containerRef} className="relative h-[160vh] w-full my-8">
      {/* Sticky Viewport Container */}
      <div className="sticky top-16 h-[calc(100vh-5rem)] w-full flex flex-col items-center justify-center overflow-hidden px-4 md:px-8">
        {/* Ambient Aurora Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />

        {/* Section Header */}
        <div className="text-center space-y-2 mb-6 z-10 max-w-xl">
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-cyan-400 font-semibold">
            Interactive Compiler Pipeline
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
            Watch Prompt-to-Node Compilation
          </h2>
          <p className="text-xs text-zinc-400">
            Scroll down or click the step tabs below to scrub through the compilation lifecycle.
          </p>
        </div>

        {/* Double-Bezel Hardware Frame Showcase */}
        <div className="w-full max-w-4xl bezel-shell relative z-10 shadow-2xl">
          <div className="bezel-core p-5 md:p-7 bg-[#080B11] border border-white/10 relative overflow-hidden min-h-[340px] flex flex-col justify-between">
            {/* Top Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 z-10">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500/80" />
                <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                <span className="text-[11px] font-mono text-zinc-500 ml-2">flowforge_compiler_v1.6.2</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
                <Play className="h-3 w-3 fill-cyan-400" />
                <span>Phase {activeStep + 1} of 4</span>
              </div>
            </div>

            {/* Canvas Body Content (AnimatePresence Guarantees Zero Text Overlap) */}
            <div className="relative flex-1 py-6 flex items-center justify-center min-h-[220px]">
              <AnimatePresence mode="wait">
                {activeStep === 0 && (
                  <motion.div
                    key="step-0"
                    initial={{ opacity: 0, y: 15, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -15, scale: 0.97 }}
                    transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                    className="flex flex-col items-center justify-center space-y-4 px-4 text-center w-full"
                  >
                    <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                      <Cpu className="h-7 w-7 animate-pulse" />
                    </div>
                    <h3 className="text-base md:text-lg font-bold text-white max-w-lg leading-relaxed">
                      &quot;When a GitHub issue is created, summarize it with AI and send it to Discord.&quot;
                    </h3>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                      Step 01 — Natural Language Trigger Input
                    </span>
                  </motion.div>
                )}

                {activeStep === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, y: 15, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -15, scale: 0.97 }}
                    transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                    className="flex flex-col items-center justify-center p-2 w-full"
                  >
                    <div className="w-full max-w-lg p-4 rounded-xl bg-black/80 border border-white/10 font-mono text-xs text-zinc-300 space-y-1.5 shadow-inner">
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
                  </motion.div>
                )}

                {activeStep === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, y: 15, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -15, scale: 0.97 }}
                    transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                    className="flex flex-col md:flex-row items-center gap-4 w-full justify-center px-4"
                  >
                    {nodeSequence.map((node, i) => (
                      <React.Fragment key={node.id}>
                        <div className="p-3.5 rounded-xl border border-cyan-500/40 bg-white/5 backdrop-blur-md shadow-lg shadow-cyan-500/10 flex items-center gap-3 w-52">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black border border-white/10 shrink-0">
                            {node.icon}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-white truncate">{node.label}</h4>
                            <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider">{node.type}</span>
                          </div>
                        </div>
                        {i < nodeSequence.length - 1 && (
                          <div className="hidden md:flex items-center text-cyan-400 animate-pulse">
                            <ChevronRight className="h-5 w-5" />
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </motion.div>
                )}

                {activeStep === 3 && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, y: 15, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -15, scale: 0.97 }}
                    transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                    className="flex flex-col items-center justify-center space-y-4 px-4 text-center w-full"
                  >
                    <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-mono text-xs">
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
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Interactive Step Tabs */}
            <div className="pt-4 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 z-10">
              <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
                {steps.map((step) => {
                  const isActive = activeStep === step.id;
                  return (
                    <button
                      key={step.id}
                      onClick={() => setActiveStep(step.id)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-[10px] font-mono font-semibold transition-all flex items-center gap-1.5 active:scale-[0.97]",
                        isActive
                          ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm"
                          : "text-zinc-400 hover:text-white hover:bg-white/5"
                      )}
                    >
                      {isActive && <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />}
                      <span>{step.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Step indicator track */}
              <div className="w-full md:w-36 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 transition-all duration-300"
                  style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
