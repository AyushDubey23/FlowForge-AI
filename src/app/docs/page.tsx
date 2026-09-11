"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  BookOpen,
  ArrowLeft,
  Database,
  Shield,
  Cpu,
  Terminal,
  Server,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ChapterId = "arch" | "db" | "security" | "api" | "ai" | "deploy";

interface Chapter {
  id: ChapterId;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

export default function DocsPage() {
  const router = useRouter();
  const [activeChapter, setActiveChapter] = useState<ChapterId>("arch");

  const chapters: Chapter[] = [
    {
      id: "arch",
      title: "System Architecture",
      icon: <Server className="h-4 w-4 shrink-0" />,
      content: (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-foreground">1. System Architecture</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            FlowForge AI is built using a modern decoupled serverless architecture. Next.js 15 App Router acts as the unified frontend interface, routing layouts, and rendering visuals while communicating with the Firestore database layer and Edge API routes.
          </p>
          <div className="bg-zinc-950/40 border border-border p-4 rounded-xl font-mono text-[10px] space-y-2 leading-relaxed">
            <span className="text-primary font-bold">FLOW TOPOLOGY:</span>
            <p>1. USER PROMPT → NEXT.JS EDGE API → GEMINI STRUCTURED JSON SCHEMA</p>
            <p>2. CANVAS ENGINE (REACT FLOW) → LOCAL CHANGES STATE (ZUSTAND STORE) → DEBOUNCED SNAPSHOTS</p>
            <p>3. FIRESTORE CLIENT REPLICATOR → WORKSPACES & VERSIONS REALTIME SYNC</p>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            State management is split: Zustand coordinates highly interactive canvas node transforms (avoiding React re-render lags), while TanStack React Query handles cached metadata retrieval for workflows listings and histories.
          </p>
        </div>
      ),
    },
    {
      id: "db",
      title: "Firestore Schemas",
      icon: <Database className="h-4 w-4 shrink-0" />,
      content: (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-foreground">2. Database Collection Schema</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            We structure our Firestore database into a workspace-centric subcollection mapping. To prevent document payload size limits (1MB), we save workflow history snapshots in a distinct <code className="text-primary">versions</code> subcollection.
          </p>
          <div className="rounded-lg border border-border bg-zinc-950/80 p-3.5 space-y-3 font-mono text-[9px] leading-relaxed">
            <div>
              <span className="text-primary font-bold">/workspaces/{`{workspaceId}`}</span>
              <p className="text-muted-foreground">{`{ name: string, ownerId: string, apiKeys: Array<{ name, prefix, hash }>, members: Map }`}</p>
            </div>
            <div>
              <span className="text-primary font-bold">/workspaces/{`{workspaceId}`}/workflows/{`{workflowId}`}</span>
              <p className="text-muted-foreground">{`{ name: string, description: string, isActive: boolean, activeVersionId: string }`}</p>
            </div>
            <div>
              <span className="text-primary font-bold">/workspaces/{`{workspaceId}`}/workflows/{`{workflowId}`}/versions/{`{versionId}`}</span>
              <p className="text-muted-foreground">{`{ versionNumber: number, nodes: Array, edges: Array, createdAt: timestamp }`}</p>
            </div>
            <div>
              <span className="text-primary font-bold">/workspaces/{`{workspaceId}`}/executions/{`{executionId}`}</span>
              <p className="text-muted-foreground">{`{ status: 'success'|'failed', startTime: timestamp, logs: Array }`}</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "security",
      title: "Firebase Security Rules",
      icon: <Shield className="h-4 w-4 shrink-0" />,
      content: (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-foreground">3. Security Mappings</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            FlowForge AI uses robust role-based access rules defined directly in <code className="text-primary">firestore.rules</code>. Every document read/write validates that the authenticated requester belongs to the target workspace members list.
          </p>
          <pre className="rounded-lg border border-border bg-zinc-950/80 p-3.5 text-[9px] font-mono text-muted-foreground leading-relaxed">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() {
      return request.auth != null;
    }
    match /workspaces/{workspaceId} {
      allow create: if isAuthenticated();
      allow read, update: if isAuthenticated() && resource.data.members[request.auth.uid] != null;
      
      match /workflows/{workflowId} {
        allow read, write: if isAuthenticated() && get(/databases/$(database)/documents/workspaces/$(workspaceId)).data.members[request.auth.uid] != null;
      }
    }
  }
}`}
          </pre>
        </div>
      ),
    },
    {
      id: "api",
      title: "HTTP REST API Reference",
      icon: <Terminal className="h-4 w-4 shrink-0" />,
      content: (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-foreground">4. API Endpoint Mappings</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Developers can trigger their automations programmatically by making HTTP requests to our webhook endpoints. Custom authentication uses header keys validation.
          </p>
          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 border border-border rounded-lg bg-zinc-950/40">
              <div className="flex items-center gap-2">
                <span className="bg-blue-600 text-white font-bold px-1.5 py-0.5 rounded text-[9px]">POST</span>
                <span className="text-[10px] text-foreground">https://api.flowforge.ai/v1/trigger/{`{nodeId}`}</span>
              </div>
              <p className="text-[9px] text-muted-foreground mt-2 font-sans">
                Trigger a webhook node. Requires headers parameter <code className="text-primary">x-api-key: ff_live_...</code>.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "ai",
      title: "Gemini Copilot Prompting",
      icon: <Cpu className="h-4 w-4 shrink-0" />,
      content: (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-foreground">5. Gemini AI Prompting System</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Our AI engine integrates Google AI Studio models using Edge endpoints. To transform natural language commands into canvas coordinate vectors, we implement a strict structural prompt constraint:
          </p>
          <div className="rounded-lg border border-border bg-zinc-950/40 p-3.5 space-y-3">
            <h4 className="text-[10px] font-bold text-primary uppercase font-mono tracking-wider">SYSTEM CONSTRAINTS SCHEMA:</h4>
            <p className="text-[10px] text-muted-foreground leading-relaxed font-mono">
              &quot;Translate user commands to nodes list and edges. Nodes position must scale sequentially. Outputs must conform to JSON schema structure. Output must only be raw JSON.&quot;
            </p>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Using response constraints guarantees that Gemini outputs structured JSON payloads, avoiding string extraction parsing exceptions during frontend updates.
          </p>
        </div>
      ),
    },
    {
      id: "deploy",
      title: "Deployment Guidelines",
      icon: <CheckCircle className="h-4 w-4 shrink-0" />,
      content: (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-foreground">6. Production Deployment</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            FlowForge AI is optimized for deployment on Vercel:
          </p>
          <ul className="list-disc pl-4 space-y-2 text-xs text-muted-foreground leading-relaxed">
            <li>**Hosting**: Next.js App Router deployed to Vercel global edge.</li>
            <li>**Environment variables**: Set up the Firebase Client Web keys and Gemini API keys inside the Vercel Settings portal.</li>
            <li>**Database Security**: Upload rules configurations using the Firebase Console command tools.</li>
          </ul>
        </div>
      ),
    },
  ];

  const active = chapters.find((ch) => ch.id === activeChapter) || chapters[0];

  return (
    <div className="min-h-screen bg-black text-foreground font-sans flex flex-col relative">
      {/* Glow backgrounds */}
      <div className="absolute inset-0 canvas-grid opacity-15 pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Docs Header */}
      <header className="h-16 border-b border-border bg-black/60 backdrop-blur-md flex items-center justify-between px-6 z-20 shrink-0 select-none">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/")}
            className="h-8 w-8 text-muted-foreground hover:text-foreground border border-border/40 shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="relative flex h-7 w-7 items-center justify-center rounded-lg overflow-hidden border border-white/20 shadow-[0_0_12px_rgba(99,102,241,0.4)] shrink-0">
              <Image
                src="/icon.png"
                alt="FlowForge AI"
                width={28}
                height={28}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-white">FlowForge</span>
              <span className="text-xs text-muted-foreground">Documentation</span>
            </div>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => router.push("/dashboard")} className="h-8 text-xs border-border/60">
          Open Console
        </Button>
      </header>

      {/* Docs Layout */}
      <div className="flex-1 flex max-w-6xl mx-auto w-full min-h-0 select-none">
        {/* Navigation Sidebar Panel */}
        <aside className="w-64 border-r border-border p-6 space-y-4 overflow-y-auto shrink-0 hidden md:block">
          <div className="px-3 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            Guides & Specs
          </div>
          <nav className="space-y-1">
            {chapters.map((ch) => {
              const active = ch.id === activeChapter;
              return (
                <button
                  key={ch.id}
                  onClick={() => setActiveChapter(ch.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-left transition-all",
                    active
                      ? "bg-primary text-primary-foreground shadow"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  )}
                >
                  {ch.icon}
                  <span className="truncate">{ch.title}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Dynamic content reader panel */}
        <main className="flex-1 overflow-y-auto p-8 md:p-12 max-w-2xl">
          <div className="space-y-6">
            <span className="text-[10px] text-primary font-bold uppercase tracking-widest flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" />
              Developer Handbook
            </span>
            
            {/* Display active chapter contents */}
            <div className="prose prose-invert max-w-none">
              {active.content}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
