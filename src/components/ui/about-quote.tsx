"use client";

import React from "react";
import DotPattern from "@/components/ui/dot-pattern";
import { ExternalLink, Sparkles, GraduationCap, Code2 } from "lucide-react";

export function AboutQuote() {
  return (
    <div className="mx-auto mb-10 max-w-6xl px-4 md:mb-16">
      <div className="relative flex flex-col items-center border-2 border-white/20 rounded-2xl backdrop-blur-md bg-white/5 shadow-2xl overflow-hidden p-6 md:p-12">
        <DotPattern width={6} height={6} />

        {/* Corner decorations */}
        <div className="absolute -left-1.5 -top-1.5 h-3.5 w-3.5 bg-white/90 shadow-sm" />
        <div className="absolute -bottom-1.5 -left-1.5 h-3.5 w-3.5 bg-white/90 shadow-sm" />
        <div className="absolute -right-1.5 -top-1.5 h-3.5 w-3.5 bg-white/90 shadow-sm" />
        <div className="absolute -bottom-1.5 -right-1.5 h-3.5 w-3.5 bg-white/90 shadow-sm" />

        <div className="relative z-20 mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold uppercase tracking-wider text-indigo-200 mb-6 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span>The Vision Behind FlowForge AI</span>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white [text-shadow:_0_4px_20px_rgb(0_0_0_/_60%)] mb-6 font-open-sans-custom">
            Crafted for the Future of Automation
          </h1>

          <div className="space-y-4 md:space-y-6 text-gray-200 [text-shadow:_0_2px_10px_rgb(0_0_0_/_50%)] font-open-sans-custom leading-relaxed text-sm md:text-lg">
            <p>
              FlowForge AI was created and engineered by{" "}
              <span className="text-white font-bold underline decoration-indigo-400 decoration-2 underline-offset-4">
                Ayush Dubey
              </span>
              . The vision is simple: turn complex asynchronous pipelines, autonomous AI models, and cloud services into intuitive visual canvases that anyone can orchestrate with natural language.
            </p>
            <p className="text-gray-300 text-xs md:text-base">
              From prompt-driven node generation to real-time live execution telemetry, FlowForge eliminates fragile glue code and empowers developers, engineers, and creators to build production-grade workflows in minutes.
            </p>
          </div>

          {/* Ayush Dubey Profile Card */}
          <div className="mt-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-xl mx-auto">
            <div className="flex items-center gap-3 text-left">
              <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white shrink-0">
                <Code2 className="w-5 h-5 text-indigo-300" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white font-open-sans-custom flex items-center gap-1.5">
                  Ayush Dubey
                  <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-200 border border-indigo-500/30">
                    Lead Creator
                  </span>
                </h4>
                <p className="text-xs text-gray-400 font-open-sans-custom flex items-center gap-1">
                  <GraduationCap className="w-3 h-3 text-gray-400" />
                  Madan Mohan Malaviya University of Tech
                </p>
              </div>
            </div>

            <a
              href="https://ayushdubey23.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-xs font-semibold text-white hover:bg-white/20 hover:scale-[1.02] transition-all font-open-sans-custom"
            >
              <span>Explore Portfolio</span>
              <ExternalLink className="w-3.5 h-3.5 text-gray-300" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutQuote;
