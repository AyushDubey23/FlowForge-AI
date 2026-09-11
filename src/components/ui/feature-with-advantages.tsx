import React from "react";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function Feature() {
  const features = [
    {
      title: "Visual Node Canvas",
      description: "Infinite drag-and-drop workspace with real-time port typing and fluid wire routing.",
    },
    {
      title: "Autonomous Agent Loops",
      description: "Prompt-driven synthesis that builds, self-heals, and orchestrates multi-agent tasks.",
    },
    {
      title: "Zero-Config Connectors",
      description: "Turnkey integrations for OpenAI, Anthropic, Firebase, webhooks, and REST APIs.",
    },
    {
      title: "Real-Time Telemetry",
      description: "Live node variable inspection, execution latency tracking, and step-by-step trace replay.",
    },
    {
      title: "Cloud-Native Execution",
      description: "High-throughput serverless runners with automatic retries and state persistence.",
    },
    {
      title: "Enterprise Isolation",
      description: "Military-grade credential encryption, private environment keys, and RBAC governance.",
    },
  ];

  return (
    <div className="w-full py-16 lg:py-0">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex gap-4 py-8 flex-col items-start lg:py-0">
          <div>
            <Badge className="bg-white/10 text-white border-white/20 backdrop-blur-sm px-3 py-1 font-open-sans-custom uppercase text-xs tracking-wider">
              Architecture & Capabilities
            </Badge>
          </div>
          <div className="flex gap-2 flex-col">
            <h2 className="text-3xl md:text-5xl lg:text-6xl tracking-tighter lg:max-w-3xl font-open-sans-custom text-white [text-shadow:_0_4px_20px_rgb(0_0_0_/_60%)]">
              Engineered for Autonomous Execution
            </h2>
            <p className="text-base md:text-lg max-w-2xl leading-relaxed tracking-tight text-gray-300 font-open-sans-custom [text-shadow:_0_2px_10px_rgb(0_0_0_/_50%)]">
              FlowForge AI transforms natural language prompts into interconnected, fault-tolerant workflow pipelines that run reliably in production.
            </p>
          </div>
          <div className="flex gap-10 pt-10 flex-col w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feat, idx) => (
                <div key={idx} className="flex flex-row gap-4 items-start group">
                  <div className="p-1 rounded bg-white/10 border border-white/20 mt-1 shrink-0">
                    <Check className="w-4 h-4 text-white" strokeWidth={3} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-white font-open-sans-custom font-semibold text-base group-hover:text-indigo-200 transition-colors">
                      {feat.title}
                    </p>
                    <p className="text-gray-300 text-sm font-open-sans-custom leading-snug">
                      {feat.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Feature;
