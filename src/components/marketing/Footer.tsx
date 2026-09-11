"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Footer() {
  const router = useRouter();

  return (
    <footer className="border-t border-white/10 py-12 px-6 text-xs text-[#8E9BB5] font-mono select-none relative bg-[#0B0E1A]">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg overflow-hidden border border-white/20 shadow-[0_0_12px_rgba(99,102,241,0.3)]">
            <Image
              src="/icon.png"
              alt="FlowForge AI"
              width={28}
              height={28}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <span className="font-extrabold text-white tracking-tight">FLOWFORGE.AI</span>
            <span className="text-[10px] text-[#8E9BB5] ml-2">— Visual Automation Compiler</span>
          </div>
        </div>

        <div className="flex items-center gap-6 text-[#8E9BB5]">
          <button
            onClick={() => router.push("/docs")}
            data-cursor="Docs"
            className="hover:text-white transition-colors cursor-pointer"
          >
            Documentation
          </button>
          <button
            onClick={() => router.push("/login")}
            data-cursor="Sign In"
            className="hover:text-white transition-colors cursor-pointer"
          >
            Console Sign In
          </button>
        </div>
      </div>
    </footer>
  );
}
