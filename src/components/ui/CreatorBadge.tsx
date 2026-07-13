"use client";

import React, { useState, useEffect } from "react";
import { ExternalLink, X, GraduationCap, Sparkles } from "lucide-react";

export default function CreatorBadge() {
  const [isVisible, setIsVisible] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[9999] animate-in fade-in slide-in-from-bottom-4 duration-300 font-sans">
      <div className="relative flex flex-col gap-2.5 p-4 rounded-xl border border-zinc-800 bg-zinc-950/80 backdrop-blur-md shadow-2xl max-w-[280px]">
        {/* Close Button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-2 right-2 text-zinc-400 hover:text-white p-1 rounded-md hover:bg-zinc-900 transition-colors"
          aria-label="Hide badge"
        >
          <X className="h-3.5 w-3.5" />
        </button>

        {/* Header Profile */}
        <div className="flex items-start gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 text-primary">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold text-zinc-100 flex items-center gap-1">
              Ayush Dubey
              <Sparkles className="h-3 w-3 text-violet-400 fill-violet-400" />
            </h4>
            <p className="text-[10px] text-zinc-400 leading-tight">
              Madan Mohan Malaviya University of Tech
            </p>
          </div>
        </div>

        {/* Portfolio Button Link */}
        <a
          href="https://ayushdubey23.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 w-full rounded-lg bg-zinc-900 border border-zinc-800 py-1.5 px-3 text-[11px] font-bold text-zinc-200 hover:bg-zinc-800 hover:text-white active:scale-[0.98] transition-all"
        >
          <span>View Portfolio</span>
          <ExternalLink className="h-3 w-3 text-zinc-400" />
        </a>
      </div>
    </div>
  );
}
