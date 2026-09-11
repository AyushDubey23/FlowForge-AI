import React from "react";
import { LiquidMetalBackground } from "@/components/liquid-metal-background";
import { FloatingNavbar } from "@/components/floating-navbar";
import { BentoPricing } from "@/components/ui/bento-pricing";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "FlowForge AI | Plans & Compute Pricing",
  description: "Flexible pricing tiers for builders, startups, and enterprise teams running autonomous AI workflows.",
};

export default function PricingPage() {
  return (
    <main className="relative min-h-screen">
      <LiquidMetalBackground />

      <div className="fixed inset-0 z-[5] bg-black/50 pointer-events-none" />

      {/* Dots pattern overlay */}
      <div
        aria-hidden="true"
        className={cn(
          "fixed inset-0 z-[6] size-full pointer-events-none",
          "bg-[radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)]",
          "bg-[size:12px_12px]",
          "opacity-30"
        )}
      />

      <FloatingNavbar />

      {/* Pricing Section */}
      <section className="relative z-10 flex min-h-screen items-center px-4 py-28">
        <div className="mx-auto w-full max-w-5xl">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl text-white [text-shadow:_0_4px_20px_rgb(0_0_0_/_60%)] font-open-sans-custom">
              Plans & Pricing
            </h1>
            <p className="text-gray-300 mt-4 text-sm md:text-base font-open-sans-custom [text-shadow:_0_2px_10px_rgb(0_0_0_/_50%)]">
              Choose the perfect tier for your workflow needs. Transparent compute pricing, unlimited canvas nodes, and direct code export.
            </p>
          </div>
          <BentoPricing />
        </div>
      </section>
    </main>
  );
}
