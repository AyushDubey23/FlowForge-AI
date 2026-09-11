"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { Sparkles, ArrowRight, Layers } from "lucide-react";

export function FloatingNavbar() {
  const router = useRouter();
  const pathname = usePathname();

  const scrollToSection = (sectionId: string) => {
    if (pathname !== "/") {
      router.push(`/#${sectionId}`);
      return;
    }
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
    }
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-50 px-4 py-4 pointer-events-none">
      <div className="mx-auto max-w-7xl rounded-2xl border-2 border-white/10 bg-black/40 px-5 py-3 backdrop-blur-md shadow-2xl pointer-events-auto transition-all">
        <div className="flex items-center justify-between gap-4">
          {/* FlowForge AI Logo */}
          <button
            onClick={() => scrollToSection("home")}
            className="flex items-center gap-2.5 cursor-pointer group text-left"
          >
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl overflow-hidden shadow-[0_0_15px_rgba(99,102,241,0.5)] border border-white/20 group-hover:scale-105 transition-transform duration-300">
              <Image
                src="/icon.png"
                alt="FlowForge AI"
                width={36}
                height={36}
                className="h-full w-full object-cover"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold tracking-tight text-white font-open-sans-custom [text-shadow:_0_2px_8px_rgb(0_0_0_/_60%)] flex items-center gap-1">
                FlowForge<span className="text-indigo-400">AI</span>
              </span>
              <span className="text-[10px] text-gray-400 font-open-sans-custom tracking-wider uppercase font-medium">
                by Ayush Dubey
              </span>
            </div>
          </button>

          {/* Navigation Links */}
          <nav className="hidden items-center gap-7 md:flex">
            <button
              onClick={() => scrollToSection("features")}
              className="text-xs uppercase tracking-wider font-semibold font-open-sans-custom text-gray-300 transition-colors hover:text-white [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)] cursor-pointer"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("pricing")}
              className="text-xs uppercase tracking-wider font-semibold font-open-sans-custom text-gray-300 transition-colors hover:text-white [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)] cursor-pointer"
            >
              Pricing
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="text-xs uppercase tracking-wider font-semibold font-open-sans-custom text-gray-300 transition-colors hover:text-white [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)] cursor-pointer"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-xs uppercase tracking-wider font-semibold font-open-sans-custom text-gray-300 transition-colors hover:text-white [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)] cursor-pointer"
            >
              Contact
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden sm:inline-flex text-xs font-semibold text-gray-300 hover:text-white px-3 py-1.5 transition-colors font-open-sans-custom"
            >
              Sign In
            </Link>

            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-xs font-bold text-black hover:bg-gray-200 transition-all font-open-sans-custom shadow-md active:scale-95 [text-shadow:_0_1px_2px_rgb(0_0_0_/_10%)]"
            >
              <span>Get Started</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default FloatingNavbar;
