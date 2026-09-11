"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Layers, Activity, ShieldCheck, Database, Globe, Terminal, Code2 } from "lucide-react";
import CodeBlock from "./CodeBlock";
import CountingNumber from "./CountingNumber";

const pillars = [
  {
    id: "compiler",
    title: "Structured Gemini Compiler",
    icon: <Sparkles className="h-4 w-4 text-[#8C7CFF]" />,
    tag: "AST_ENGINE",
    description: "Translates natural language intent into deterministic JSON schema AST representations, ensuring node triggers, LLM prompts, and API Webhooks stay strictly typed.",
    details: [
      "Generative prompt-to-AST translation",
      "Strict Zod schema validation",
      "Zero manual node wiring required",
    ],
  },
  {
    id: "canvas",
    title: "React Flow Node Graph",
    icon: <Layers className="h-4 w-4 text-[#FFB454]" />,
    tag: "CANVAS_CORE",
    description: "Infinite drag-and-drop workflow canvas with custom bezier edge routing, pan/zoom controls, and real-time execution status monitors.",
    details: [
      "Custom React Flow node primitives",
      "Hardware-accelerated SVG edge renderer",
      "Zero canvas lag under heavy node counts",
    ],
  },
  {
    id: "telemetry",
    title: "Realtime Telemetry",
    icon: <Activity className="h-4 w-4 text-[#6EE7B7]" />,
    tag: "AUDIT_LOGS",
    description: "Stream run execution logs, node durations, error stack traces, and output payloads live across active triggers.",
    details: [
      "Sub-millisecond node execution tracking",
      "Structured payload inspection",
      "Live status 200 OK pings",
    ],
  },
  {
    id: "security",
    title: "Firebase & Cloud Security",
    icon: <ShieldCheck className="h-4 w-4 text-[#FFB454]" />,
    tag: "AUTH_BOUNDARIES",
    description: "Google authentication, Firestore real-time state synchronization, encrypted environment API key vaults, and multi-tenant workspace boundaries.",
    details: [
      "Firebase OAuth integration",
      "Encrypted API key storage",
      "Firestore real-time sync",
    ],
  },
];

const sampleJsonCode = `{
  "trigger": {
    "type": "webhook_github",
    "event": "issue_opened"
  },
  "actions": [
    {
      "model": "gemini-3.1-flash",
      "task": "summarize_issue"
    },
    {
      "type": "discord_notification",
      "channel_id": "sys-alerts"
    }
  ]
}`;

export default function ArchitectureSection() {
  const [activePillarId, setActivePillarId] = useState("compiler");
  const activePillar = pillars.find((p) => p.id === activePillarId) || pillars[0];

  return (
    <section id="features" className="py-20 px-6 max-w-6xl mx-auto space-y-12 relative">
      <div className="text-center space-y-2">
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#FFB454] font-bold">
          03 // SYSTEM ARCHITECTURE
        </span>
        <h2 className="text-2xl md:text-4xl font-mono font-bold tracking-tight text-[var(--ink)]">
          Engineered for Production Scale
        </h2>
        <p className="text-xs text-[#8E9BB5] max-w-md mx-auto">
          Full-stack developer architecture designed for speed, safety, and visual clarity.
        </p>
      </div>

      {/* Interactive Blueprint Diagram & Capability Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Pillar Navigation Tabs */}
        <div className="lg:col-span-4 space-y-3">
          {pillars.map((pillar) => {
            const isSelected = pillar.id === activePillarId;
            return (
              <button
                key={pillar.id}
                onClick={() => setActivePillarId(pillar.id)}
                data-cursor="Inspect"
                className={`w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? "bg-[#171E36] border-[#FFB454] shadow-lg shadow-[#FFB454]/10 ring-1 ring-[#FFB454]/30"
                    : "bg-[#0F1424] border-white/5 hover:border-white/20 text-[#8E9BB5]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-black/40 border border-white/10">
                    {pillar.icon}
                  </div>
                  <div>
                    <h3 className={`text-xs font-mono font-bold ${isSelected ? "text-white" : "text-zinc-300"}`}>
                      {pillar.title}
                    </h3>
                    <span className="text-[9px] font-mono text-[#8E9BB5] tracking-widest">{pillar.tag}</span>
                  </div>
                </div>
                <div className={`w-2 h-2 rounded-full ${isSelected ? "bg-[#FFB454] animate-ping" : "bg-white/20"}`} />
              </button>
            );
          })}
        </div>

        {/* Right Column: Live Schematic Inspector Box */}
        <div className="lg:col-span-8 bezel-shell">
          <div className="bezel-core p-6 md:p-8 h-full flex flex-col justify-between space-y-6 bg-[#12172A] border border-[#D6E2FF]/10">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePillar.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-[#171E36] border border-white/10">
                      {activePillar.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-mono font-bold text-white">{activePillar.title}</h3>
                      <span className="text-[10px] font-mono text-[#FFB454] tracking-widest">{activePillar.tag}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-[#8E9BB5] bg-white/5 px-2.5 py-1 rounded border border-white/10">
                    STATUS_OPERATIONAL
                  </span>
                </div>

                <p className="text-xs font-sans text-zinc-300 leading-relaxed max-w-xl">
                  {activePillar.description}
                </p>

                {/* Feature Spec Bullets */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                  {activePillar.details.map((detail, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-[#0F1424] border border-white/5 font-mono text-[10px] text-zinc-300 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#FFB454]" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>

                {/* Specific Live Component Displays */}
                {activePillar.id === "compiler" && (
                  <CodeBlock filename="ast_compiler_output.json" code={sampleJsonCode} />
                )}

                {activePillar.id === "canvas" && (
                  <div className="p-4 rounded-xl bg-[#0F1424] border border-white/10 font-mono text-xs flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Code2 className="h-5 w-5 text-[#FFB454]" />
                      <div>
                        <div className="text-white font-bold">Zero Canvas Lag Execution</div>
                        <div className="text-[10px] text-[#8E9BB5]">FPS target maintained: 60fps</div>
                      </div>
                    </div>
                    <div className="text-sm font-extrabold text-[#6EE7B7]">
                      <CountingNumber value={60} suffix=" FPS" />
                    </div>
                  </div>
                )}

                {activePillar.id === "telemetry" && (
                  <div className="flex items-center justify-between text-xs font-mono p-4 rounded-xl bg-[#0F1424] border border-white/10">
                    <span className="text-[#6EE7B7] flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#6EE7B7] animate-ping" />
                      Status 200 OK · Live Telemetry Stream
                    </span>
                    <span className="text-[#FFB454]">
                      <CountingNumber value={142} suffix="ms" />
                    </span>
                  </div>
                )}

                {activePillar.id === "security" && (
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl bg-[#0F1424] border border-white/10 text-[11px] font-mono text-zinc-300 flex items-center gap-2">
                      <Database className="h-3.5 w-3.5 text-[#FFB454]" />
                      <span>Firestore Sync</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#0F1424] border border-white/10 text-[11px] font-mono text-zinc-300 flex items-center gap-2">
                      <Globe className="h-3.5 w-3.5 text-[#8C7CFF]" />
                      <span>REST Webhooks</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#0F1424] border border-white/10 text-[11px] font-mono text-zinc-300 flex items-center gap-2">
                      <ShieldCheck className="h-3.5 w-3.5 text-[#6EE7B7]" />
                      <span>AES Key Store</span>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
