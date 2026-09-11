"use client";

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { LiquidMetalBackground } from "@/components/liquid-metal-background";
import { FloatingNavbar } from "@/components/floating-navbar";
import { ShinyButton } from "@/components/ui/shiny-button";
import { Feature } from "@/components/ui/feature-with-advantages";
import { BentoPricing } from "@/components/ui/bento-pricing";
import { ContactCard } from "@/components/ui/contact-card";
import { AboutQuote } from "@/components/ui/about-quote";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const pricingSectionRef = useRef<HTMLDivElement>(null);
  const aboutSectionRef = useRef<HTMLDivElement>(null);
  const contactSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleWheel = (e: WheelEvent) => {
      const delta = e.deltaY;
      const currentScroll = scrollContainer.scrollLeft;
      const containerWidth = scrollContainer.offsetWidth;
      const currentSection = Math.round(currentScroll / containerWidth);

      // Section 2: Pricing vertical scroll coordination
      if (currentSection === 2 && pricingSectionRef.current) {
        const pricingSection = pricingSectionRef.current;
        const isAtTop = pricingSection.scrollTop <= 2;
        const isAtBottom =
          pricingSection.scrollTop + pricingSection.clientHeight >=
          pricingSection.scrollHeight - 4;

        if (delta > 0 && !isAtBottom) return;
        if (delta < 0 && !isAtTop) return;

        if (delta < 0 && isAtTop) {
          e.preventDefault();
          scrollContainer.scrollTo({
            left: 1 * containerWidth,
            behavior: "smooth",
          });
          return;
        }

        if (delta > 0 && isAtBottom) {
          e.preventDefault();
          scrollContainer.scrollTo({
            left: 3 * containerWidth,
            behavior: "smooth",
          });
          return;
        }
      }

      // Section 3: About vertical scroll coordination
      if (currentSection === 3 && aboutSectionRef.current) {
        const aboutSection = aboutSectionRef.current;
        const isAtTop = aboutSection.scrollTop <= 2;
        const isAtBottom =
          aboutSection.scrollTop + aboutSection.clientHeight >=
          aboutSection.scrollHeight - 4;

        if (delta > 0 && !isAtBottom) return;
        if (delta < 0 && !isAtTop) return;

        if (delta < 0 && isAtTop) {
          e.preventDefault();
          scrollContainer.scrollTo({
            left: 2 * containerWidth,
            behavior: "smooth",
          });
          return;
        }

        if (delta > 0 && isAtBottom) {
          e.preventDefault();
          scrollContainer.scrollTo({
            left: 4 * containerWidth,
            behavior: "smooth",
          });
          return;
        }
      }

      // Section 4: Contact vertical scroll coordination
      if (currentSection === 4 && contactSectionRef.current) {
        const contactSection = contactSectionRef.current;
        const isAtTop = contactSection.scrollTop <= 2;
        const isAtBottom =
          contactSection.scrollTop + contactSection.clientHeight >=
          contactSection.scrollHeight - 4;

        if (delta > 0 && !isAtBottom) return;
        if (delta < 0 && !isAtTop) return;

        if (delta < 0 && isAtTop) {
          e.preventDefault();
          scrollContainer.scrollTo({
            left: 3 * containerWidth,
            behavior: "smooth",
          });
          return;
        }

        if (delta > 0 && isAtBottom) {
          e.preventDefault();
          return;
        }
      }

      e.preventDefault();

      if (Math.abs(delta) > 10) {
        let targetSection = currentSection;
        if (delta > 0) {
          targetSection = Math.min(currentSection + 1, 4);
        } else {
          targetSection = Math.max(currentSection - 1, 0);
        }

        scrollContainer.scrollTo({
          left: targetSection * containerWidth,
          behavior: "smooth",
        });
      }
    };

    scrollContainer.addEventListener("wheel", handleWheel, { passive: false });
    return () => scrollContainer.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <main className="relative h-screen overflow-hidden">
      {/* Background Liquid Metal WebGL Canvas */}
      <LiquidMetalBackground />

      {/* Dimming Mask Backdrop */}
      <div className="fixed inset-0 z-[5] bg-black/50 pointer-events-none" />

      {/* Top Floating Glass Navigation */}
      <FloatingNavbar />

      {/* Horizontal Snap Scroll Canvas */}
      <div
        ref={scrollContainerRef}
        className="relative z-10 flex h-screen w-full overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory no-scrollbar"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/* Section 0: Home Hero */}
        <section
          id="home"
          className="flex min-w-full snap-start items-center justify-center px-4 py-20"
        >
          <div className="mx-auto max-w-4xl">
            <div className="text-center px-2">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold uppercase tracking-wider text-indigo-200 mb-6 backdrop-blur-sm shadow-[0_0_15px_rgba(99,102,241,0.25)]">
                <div className="relative flex h-5 w-5 shrink-0 items-center justify-center rounded-full overflow-hidden border border-white/20 shadow-sm">
                  <Image
                    src="/icon.png"
                    alt="FlowForge"
                    width={20}
                    height={20}
                    className="h-full w-full object-cover"
                  />
                </div>
                <span>Next-Gen Autonomous Workflow Engine</span>
              </div>

              <h1 className="mb-6 text-balance text-5xl tracking-tight text-white [text-shadow:_0_4px_20px_rgb(0_0_0_/_60%)] md:text-7xl lg:text-8xl font-open-sans-custom font-extrabold">
                <span className="font-open-sans-custom not-italic">Ideate.</span>{" "}
                <span className="font-serif-custom italic font-normal text-indigo-300">Prompt.</span>{" "}
                <span className="font-open-sans-custom not-italic">Build.</span>
              </h1>

              <p className="mb-8 mx-auto max-w-2xl text-pretty leading-relaxed text-gray-300 [text-shadow:_0_2px_10px_rgb(0_0_0_/_50%)] font-normal font-open-sans-custom tracking-wide text-base md:text-xl">
                Whether you are a developer, an engineer, or a creator, take an automation idea,{" "}
                <span className="font-serif-custom italic text-white font-medium">prompt</span> it, and watch FlowForge AI synthesize intelligent, production-ready node pipelines.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <ShinyButton
                  onClick={() => router.push("/login")}
                  className="px-8 py-3.5 text-sm"
                >
                  Start Building Free
                </ShinyButton>

                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 backdrop-blur-sm text-xs font-bold text-white uppercase tracking-wider transition-all active:scale-95 font-open-sans-custom"
                >
                  <span>Open Console</span>
                  <ArrowRight className="w-4 h-4 text-indigo-300" />
                </Link>
              </div>

              <p className="mt-8 text-[11px] text-gray-400 font-open-sans-custom tracking-wider uppercase">
                Engineered with precision by <span className="text-white font-bold">Ayush Dubey</span>
              </p>
            </div>
          </div>
        </section>

        {/* Section 1: Features */}
        <section
          id="features"
          className="flex min-w-full snap-start items-center justify-center px-4 py-20"
        >
          <div className="mx-auto max-w-7xl w-full">
            <Feature />
          </div>
        </section>

        {/* Section 2: Pricing */}
        <section
          id="pricing"
          ref={pricingSectionRef}
          className="relative min-w-full snap-start overflow-y-auto px-4 pt-24 pb-20 no-scrollbar"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div
            aria-hidden="true"
            className={cn(
              "absolute inset-0 z-0 size-full pointer-events-none",
              "bg-[radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)]",
              "bg-[size:12px_12px]",
              "opacity-30"
            )}
          />

          <div className="relative z-10 mx-auto w-full max-w-5xl">
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl text-white [text-shadow:_0_4px_20px_rgb(0_0_0_/_60%)] font-open-sans-custom">
                Plans & Compute Pricing
              </h1>
              <p className="text-gray-300 mt-4 text-sm md:text-base font-open-sans-custom [text-shadow:_0_2px_10px_rgb(0_0_0_/_50%)]">
                Transparent options from individual builders to scaling enterprise fleets. Every plan includes access to FlowForge AI visual workflow orchestration.
              </p>
            </div>
            <BentoPricing />
          </div>
        </section>

        {/* Section 3: About */}
        <section
          id="about"
          ref={aboutSectionRef}
          className="relative min-w-full snap-start overflow-y-auto px-4 pt-24 pb-20 no-scrollbar"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div
            aria-hidden="true"
            className={cn(
              "absolute inset-0 z-0 size-full pointer-events-none",
              "bg-[radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)]",
              "bg-[size:12px_12px]",
              "opacity-30"
            )}
          />

          <div className="relative z-10 mx-auto w-full max-w-6xl">
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl text-white [text-shadow:_0_4px_20px_rgb(0_0_0_/_60%)] font-open-sans-custom">
                About FlowForge AI
              </h1>
              <p className="text-gray-300 mt-4 text-sm md:text-base font-open-sans-custom [text-shadow:_0_2px_10px_rgb(0_0_0_/_50%)]">
                The architecture, mission, and engineer behind the next generation of visual AI workflow tools.
              </p>
            </div>
            <AboutQuote />
          </div>
        </section>

        {/* Section 4: Contact */}
        <section
          id="contact"
          ref={contactSectionRef}
          className="relative min-w-full snap-start overflow-y-auto px-4 pt-24 pb-20 no-scrollbar"
        >
          <div
            aria-hidden="true"
            className={cn(
              "absolute inset-0 z-0 size-full pointer-events-none",
              "bg-[radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)]",
              "bg-[size:12px_12px]",
              "opacity-30"
            )}
          />

          <div className="relative z-10 mx-auto w-full max-w-5xl mt-6 lg:mt-12">
            <ContactCard />
          </div>
        </section>
      </div>
    </main>
  );
}
