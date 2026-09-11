"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Activity, ArrowRight, Menu, X } from "lucide-react";
import RippleButton from "./RippleButton";

export default function Navbar() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="sticky top-6 z-40 px-4 max-w-5xl mx-auto">
      <header className="glass-panel rounded-2xl px-6 h-14 flex items-center justify-between border border-[#D6E2FF]/10 shadow-2xl transition-all duration-300">
        {/* Live Diagram Node Logo */}
        <div
          onClick={() => router.push("/")}
          data-cursor="FlowForge"
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-[#1E2640] border border-[#FFB454]/40 group-hover:border-[#FFB454] transition-colors">
            <Activity className="h-4 w-4 text-[#FFB454] group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6EE7B7] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#6EE7B7]"></span>
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-mono font-extrabold text-sm tracking-tight text-[var(--ink)]">
              FLOWFORGE<span className="text-[#FFB454]">.AI</span>
            </span>
            <span className="text-[9px] font-mono tracking-widest text-[#8E9BB5] uppercase -mt-0.5">
              COMPILER v2.4
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 font-mono text-xs text-[#8E9BB5]">
          <button
            onClick={() => scrollToSection("hero")}
            data-cursor="Scroll"
            className="hover:text-[var(--ink)] transition-colors py-1 cursor-pointer"
          >
            01//Compiler
          </button>
          <button
            onClick={() => scrollToSection("sandbox")}
            data-cursor="Try Demo"
            className="hover:text-[var(--ink)] transition-colors py-1 cursor-pointer"
          >
            02//Playground
          </button>
          <button
            onClick={() => scrollToSection("features")}
            data-cursor="Specs"
            className="hover:text-[var(--ink)] transition-colors py-1 cursor-pointer"
          >
            03//Architecture
          </button>
          <button
            onClick={() => scrollToSection("pricing")}
            data-cursor="Plans"
            className="hover:text-[var(--ink)] transition-colors py-1 cursor-pointer"
          >
            04//Pricing
          </button>
          <button
            onClick={() => router.push("/docs")}
            data-cursor="Docs"
            className="hover:text-[var(--ink)] transition-colors py-1 cursor-pointer"
          >
            05//Docs
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => router.push("/login")}
            data-cursor="Console"
            className="h-8 px-4 text-xs font-mono font-medium rounded-lg text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          >
            Sign In
          </button>
          <RippleButton
            variant="signal"
            cursorLabel="Get Started"
            onClick={() => router.push("/login")}
            className="h-8 px-4 text-xs font-mono font-extrabold"
          >
            <span>Get Started</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </RippleButton>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="md:hidden p-2 rounded-lg hover:bg-white/10 text-zinc-300"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 p-5 rounded-2xl glass-panel border border-[#D6E2FF]/10 space-y-4 font-mono animate-fade-in shadow-xl">
          <div className="flex flex-col gap-3 text-xs text-[#8E9BB5]">
            <button onClick={() => scrollToSection("hero")} className="text-left py-1 hover:text-white">
              01//Compiler
            </button>
            <button onClick={() => scrollToSection("sandbox")} className="text-left py-1 hover:text-white">
              02//Playground
            </button>
            <button onClick={() => scrollToSection("features")} className="text-left py-1 hover:text-white">
              03//Architecture
            </button>
            <button onClick={() => scrollToSection("pricing")} className="text-left py-1 hover:text-white">
              04//Pricing
            </button>
            <button onClick={() => router.push("/docs")} className="text-left py-1 hover:text-white">
              05//Docs
            </button>
          </div>
          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            <button
              onClick={() => router.push("/login")}
              className="w-full py-2 text-center text-xs rounded-xl bg-white/5 border border-white/10 text-white font-mono"
            >
              Sign In
            </button>
            <RippleButton
              variant="signal"
              onClick={() => router.push("/login")}
              className="w-full h-10 text-xs font-mono font-bold"
            >
              Get Started
            </RippleButton>
          </div>
        </div>
      )}
    </div>
  );
}
