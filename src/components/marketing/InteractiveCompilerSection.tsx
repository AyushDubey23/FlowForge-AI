"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, GitBranch, Zap, Sparkles, MessageSquare, ChevronRight, Terminal } from "lucide-react";
import DecryptText from "./DecryptText";
import RippleButton from "./RippleButton";
import { cn } from "@/lib/utils";

const simulatorNodes = [
  { id: "s1", type: "webhook", label: "GitHub Webhook Trigger", icon: <Zap className="h-4 w-4 text-[#FFB454]" />, color: "border-[#FFB454]/40 bg-[#FFB454]/10" },
  { id: "s2", type: "aiPrompt", label: "Gemini AI Summarizer", icon: <Sparkles className="h-4 w-4 text-[#8C7CFF]" />, color: "border-[#8C7CFF]/40 bg-[#8C7CFF]/10" },
  { id: "s3", type: "notification", label: "Send Discord Message", icon: <MessageSquare className="h-4 w-4 text-[#6EE7B7]" />, color: "border-[#6EE7B7]/40 bg-[#6EE7B7]/10" },
];

export default function InteractiveCompilerSection() {
  const [simulationPrompt, setSimulationPrompt] = useState(
    "When a GitHub issue is created, summarize it with AI and send it to Discord."
  );
  const [simulating, setSimulating] = useState(false);
  const [simulationStep, setSimulationStep] = useState<number>(-1);

  const handleSimulate = () => {
    if (simulating) return;
    setSimulating(true);
    setSimulationStep(0);

    const interval = setInterval(() => {
      setSimulationStep((prev) => {
        if (prev >= 2) {
          clearInterval(interval);
          setSimulating(false);
          return 3;
        }
        return prev + 1;
      });
    }, 1000);
  };

  return (
    <section id="sandbox" className="py-20 px-6 max-w-5xl mx-auto space-y-8 relative">
      <div className="text-center space-y-2">
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#FFB454] font-bold">
          02 // INTERACTIVE PLAYGROUND
        </span>
        <h2 className="text-2xl md:text-4xl font-mono font-bold tracking-tight text-[var(--ink)]">
          Natural Language to Visual Nodes
        </h2>
        <p className="text-xs text-[#8E9BB5] max-w-md mx-auto">
          Test the compilation engine below to translate plain English instructions into visual execution graphs.
        </p>
      </div>

      {/* Blueprint Double-Bezel Hardware Panel */}
      <div className="bezel-shell">
        <div className="bezel-core p-6 md:p-8 relative overflow-hidden bg-[#12172A] border border-[#D6E2FF]/10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div className="flex-1 max-w-xl">
              <label className="text-[10px] font-mono text-[#8E9BB5] uppercase tracking-wider block mb-1.5 flex items-center gap-2">
                <Terminal className="h-3.5 w-3.5 text-[#FFB454]" />
                <span>Natural Language Workflow Instruction</span>
              </label>
              <input
                type="text"
                value={simulationPrompt}
                onChange={(e) => setSimulationPrompt(e.target.value)}
                disabled={simulating}
                data-cursor="Edit Prompt"
                className="w-full h-11 px-4 text-xs rounded-xl border border-white/10 bg-[#0B0E1A] text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FFB454] focus-visible:border-[#FFB454] disabled:opacity-50 font-mono mb-3 shadow-inner"
              />

              {/* Presets */}
              <div className="flex items-center gap-2 overflow-x-auto text-[10px] font-mono text-zinc-400">
                <span className="text-[#8E9BB5]">Presets:</span>
                <button
                  onClick={() => setSimulationPrompt("When a GitHub issue is created, summarize it with AI and send it to Discord.")}
                  className="hover:text-[#FFB454] bg-white/5 hover:bg-[#FFB454]/10 px-2 py-1 rounded border border-white/10 transition-colors shrink-0 cursor-pointer"
                >
                  GitHub → Discord
                </button>
                <button
                  onClick={() => setSimulationPrompt("On Stripe payment received, calculate tax and write transaction to database.")}
                  className="hover:text-[#FFB454] bg-white/5 hover:bg-[#FFB454]/10 px-2 py-1 rounded border border-white/10 transition-colors shrink-0 cursor-pointer"
                >
                  Stripe → Database
                </button>
              </div>
            </div>

            <RippleButton
              variant="signal"
              cursorLabel="Compile"
              onClick={handleSimulate}
              disabled={simulating}
              className="h-11 px-6 font-mono font-extrabold text-xs self-end md:self-auto shrink-0 shadow-md shadow-[#FFB454]/20"
            >
              <Cpu className="h-4 w-4" />
              {simulating ? (
                <span>
                  COMPILING: <DecryptText text="PARSING_AST..." speed={15} />
                </span>
              ) : (
                "Compile Workflow"
              )}
            </RippleButton>
          </div>

          {/* Interactive Canvas Output */}
          <div className="h-72 flex items-center justify-center bg-[#090C16] rounded-xl mt-6 relative overflow-hidden border border-white/5 blueprint-grid">
            {simulationStep === -1 ? (
              <div className="flex flex-col items-center justify-center text-center space-y-3 z-10 text-zinc-500 select-none">
                <GitBranch className="h-10 w-10 text-[#FFB454]/40 animate-pulse" />
                <p className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">Canvas Ready for AST Compile</p>
                <p className="text-[11px] font-mono max-w-[300px] leading-normal text-[#8E9BB5]">
                  Click &quot;Compile Workflow&quot; above to execute the Gemini AST parsing simulation.
                </p>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 z-10 relative w-full justify-center px-6">
                {simulatorNodes.map((node, i) => {
                  const isActive = simulationStep >= i;
                  return (
                    <React.Fragment key={node.id}>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0.25, scale: 0.95 }}
                        transition={{ duration: 0.4 }}
                        className={cn(
                          "w-56 p-4 rounded-xl border transition-all duration-500 flex items-center gap-3.5 backdrop-blur-md bg-[#171E36]",
                          isActive
                            ? "border-[#FFB454]/60 shadow-lg shadow-[#FFB454]/10 ring-1 ring-[#FFB454]/30"
                            : "border-white/5 opacity-30"
                        )}
                      >
                        <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border", node.color)}>
                          {node.icon}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-mono font-bold text-white truncate">{node.label}</h4>
                          <span className="text-[10px] font-mono text-[#8E9BB5] uppercase tracking-wider">{node.type}</span>
                        </div>
                      </motion.div>

                      {i < simulatorNodes.length - 1 && (
                        <div
                          className={cn(
                            "hidden md:block text-zinc-600 font-bold shrink-0 transition-all duration-500",
                            simulationStep > i ? "opacity-100 text-[#FFB454] animate-pulse" : "opacity-20"
                          )}
                        >
                          <ChevronRight className="h-6 w-6" />
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
