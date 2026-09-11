"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Check, SparklesIcon } from "lucide-react";
import DotPattern from "@/components/ui/dot-pattern";

type PricingCardProps = {
  titleBadge: string;
  priceLabel: string;
  priceSuffix?: string;
  features: string[];
  cta?: string;
  href?: string;
  className?: string;
  popular?: boolean;
};

function PricingCard({
  titleBadge,
  priceLabel,
  priceSuffix = "/month",
  features,
  cta = "Subscribe",
  href = "/login",
  className,
}: PricingCardProps) {
  return (
    <div
      className={cn(
        "bg-white/5 border-white/10 relative overflow-hidden rounded-xl border-2 backdrop-blur-md flex flex-col justify-between transition-all hover:border-white/20",
        className
      )}
    >
      <DotPattern width={5} height={5} />
      <div>
        <div className="flex items-center gap-3 p-4">
          <Badge
            variant="secondary"
            className="bg-white/10 text-white border-white/20 font-open-sans-custom text-xs uppercase"
          >
            {titleBadge}
          </Badge>
          <div className="ml-auto">
            <Link
              href={href}
              className="inline-flex items-center justify-center rounded-md px-3 py-1.5 text-xs font-semibold bg-white/10 text-white border border-white/20 hover:bg-white/20 font-open-sans-custom transition-all active:scale-95"
            >
              {cta}
            </Link>
          </div>
        </div>

        <div className="flex items-end gap-2 px-4 py-1">
          <span className="font-mono text-3xl md:text-4xl font-semibold tracking-tight text-white [text-shadow:_0_4px_20px_rgb(0_0_0_/_60%)]">
            {priceLabel}
          </span>
          {priceLabel.toLowerCase() !== "free" && priceLabel.toLowerCase() !== "custom" && (
            <span className="text-gray-300 text-xs font-open-sans-custom mb-1">{priceSuffix}</span>
          )}
        </div>

        <ul className="text-gray-300 grid gap-2.5 p-4 text-xs font-open-sans-custom">
          {features.map((f, i) => (
            <li key={i} className="flex items-center gap-2">
              <Check className="w-4 h-4 text-white flex-shrink-0" strokeWidth={3} />
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function BentoPricing() {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-8">
      {/* Featured Pro Card */}
      <div
        className={cn(
          "bg-white/5 border-white/20 relative w-full overflow-hidden rounded-xl border-2 backdrop-blur-md lg:col-span-5 flex flex-col justify-between hover:border-white/30 transition-all shadow-[0_0_40px_rgba(91,77,199,0.15)]"
        )}
      >
        <DotPattern width={5} height={5} />
        <div className="pointer-events-none absolute top-0 left-1/2 -mt-2 -ml-20 h-full w-full [mask-image:linear-gradient(white,transparent)]">
          <div className="from-white/5 to-white/0 absolute inset-0 bg-gradient-to-r [mask-image:radial-gradient(farthest-side_at_top,white,transparent)]">
            <div
              aria-hidden="true"
              className={cn(
                "absolute inset-0 size-full mix-blend-overlay",
                "bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px)]",
                "bg-[size:24px]"
              )}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-3 p-4">
            <Badge
              variant="secondary"
              className="bg-indigo-500/20 text-indigo-200 border-indigo-500/30 font-open-sans-custom text-xs uppercase"
            >
              PRO BUILDER
            </Badge>
            <Badge
              variant="outline"
              className="hidden sm:flex bg-white/10 text-white border-white/20 font-open-sans-custom text-xs"
            >
              <SparklesIcon className="me-1 size-3 text-amber-300" /> Popular
            </Badge>
            <div className="ml-auto">
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-md px-4 py-1.5 text-xs font-bold bg-white text-black hover:bg-gray-200 font-open-sans-custom shadow-md transition-all active:scale-95"
              >
                Start Pro
              </Link>
            </div>
          </div>

          <div className="flex flex-col p-4 lg:flex-row lg:items-center">
            <div className="pb-3 lg:w-[32%]">
              <span className="font-mono text-4xl lg:text-5xl font-semibold tracking-tight text-white [text-shadow:_0_4px_20px_rgb(0_0_0_/_60%)]">
                $20
              </span>
              <span className="text-gray-300 text-xs font-open-sans-custom"> /month</span>
              <p className="text-xs text-gray-400 font-open-sans-custom mt-1">
                For power builders and autonomous agent architects
              </p>
            </div>
            <ul className="text-gray-200 grid gap-2.5 text-xs lg:w-[68%] font-open-sans-custom">
              {[
                "$20 of included monthly AI agent compute credits",
                "Unlimited workflow canvas nodes, loops & branches",
                "High-speed execution with live telemetry and debugger",
                "Export workflows directly to standalone Next.js & Python scripts",
              ].map((f, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" strokeWidth={3} />
                  <span className="leading-relaxed">{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Free Card */}
      <PricingCard
        titleBadge="FREE"
        priceLabel="$0"
        features={[
          "50 free cloud workflow executions / month",
          "Visual drag-and-drop node graph canvas",
          "Standard AI models (Gemini & GPT-4o-mini)",
          "Community automation template library",
        ]}
        className="lg:col-span-3"
        cta="Get Started"
        href="/login"
      />

      {/* Team Card */}
      <PricingCard
        titleBadge="TEAM"
        priceLabel="$30"
        priceSuffix="/user/month"
        features={[
          "$30 included AI credits per seat",
          "Multiplayer real-time canvas collaboration",
          "Shared environment variables and secure secrets vault",
        ]}
        className="lg:col-span-4"
        cta="Try Team"
        href="/login"
      />

      {/* Business Card */}
      <PricingCard
        titleBadge="BUSINESS"
        priceLabel="$100"
        priceSuffix="/user/month"
        features={[
          "$100 included compute credits with auto-bursting queues",
          "Full FlowForge AI REST API & Node Webhook integration",
          "Isolated sandbox execution & audit compliance logs",
        ]}
        className="lg:col-span-4"
        cta="Go Business"
        href="/login"
      />

      {/* Enterprise Card */}
      <PricingCard
        titleBadge="ENTERPRISE"
        priceLabel="Custom"
        priceSuffix=""
        features={[
          "Dedicated VPC / On-Prem deployment options",
          "Custom SAML SSO & role-based governance policies",
          "Dedicated low-latency GPU cluster & 99.99% uptime SLA",
          "Personalized architecture onboarding with Ayush Dubey",
        ]}
        className="lg:col-span-8"
        cta="Contact Ayush"
        href="#contact"
      />
    </div>
  );
}

export default BentoPricing;
