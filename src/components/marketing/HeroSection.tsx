"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sparkles, Zap, MessageSquare, ArrowRight, Play, Terminal } from "lucide-react";
import DecryptText from "./DecryptText";
import RippleButton from "./RippleButton";
import { prefersReducedMotion } from "@/lib/motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HeroSection() {
  const router = useRouter();
  const heroRef = useRef<HTMLDivElement>(null);
  const diagramRef = useRef<HTMLDivElement>(null);

  // Compile sequence state machine
  const [phase, setPhase] = useState<"canvas" | "typing" | "scramble" | "nodes" | "complete">("canvas");
  const [typedPrompt, setTypedPrompt] = useState("");
  const targetPrompt = "When a GitHub issue is opened, summarize details using AI, then post a notification to Discord.";

  useEffect(() => {
    if (prefersReducedMotion()) {
      setPhase("complete");
      setTypedPrompt(targetPrompt);
      return;
    }

    // Sequence timeline:
    // 0.0s - 0.6s: Canvas fade-in
    const timer1 = setTimeout(() => setPhase("typing"), 600);

    // 0.6s - 1.8s: Typewriter prompt
    let charIndex = 0;
    const typingInterval = setInterval(() => {
      if (charIndex <= targetPrompt.length) {
        setTypedPrompt(targetPrompt.slice(0, charIndex));
        charIndex++;
      } else {
        clearInterval(typingInterval);
        setPhase("scramble");
      }
    }, 15);

    // 1.8s - 2.2s: Scramble flicker
    const timer2 = setTimeout(() => setPhase("nodes"), 2200);

    // 2.2s - 3.4s: Draw nodes
    const timer3 = setTimeout(() => setPhase("complete"), 3400);

    return () => {
      clearTimeout(timer1);
      clearInterval(typingInterval);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  // GSAP ScrollTrigger morph pinned hero transition to playground
  useEffect(() => {
    if (prefersReducedMotion() || !heroRef.current || !diagramRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(diagramRef.current, {
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
        scale: 0.92,
        y: 60,
        opacity: 0.85,
        borderRadius: "2rem",
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative pt-12 pb-20 px-6 max-w-6xl mx-auto space-y-10"
    >
      {/* Eyebrow Compiler Tag */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-center"
      >
        <div className="inline-flex items-center gap-2.5 bg-[#171E36] border border-[#8C7CFF]/40 px-4 py-1.5 rounded-full text-xs font-mono text-[#8C7CFF] shadow-lg shadow-[#8C7CFF]/10">
          <Sparkles className="h-3.5 w-3.5 text-[#FFB454] animate-pulse" />
          <span>NATURAL_LANGUAGE → SCHEMATIC_AST_COMPILER</span>
        </div>
      </motion.div>

      {/* Main Monospace Compiler Headline */}
      <div className="text-center max-w-4xl mx-auto space-y-4">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-mono font-extrabold tracking-tight text-[var(--ink)] leading-[1.15]">
          {phase === "complete" ? (
            <span>
              Build Production Automations <br className="hidden md:block" />
              Using <span className="text-[#FFB454] underline decoration-[#FFB454]/40 underline-offset-8">Natural Language.</span>
            </span>
          ) : (
            <DecryptText
              text="Build Production Automations Using Natural Language."
              speed={20}
              delay={3200}
              className="text-white"
            />
          )}
        </h1>

        <p className="text-sm md:text-base font-sans text-[#8E9BB5] max-w-2xl mx-auto leading-relaxed">
          Describe trigger events and actions in plain English. FlowForge compiles instructions into live, editable visual node graphs, deployable in seconds.
        </p>

        {/* Action CTAs */}
        <div className="flex items-center justify-center gap-4 pt-2">
          <RippleButton
            variant="signal"
            cursorLabel="Console"
            onClick={() => router.push("/login")}
            className="h-12 px-7 text-xs font-mono font-bold shadow-xl shadow-[#FFB454]/20"
          >
            <span>Launch Console</span>
            <ArrowRight className="h-4 w-4" />
          </RippleButton>
          <RippleButton
            variant="outline"
            cursorLabel="Simulation"
            onClick={() => {
              document.getElementById("sandbox")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="h-12 px-6 text-xs font-mono font-medium"
          >
            <Play className="h-3.5 w-3.5 text-[#FFB454]" />
            <span>View Simulation</span>
          </RippleButton>
        </div>
      </div>

      {/* The Signature Hero Schematic Diagram */}
      <div ref={diagramRef} className="bezel-shell max-w-4xl mx-auto transition-transform">
        <div className="bezel-core p-6 md:p-8 space-y-6 relative overflow-hidden bg-[#12172A] border border-[#D6E2FF]/10 shadow-2xl">
          {/* Terminal Input Bar */}
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#0B0E1A] border border-white/10 font-mono text-xs text-zinc-300 shadow-inner">
            <Terminal className="h-4 w-4 text-[#8C7CFF] shrink-0" />
            <div className="flex-1 truncate">
              {phase === "scramble" ? (
                <span className="text-[#FFB454] animate-pulse">
                  [PARSING_TOKENS...] <DecryptText text={typedPrompt} speed={10} />
                </span>
              ) : (
                <span>
                  {typedPrompt}
                  {phase === "typing" && <span className="animate-ping inline-block w-1.5 h-3 bg-[#FFB454] ml-1" />}
                </span>
              )}
            </div>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#8C7CFF]/15 text-[#8C7CFF] border border-[#8C7CFF]/30">
              Gemini 3.1 Flash
            </span>
          </div>

          {/* Interactive SVG Diagram Node Animation Canvas */}
          <div className="relative h-64 md:h-72 rounded-xl bg-[#090C16] border border-white/5 flex items-center justify-center p-4 blueprint-grid overflow-hidden">
            {/* SVG Connecting Bezier Flow Edges */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
              <defs>
                <linearGradient id="edgeGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FFB454" />
                  <stop offset="100%" stopColor="#8C7CFF" />
                </linearGradient>
                <linearGradient id="edgeGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8C7CFF" />
                  <stop offset="100%" stopColor="#6EE7B7" />
                </linearGradient>
              </defs>

              {(phase === "nodes" || phase === "complete") && (
                <>
                  {/* Connection line 1: Node 1 -> Node 2 */}
                  <motion.path
                    d="M 220 120 C 310 120, 310 120, 400 120"
                    fill="none"
                    stroke="url(#edgeGrad1)"
                    strokeWidth="2.5"
                    strokeDasharray="6 6"
                    className="animate-flow-dash"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8 }}
                  />

                  {/* Connection line 2: Node 2 -> Node 3 */}
                  <motion.path
                    d="M 580 120 C 670 120, 670 120, 760 120"
                    fill="none"
                    stroke="url(#edgeGrad2)"
                    strokeWidth="2.5"
                    strokeDasharray="6 6"
                    className="animate-flow-dash"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  />
                </>
              )}
            </svg>

            {/* Compiled Nodes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 w-full max-w-3xl z-10">
              {/* Node 1: Trigger */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={phase === "nodes" || phase === "complete" ? { opacity: 1, scale: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.1 }}
                data-cursor="Trigger"
                className="p-4 rounded-xl bg-[#171E36] border border-[#FFB454]/50 shadow-xl shadow-[#FFB454]/10 space-y-2 relative"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FFB454]/20 border border-[#FFB454]/50 text-[#FFB454]">
                    <Zap className="h-4 w-4" />
                  </div>
                  <span className="text-[9px] font-mono text-[#FFB454] bg-[#FFB454]/10 px-2 py-0.5 rounded border border-[#FFB454]/30 uppercase font-bold">
                    TRIGGER
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-mono font-bold text-white">GitHub Issue Opened</h4>
                  <p className="text-[10px] font-mono text-[#8E9BB5]">Webhook endpoint active</p>
                </div>
              </motion.div>

              {/* Node 2: AI Parse */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={phase === "nodes" || phase === "complete" ? { opacity: 1, scale: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.5 }}
                data-cursor="Gemini AI"
                className="p-4 rounded-xl bg-[#171E36] border border-[#8C7CFF]/50 shadow-xl shadow-[#8C7CFF]/10 space-y-2 relative"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#8C7CFF]/20 border border-[#8C7CFF]/50 text-[#8C7CFF]">
                    <Sparkles className="h-4 w-4 animate-spin-slow" />
                  </div>
                  <span className="text-[9px] font-mono text-[#8C7CFF] bg-[#8C7CFF]/10 px-2 py-0.5 rounded border border-[#8C7CFF]/30 uppercase font-bold">
                    GEMINI AI
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-mono font-bold text-white">Summarize with AI</h4>
                  <p className="text-[10px] font-mono text-[#8E9BB5]">AST schema compilation</p>
                </div>
              </motion.div>

              {/* Node 3: Action */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={phase === "nodes" || phase === "complete" ? { opacity: 1, scale: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.9 }}
                data-cursor="Discord Out"
                className="p-4 rounded-xl bg-[#171E36] border border-[#6EE7B7]/50 shadow-xl shadow-[#6EE7B7]/10 space-y-2 relative"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#6EE7B7]/20 border border-[#6EE7B7]/50 text-[#6EE7B7]">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <span className="text-[9px] font-mono text-[#6EE7B7] bg-[#6EE7B7]/10 px-2 py-0.5 rounded border border-[#6EE7B7]/30 uppercase font-bold">
                    ACTION
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-mono font-bold text-white">Post to Discord</h4>
                  <p className="text-[10px] font-mono text-[#8E9BB5]">Status 200 OK · 142ms</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
