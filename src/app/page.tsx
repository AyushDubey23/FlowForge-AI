"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  GitBranch,
  CheckCircle2,
  Activity,
  Layers,
  Zap,
  Cpu,
  ArrowRight,
  ChevronRight,
  MessageSquare,
  Clock,
  Menu,
  X,
  Terminal,
  ShieldCheck,
  Globe,
  Database,
  Code2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import ThreeDBackground from "@/components/ui/ThreeDBackground";

// Interactive Workflow Simulator nodes data
const simulatorNodes = [
  { id: "s1", type: "webhook", label: "GitHub Webhook Trigger", icon: <Zap className="h-4 w-4" />, color: "text-purple-400" },
  { id: "s2", type: "aiPrompt", label: "Gemini AI Summarizer", icon: <Sparkles className="h-4 w-4" />, color: "text-indigo-400" },
  { id: "s3", type: "notification", label: "Send Discord Message", icon: <MessageSquare className="h-4 w-4" />, color: "text-pink-400" },
];

export default function LandingPage() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [simulationPrompt, setSimulationPrompt] = useState(
    "When a GitHub issue is created, summarize it with AI and send it to Discord."
  );
  const [simulating, setSimulating] = useState(false);
  const [simulationStep, setSimulationStep] = useState<number>(-1); // -1 = idle, 0 = trigger, 1 = AI prompt, 2 = discord, 3 = complete

  const handleSimulate = () => {
    if (simulating) return;
    setSimulating(true);
    setSimulationStep(0);

    const interval = setInterval(() => {
      setSimulationStep((prev) => {
        if (prev >= 2) {
          clearInterval(interval);
          setSimulating(false);
          return 3;
        }
        return prev + 1;
      });
    }, 1200);
  };

  const handleGetStarted = () => {
    router.push("/login");
  };

  return (
    <div className="flex-1 bg-black text-foreground font-sans relative overflow-x-hidden min-h-screen">
      {/* 3D Plexus Particle Starfield constellation background */}
      <ThreeDBackground />

      {/* Background glowing meshes */}
      <div className="absolute top-[-10%] left-[20%] w-[700px] h-[700px] bg-primary/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-5%] w-[600px] h-[600px] bg-violet-600/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 canvas-grid opacity-20 pointer-events-none" />

      {/* Detached Floating Island Navbar (Apple/Linear Tier) */}
      <div className="sticky top-6 z-50 px-4 max-w-5xl mx-auto">
        <header className="glass-panel rounded-full px-6 h-14 flex items-center justify-between border border-white/10 shadow-2xl spring-transition">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-violet-600 shadow shadow-primary/25">
              <Activity className="h-4.5 w-4.5 text-white" />
            </div>
            <span className="font-bold text-base tracking-tight text-white">
              FlowForge AI
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => {
                const element = document.getElementById("features");
                element?.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-xs font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => {
                const element = document.getElementById("sandbox");
                element?.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-xs font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Playground
            </button>
            <button
              onClick={() => {
                const element = document.getElementById("pricing");
                element?.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-xs font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Pricing
            </button>
            <button
              onClick={() => router.push("/docs")}
              className="text-xs font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Docs
            </button>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/login")}
              className="h-8 rounded-full px-4 text-xs font-medium border-white/10 bg-white/5 hover:bg-white/10 text-white"
            >
              Sign In
            </Button>
            <button
              onClick={handleGetStarted}
              className="group h-8 rounded-full bg-primary hover:bg-primary/90 text-white px-3.5 text-xs font-semibold flex items-center gap-2 shadow-lg shadow-primary/25 transition-all active:scale-[0.98]"
            >
              <span>Get Started</span>
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center transition-transform group-hover:translate-x-0.5">
                <ArrowRight className="h-3 w-3 text-white" />
              </div>
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-1.5 rounded-full hover:bg-white/10 text-zinc-300"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </header>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 p-5 rounded-2xl glass-panel border border-white/10 space-y-4 animate-fade-in">
            <div className="flex flex-col gap-3 font-medium text-sm text-zinc-300">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="text-left py-1 hover:text-white"
              >
                Features
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  document.getElementById("sandbox")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="text-left py-1 hover:text-white"
              >
                Playground
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="text-left py-1 hover:text-white"
              >
                Pricing
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  router.push("/docs");
                }}
                className="text-left py-1 hover:text-white"
              >
                Documentation
              </button>
            </div>
            <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
              <Button
                variant="outline"
                onClick={() => router.push("/login")}
                className="w-full justify-center rounded-full text-xs font-semibold"
              >
                Sign In
              </Button>
              <Button
                variant="primary"
                onClick={handleGetStarted}
                className="w-full justify-center rounded-full text-xs font-bold"
              >
                Get Started
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Hero Presentation */}
      <section className="pt-24 pb-24 px-6 max-w-5xl mx-auto text-center space-y-8 relative">
        {/* Micro Eyebrow Tag */}
        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/25 px-4 py-1.5 rounded-full text-[11px] font-medium tracking-wide text-primary shadow-sm mx-auto">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Generative AI Automation Compiler</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.1] text-white">
          Build Production Automations <br />
          Using Natural Language.
        </h1>

        <p className="text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed font-normal">
          Describe trigger events and actions in plain English. FlowForge translates instructions into interactive visual node graphs, deployable in seconds.
        </p>

        {/* Nested Pill CTA Architecture */}
        <div className="flex items-center justify-center gap-4 pt-4">
          <button
            onClick={handleGetStarted}
            className="group h-12 rounded-full bg-primary hover:bg-primary/90 text-white px-7 text-sm font-semibold flex items-center gap-3 shadow-xl shadow-primary/25 transition-all active:scale-[0.98]"
          >
            <span>Launch Console</span>
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center transition-transform group-hover:translate-x-1">
              <ArrowRight className="h-3.5 w-3.5 text-white" />
            </div>
          </button>
          <button
            onClick={() => {
              const element = document.getElementById("sandbox");
              element?.scrollIntoView({ behavior: "smooth" });
            }}
            className="h-12 rounded-full bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white px-6 text-sm font-medium border border-white/10 transition-all active:scale-[0.98]"
          >
            View Demo Simulation
          </button>
        </div>
      </section>

      {/* Interactive Doppelrand Playground Simulator Block */}
      <section id="sandbox" className="py-16 px-6 max-w-5xl mx-auto space-y-8 relative">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-primary font-semibold">
            Interactive Compiler
          </span>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            Natural Language to Visual Nodes
          </h2>
          <p className="text-xs text-zinc-400 max-w-md mx-auto">
            Test the translation engine below to see how FlowForge compiles prompts into React Flow execution graphs.
          </p>
        </div>

        {/* Double-Bezel Hardware Frame */}
        <div className="bezel-shell">
          <div className="bezel-core p-6 relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
              <div className="flex-1 max-w-xl">
                <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-1.5">
                  Natural Language Workflow Prompt
                </label>
                <input
                  type="text"
                  value={simulationPrompt}
                  onChange={(e) => setSimulationPrompt(e.target.value)}
                  disabled={simulating}
                  className="w-full h-11 px-4 text-xs rounded-xl border border-white/10 bg-black/50 text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary disabled:opacity-50 font-mono"
                />
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSimulate}
                isLoading={simulating}
                className="h-11 px-6 rounded-xl shrink-0 flex gap-2 font-bold self-end md:self-auto"
              >
                <Cpu className="h-4 w-4" />
                Compile Workflow
              </Button>
            </div>

            <div className="h-72 flex items-center justify-center bg-black/40 rounded-xl mt-6 relative overflow-hidden border border-white/5">
              <div className="absolute inset-0 canvas-grid opacity-20 pointer-events-none" />

              {simulationStep === -1 ? (
                <div className="flex flex-col items-center justify-center text-center space-y-3 z-10 text-zinc-500 select-none">
                  <GitBranch className="h-10 w-10 text-primary/40 animate-pulse" />
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Canvas Ready for Simulation</p>
                  <p className="text-[11px] max-w-[280px] leading-normal text-zinc-500">
                    Click &quot;Compile Workflow&quot; above to execute the Gemini natural language parse cycle.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row items-center gap-10 z-10 animate-fade-in relative w-full justify-center px-6">
                  {simulatorNodes.map((node, i) => {
                    const isActive = simulationStep >= i;
                    return (
                      <React.Fragment key={node.id}>
                        <div
                          className={cn(
                            "w-56 p-4 rounded-xl border transition-all duration-500 flex items-center gap-3.5 backdrop-blur-md",
                            isActive
                              ? "border-primary/50 bg-white/5 shadow-lg shadow-primary/10 scale-100 ring-1 ring-primary/30"
                              : "border-white/5 bg-white/2 opacity-25 scale-95"
                          )}
                        >
                          <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-black border border-white/10", node.color)}>
                            {node.icon}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-white truncate">{node.label}</h4>
                            <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider">{node.type}</span>
                          </div>
                        </div>
                        {i < simulatorNodes.length - 1 && (
                          <div
                            className={cn(
                              "hidden md:block text-zinc-600 font-bold shrink-0 transition-all duration-500",
                              simulationStep > i ? "opacity-100 text-primary animate-pulse" : "opacity-20"
                            )}
                          >
                            <ChevronRight className="h-6 w-6" />
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Asymmetrical Bento Feature Grid */}
      <section id="features" className="py-24 px-6 max-w-6xl mx-auto space-y-12 relative">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-primary font-semibold">
            Architecture Highlights
          </span>
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-white">
            Engineered for Production Scale
          </h2>
          <p className="text-xs text-zinc-400 max-w-md mx-auto">
            Full-stack developer features designed for speed, safety, and visual clarity.
          </p>
        </div>

        {/* Asymmetrical Masonry Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Card 1 - Main AI Compiler (Col Span 8) */}
          <div className="md:col-span-8 bezel-shell">
            <div className="bezel-core p-8 h-full flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold text-white">Structured Gemini 1.5 Pro Compiler</h3>
                <p className="text-xs text-zinc-400 leading-relaxed max-w-xl">
                  Translates natural language intent into deterministic JSON schema AST representations, ensuring node triggers, LLM prompts, and API Webhooks stay strictly typed.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-black/60 border border-white/10 font-mono text-[11px] text-zinc-300 space-y-1">
                <div className="flex items-center gap-2 text-zinc-500 border-b border-white/5 pb-2 mb-2">
                  <Terminal className="h-3.5 w-3.5 text-primary" />
                  <span>ast_compiler_output.json</span>
                </div>
                <p><span className="text-purple-400">&quot;trigger&quot;</span>: &#123; <span className="text-indigo-400">&quot;type&quot;</span>: <span className="text-emerald-400">&quot;webhook_github&quot;</span> &#125;,</p>
                <p><span className="text-purple-400">&quot;action&quot;</span>: &#123; <span className="text-indigo-400">&quot;model&quot;</span>: <span className="text-emerald-400">&quot;gemini-1.5-pro&quot;</span> &#125;</p>
              </div>
            </div>
          </div>

          {/* Card 2 - React Flow Canvas (Col Span 4) */}
          <div className="md:col-span-4 bezel-shell">
            <div className="bezel-core p-8 h-full flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary">
                  <Layers className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold text-white">React Flow Node Graph</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Infinite drag-and-drop canvas with custom edge routing, zoom controls, and active node status monitors.
                </p>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 text-xs font-medium text-white">
                <Code2 className="h-4 w-4 text-primary shrink-0" />
                <span>Zero canvas lag under heavy node graphs</span>
              </div>
            </div>
          </div>

          {/* Card 3 - Execution Audit Logs (Col Span 4) */}
          <div className="md:col-span-4 bezel-shell">
            <div className="bezel-core p-8 h-full flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary">
                  <Clock className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold text-white">Realtime Telemetry</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Stream run execution logs, node durations, error stack traces, and output payloads live.
                </p>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono p-3 rounded-xl bg-black/60 border border-white/5">
                <span className="text-emerald-400 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  Status 200 OK
                </span>
                <span className="text-zinc-500">142ms</span>
              </div>
            </div>
          </div>

          {/* Card 4 - Secure Firebase Infrastructure (Col Span 8) */}
          <div className="md:col-span-8 bezel-shell">
            <div className="bezel-core p-8 h-full flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold text-white">Firebase & Cloud Security</h3>
                <p className="text-xs text-zinc-400 leading-relaxed max-w-xl">
                  Built-in Google authentication, Firestore real-time state synchronization, encrypted environment API keys, and workspace permission boundaries.
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-[11px] font-mono text-zinc-300 flex items-center gap-2">
                  <Database className="h-3.5 w-3.5 text-primary" />
                  <span>Firestore Sync</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-[11px] font-mono text-zinc-300 flex items-center gap-2">
                  <Globe className="h-3.5 w-3.5 text-primary" />
                  <span>REST Webhooks</span>
                </div>
                <div className="col-span-2 md:col-span-1 p-3 rounded-xl bg-white/5 border border-white/10 text-[11px] font-mono text-zinc-300 flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                  <span>AES Key Store</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Matrix Section */}
      <section id="pricing" className="py-24 px-6 max-w-5xl mx-auto space-y-12 relative">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-primary font-semibold">
            Simple Plans
          </span>
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-white">
            Transparent Tier Pricing
          </h2>
          <p className="text-xs text-zinc-400 max-w-md mx-auto">
            Scale from prototype workflow drafts to enterprise automation pipelines.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          {/* Free Tier */}
          <div className="bezel-shell">
            <div className="bezel-core p-8 h-full flex flex-col justify-between space-y-8">
              <div className="space-y-4">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold">
                  Developer Sandbox
                </span>
                <h3 className="text-2xl font-bold text-white">Free Plan</h3>
                <div className="text-4xl font-extrabold text-white">
                  $0 <span className="text-xs font-normal text-zinc-400">/ forever</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Ideal for personal experimentation, node graph building, and AI compilation testing.
                </p>
                <div className="space-y-3 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2.5 text-xs text-zinc-300">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    <span>3 active visual automation workflows</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-zinc-300">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    <span>100 AI natural language parses / mo</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-zinc-300">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    <span>Basic telemetry & execution logs</span>
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full rounded-xl border-white/10 hover:bg-white/10 text-white font-semibold text-xs h-11"
                onClick={handleGetStarted}
              >
                Get Started Free
              </Button>
            </div>
          </div>

          {/* Pro Tier */}
          <div className="bezel-shell border-primary/40 shadow-xl shadow-primary/10">
            <div className="bezel-core p-8 h-full flex flex-col justify-between space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-primary text-white text-[9px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-bl-xl">
                Recommended
              </div>
              <div className="space-y-4">
                <span className="text-[10px] font-mono uppercase tracking-wider text-primary font-bold">
                  Production Suite
                </span>
                <h3 className="text-2xl font-bold text-white">Startup Pro</h3>
                <div className="text-4xl font-extrabold text-white">
                  $29 <span className="text-xs font-normal text-zinc-400">/ month</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  For engineering teams running production triggers, live webhooks, and AI pipelines.
                </p>
                <div className="space-y-3 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2.5 text-xs text-zinc-200">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    <span>Unlimited workflows & canvas node graphs</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-zinc-200">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    <span>10,000 live trigger executions / mo</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-zinc-200">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    <span>Encrypted REST API keys & Webhook endpoints</span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleGetStarted}
                className="group w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/25 transition-all active:scale-[0.98]"
              >
                <span>Deploy Pro Workspace</span>
                <ArrowRight className="h-4 w-4 text-white transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Landing Footer */}
      <footer className="border-t border-white/10 py-12 px-6 text-center text-xs text-zinc-500 select-none relative">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            <span className="font-bold text-white">FlowForge AI</span>
            <span>— Advanced Visual Automation</span>
          </div>
          <div className="flex items-center gap-6 text-zinc-400 font-medium">
            <button onClick={() => router.push("/docs")} className="hover:text-white transition-colors">
              Documentation
            </button>
            <button onClick={() => router.push("/login")} className="hover:text-white transition-colors">
              Console Sign In
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
