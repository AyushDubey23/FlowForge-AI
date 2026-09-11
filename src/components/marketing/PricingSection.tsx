"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ChevronDown, ArrowRight } from "lucide-react";
import CountingNumber from "./CountingNumber";
import RippleButton from "./RippleButton";

const faqs = [
  {
    q: "How does natural language AST compilation work?",
    a: "FlowForge uses Google Gemini API to parse natural language prompts into a structured JSON schema AST representation, which maps directly into React Flow canvas nodes and execution edges.",
  },
  {
    q: "Can I self-host or export my workflow logic?",
    a: "Yes. Every compiled workflow can be exported as raw JSON schema or executed directly via REST webhook endpoints.",
  },
  {
    q: "What happens when I hit the 100 parse limit on Free?",
    a: "Your existing visual workflow graphs continue running without interruption. You can upgrade to Startup Pro anytime for unlimited parses and live executions.",
  },
];

export default function PricingSection() {
  const router = useRouter();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <section id="pricing" className="py-20 px-6 max-w-5xl mx-auto space-y-16 relative">
      <div className="text-center space-y-2">
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#FFB454] font-bold">
          04 // TRANSPARENT TIERS
        </span>
        <h2 className="text-2xl md:text-4xl font-mono font-bold tracking-tight text-[var(--ink)]">
          Simple Workspace Plans
        </h2>
        <p className="text-xs text-[#8E9BB5] max-w-md mx-auto">
          Scale from prototype workflow drafts to enterprise automation pipelines.
        </p>
      </div>

      {/* Pricing Tier Grid */}
      <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
        {/* Free Tier */}
        <div className="bezel-shell">
          <div className="bezel-core p-8 h-full flex flex-col justify-between space-y-8 bg-[#12172A] border border-[#D6E2FF]/10">
            <div className="space-y-4 font-mono">
              <span className="text-[10px] uppercase tracking-wider text-[#8E9BB5] font-bold">
                DEVELOPER_SANDBOX
              </span>
              <h3 className="text-2xl font-bold text-white font-mono">Free Sandbox</h3>
              <div className="text-4xl font-extrabold text-white">
                $<CountingNumber value={0} /> <span className="text-xs font-normal text-[#8E9BB5]">/ forever</span>
              </div>
              <p className="text-xs font-sans text-[#8E9BB5] leading-relaxed">
                Ideal for personal experimentation, node graph building, and AI compilation testing.
              </p>
              <div className="space-y-3 pt-4 border-t border-white/10 font-mono">
                <div className="flex items-center gap-2.5 text-xs text-zinc-300">
                  <CheckCircle2 className="h-4 w-4 text-[#FFB454] shrink-0" />
                  <span>3 active visual automation workflows</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-zinc-300">
                  <CheckCircle2 className="h-4 w-4 text-[#FFB454] shrink-0" />
                  <span>
                    <CountingNumber value={100} /> AI natural language parses / mo
                  </span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-zinc-300">
                  <CheckCircle2 className="h-4 w-4 text-[#FFB454] shrink-0" />
                  <span>Basic telemetry & execution logs</span>
                </div>
              </div>
            </div>

            <RippleButton
              variant="outline"
              cursorLabel="Start Free"
              onClick={() => router.push("/login")}
              className="w-full h-11 font-mono font-bold"
            >
              Get Started Free
            </RippleButton>
          </div>
        </div>

        {/* Startup Pro Tier */}
        <div className="bezel-shell border-[#FFB454]/40 shadow-xl shadow-[#FFB454]/10">
          <div className="bezel-core p-8 h-full flex flex-col justify-between space-y-8 relative overflow-hidden bg-[#12172A] border border-[#FFB454]/30">
            <div className="absolute top-0 right-0 bg-[#FFB454] text-black text-[9px] font-mono font-extrabold uppercase tracking-wider px-3.5 py-1 rounded-bl-xl shadow-md">
              RECOMMENDED_TIER
            </div>

            <div className="space-y-4 font-mono">
              <span className="text-[10px] uppercase tracking-wider text-[#FFB454] font-bold">
                PRODUCTION_SUITE
              </span>
              <h3 className="text-2xl font-bold text-white">Startup Pro</h3>
              <div className="text-4xl font-extrabold text-white">
                $<CountingNumber value={29} /> <span className="text-xs font-normal text-[#8E9BB5]">/ month</span>
              </div>
              <p className="text-xs font-sans text-[#8E9BB5] leading-relaxed">
                For engineering teams running production triggers, live webhooks, and AI pipelines.
              </p>

              <div className="space-y-3 pt-4 border-t border-white/10 font-mono">
                <div className="flex items-center gap-2.5 text-xs text-zinc-200">
                  <CheckCircle2 className="h-4 w-4 text-[#FFB454] shrink-0" />
                  <span>Unlimited workflows & canvas node graphs</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-zinc-200">
                  <CheckCircle2 className="h-4 w-4 text-[#FFB454] shrink-0" />
                  <span>
                    <CountingNumber value={10000} /> live trigger executions / mo
                  </span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-zinc-200">
                  <CheckCircle2 className="h-4 w-4 text-[#FFB454] shrink-0" />
                  <span>Encrypted REST API keys & Webhook endpoints</span>
                </div>
              </div>
            </div>

            <RippleButton
              variant="signal"
              cursorLabel="Deploy Pro"
              onClick={() => router.push("/login")}
              className="w-full h-11 font-mono font-extrabold text-xs shadow-lg shadow-[#FFB454]/20"
            >
              <span>Deploy Pro Workspace</span>
              <ArrowRight className="h-4 w-4" />
            </RippleButton>
          </div>
        </div>
      </div>

      {/* Animated FAQ Accordion */}
      <div className="max-w-2xl mx-auto pt-8 space-y-4">
        <h3 className="text-center text-xs font-mono font-bold text-[#8E9BB5] uppercase tracking-widest">
          FREQUENTLY_ASKED_QUESTIONS
        </h3>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = expandedFaq === index;
            return (
              <div key={index} className="rounded-xl border border-white/10 bg-[#0F1424] overflow-hidden">
                <button
                  onClick={() => toggleFaq(index)}
                  data-cursor="Toggle FAQ"
                  className="w-full p-4 text-left flex items-center justify-between font-mono text-xs text-white hover:text-[#FFB454] transition-colors cursor-pointer"
                >
                  <span className="font-bold">{faq.q}</span>
                  <ChevronDown className={`h-4 w-4 text-[#FFB454] transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-4 pb-4 text-xs font-sans text-[#8E9BB5] leading-relaxed border-t border-white/5 pt-3"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
