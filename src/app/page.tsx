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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import ThreeDBackground from "@/components/ui/ThreeDBackground";

// Interactive Workflow Simulator nodes data
const simulatorNodes = [
  { id: "s1", type: "webhook", label: "Github Webhook Trigger", icon: <Zap className="h-4 w-4" />, color: "text-purple-400" },
  { id: "s2", type: "aiPrompt", label: "Gemini AI Summarizer", icon: <Sparkles className="h-4 w-4" />, color: "text-indigo-400" },
  { id: "s3", type: "notification", label: "Send Discord Message", icon: <MessageSquare className="h-4 w-4" />, color: "text-pink-400" },
];

export default function LandingPage() {
  const router = useRouter();
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
    }, 1500);
  };

  const handleGetStarted = () => {
    router.push("/login");
  };

  return (
    <div className="flex-1 bg-black text-foreground font-sans relative overflow-x-hidden min-h-screen">
      {/* 3D Plexus Particle Starfield constellation background */}
      <ThreeDBackground />

      {/* Background glowing meshes */}
      <div className="absolute top-[-10%] left-[10%] w-[800px] h-[800px] bg-primary/10 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] bg-violet-600/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 canvas-grid opacity-20 pointer-events-none" />

      {/* Floating Header */}
      <header className="sticky top-0 w-full h-16 border-b border-border bg-black/60 backdrop-blur-md z-30 flex items-center justify-between px-6 md:px-12">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-violet-600 shadow shadow-primary/20">
            <Activity className="h-4.5 w-4.5 text-white" />
          </div>
          <span className="font-bold text-base tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            FlowForge AI
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/docs")}
            className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-all"
          >
            Documentation
          </button>
          <Button variant="outline" size="sm" onClick={() => router.push("/login")} className="h-8 text-xs border-border/60">
            Sign In
          </Button>
          <Button variant="primary" size="sm" onClick={handleGetStarted} className="h-8 text-xs font-bold">
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero Presentation */}
      <section className="pt-24 pb-16 px-6 max-w-6xl mx-auto text-center space-y-8 relative">
        {/* Sparkles promo banner */}
        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-primary animate-pulse mx-auto">
          <Sparkles className="h-3.5 w-3.5" />
          Powered by Gemini 1.5 Pro
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.1] bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
          Build Production Automations <br />
          Using Natural Language.
        </h1>

        <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium">
          Describe trigger events and actions in plain English. FlowForge translates instructions into interactive visual canvases, deployable in seconds.
        </p>

        <div className="flex items-center justify-center gap-3.5 pt-2">
          <Button variant="primary" size="lg" onClick={handleGetStarted} className="h-11 px-6 text-sm font-bold flex gap-1.5 shadow shadow-primary/20">
            Launch Console
            <ArrowRight className="h-4.5 w-4.5" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              const element = document.getElementById("sandbox");
              element?.scrollIntoView({ behavior: "smooth" });
            }}
            className="h-11 px-6 text-sm font-semibold border-border/80 hover:bg-white/5"
          >
            View Demo Simulation
          </Button>
        </div>
      </section>

      {/* Interactive Sandbox Simulator block */}
      <section id="sandbox" className="py-16 px-6 max-w-5xl mx-auto space-y-8 relative">
        <div className="text-center space-y-1.5">
          <h2 className="text-xl font-bold tracking-tight text-foreground">Interactive AI Playbox</h2>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            Test the AI translation compiler below to see how FlowForge visualizes custom flows.
          </p>
        </div>

        <Card className="border-border bg-black/60 shadow-2xl glass-panel relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-primary to-violet-500" />
          <CardHeader className="border-b border-border bg-zinc-950/20 py-4 px-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1 max-w-xl">
              <input
                type="text"
                value={simulationPrompt}
                onChange={(e) => setSimulationPrompt(e.target.value)}
                disabled={simulating}
                className="w-full h-10 px-3.5 text-xs rounded-lg border border-input bg-zinc-950/40 text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-primary disabled:opacity-50"
              />
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSimulate}
              isLoading={simulating}
              className="h-10 px-5 shrink-0 flex gap-2 font-bold"
            >
              <Cpu className="h-4 w-4" />
              Simulate AI Build
            </Button>
          </CardHeader>
          <CardContent className="h-72 p-6 flex items-center justify-center bg-zinc-950/15 relative overflow-hidden">
            {/* Visual simulation canvas timeline grid */}
            <div className="absolute inset-0 canvas-grid opacity-15 pointer-events-none" />

            {simulationStep === -1 ? (
              <div className="flex flex-col items-center justify-center text-center space-y-3 z-10 text-muted-foreground select-none">
                <GitBranch className="h-10 w-10 text-muted/40 animate-pulse" />
                <p className="text-xs font-semibold uppercase tracking-wider">Canvas is ready for input</p>
                <p className="text-[10px] max-w-[240px] leading-normal">
                  Write or keep the example prompt above, and click &quot;Simulate AI Build&quot; to run the translation parser.
                </p>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row items-center gap-12 z-10 animate-fade-in relative w-full justify-center">
                {simulatorNodes.map((node, i) => {
                  const isActive = simulationStep >= i;
                  return (
                    <React.Fragment key={node.id}>
                      <div
                        className={cn(
                          "w-52 p-3.5 rounded-xl border bg-card shadow-lg transition-all duration-500 scale-95 flex items-center gap-3.5",
                          isActive
                            ? "border-primary/40 bg-card scale-100 ring-2 ring-primary/10"
                            : "border-border/40 opacity-20"
                        )}
                      >
                        <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-950 border border-border/80", node.color)}>
                          {node.icon}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-[11px] font-bold text-foreground truncate">{node.label}</h4>
                          <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">{node.type}</span>
                        </div>
                      </div>
                      {/* Connection arrows */}
                      {i < simulatorNodes.length - 1 && (
                        <div
                          className={cn(
                            "hidden md:block text-muted-foreground font-bold shrink-0 transition-opacity duration-500",
                            simulationStep > i ? "opacity-100 text-primary animate-pulse" : "opacity-15"
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
          </CardContent>
        </Card>
      </section>

      {/* Feature Grid Panel cards */}
      <section className="py-16 px-6 max-w-6xl mx-auto space-y-12 relative">
        <div className="text-center space-y-1.5">
          <h2 className="text-xl font-bold tracking-tight text-foreground">Premium Engine Features</h2>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            FlowForge AI is built using developer-first production-ready standards.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="glass-panel hover:border-primary/20 transition-all duration-300">
            <CardHeader>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary mb-3">
                <Sparkles className="h-5 w-5" />
              </div>
              <CardTitle className="text-sm font-bold">Structured Gemini Outputs</CardTitle>
              <CardDescription className="text-xs mt-1.5 leading-relaxed">
                Queries Google AI Studio models enforcing exact schema formats, translating prompts directly into builder variables.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="glass-panel hover:border-primary/20 transition-all duration-300">
            <CardHeader>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary mb-3">
                <Layers className="h-5 w-5" />
              </div>
              <CardTitle className="text-sm font-bold">Infinite React Flow Canvas</CardTitle>
              <CardDescription className="text-xs mt-1.5 leading-relaxed">
                Custom drag-and-drop handles, zoom/pan controls, connection monitors, and custom layouts.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="glass-panel hover:border-primary/20 transition-all duration-300">
            <CardHeader>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary mb-3">
                <Clock className="h-5 w-5" />
              </div>
              <CardTitle className="text-sm font-bold">Realtime Run Audit Logs</CardTitle>
              <CardDescription className="text-xs mt-1.5 leading-relaxed">
                Step-by-step diagnostic audits streaming outputs, errors, durations, and variables outputs.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Pricing Matrix Section */}
      <section className="py-16 px-6 max-w-5xl mx-auto space-y-12 relative">
        <div className="text-center space-y-1.5">
          <h2 className="text-xl font-bold tracking-tight text-foreground">Simple Tier Pricing</h2>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            Choose a plan tailored to your team scale.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
          <Card className="glass-panel relative overflow-hidden flex flex-col justify-between">
            <CardHeader>
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Free Sandbox</span>
              <CardTitle className="text-xl font-bold mt-1">Hobby Drafts</CardTitle>
              <div className="text-3xl font-extrabold mt-3 text-foreground">
                $0 <span className="text-xs font-semibold text-muted-foreground">/ forever</span>
              </div>
              <CardDescription className="text-xs mt-3 leading-relaxed">
                Perfect for portfolio validation. Test the builder canvas, AI prompts playground, and simulation logs.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3.5 pt-4">
              <div className="flex items-center gap-2 text-xs">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                <span>3 automation workflows drafts</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                <span>100 AI compilation sandbox steps</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                <span>Basic analytics dashboards</span>
              </div>
            </CardContent>
            <CardFooter className="pt-6">
              <Button variant="outline" className="w-full border-border/80 hover:bg-white/5 text-xs font-semibold h-9" onClick={handleGetStarted}>
                Get Started Free
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-primary/30 bg-primary/5 glass-panel relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 bg-primary/20 text-primary text-[8px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-bl border-l border-b border-primary/20">
              Popular Plan
            </div>
            <CardHeader>
              <span className="text-[10px] text-primary font-bold uppercase tracking-wider">Pro Automation</span>
              <CardTitle className="text-xl font-bold mt-1">Startup Pro</CardTitle>
              <div className="text-3xl font-extrabold mt-3 text-foreground">
                $29 <span className="text-xs font-semibold text-muted-foreground">/ month</span>
              </div>
              <CardDescription className="text-xs mt-3 leading-relaxed">
                For production applications, complete with webhooks endpoints, collaborators, and unlimited logs history.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3.5 pt-4">
              <div className="flex items-center gap-2 text-xs">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                <span>Unlimited workflows & versions</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                <span>10,000 live triggers execution/mo</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                <span>Developer API keys generated lists</span>
              </div>
            </CardContent>
            <CardFooter className="pt-6">
              <Button variant="primary" className="w-full text-xs font-bold h-9" onClick={handleGetStarted}>
                Deploy Pro Instance
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Landing Footer */}
      <footer className="border-t border-border py-12 px-6 text-center text-xs text-muted-foreground select-none relative">
        <p>© 2026 FlowForge AI. Made as a production-grade software engineering flagship project.</p>
        <div className="flex justify-center gap-4 mt-3">
          <button onClick={() => router.push("/docs")} className="hover:text-foreground transition-colors font-semibold">
            API Documentation
          </button>
          <span>•</span>
          <button onClick={() => router.push("/login")} className="hover:text-foreground transition-colors font-semibold">
            Admin Console
          </button>
        </div>
      </footer>
    </div>
  );
}
