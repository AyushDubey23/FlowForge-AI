"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/features/auth/context/AuthContext";
import { collection, query, getDocs, limit, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Workflow } from "@/types";
import {
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  Activity,
  Zap,
  Plus,
  Layers,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";
import { cn, formatDuration, formatDateTime } from "@/lib/utils";

// Static mock metrics for premium preview (Sandbox Mode)
const mockActivityData = [
  { day: "Mon", runs: 240, success: 236, fail: 4 },
  { day: "Tue", runs: 320, success: 312, fail: 8 },
  { day: "Wed", runs: 450, success: 442, fail: 8 },
  { day: "Thu", runs: 380, success: 374, fail: 6 },
  { day: "Fri", runs: 520, success: 510, fail: 10 },
  { day: "Sat", runs: 290, success: 288, fail: 2 },
  { day: "Sun", runs: 340, success: 335, fail: 5 },
];

const mockWorkflows = [
  {
    id: "wf_1",
    name: "Sync Github to Discord",
    description: "Summarize issue notifications with Gemini and forward to Discord webhook.",
    isActive: true,
    latestVersionNumber: 3,
    updatedAt: new Date(Date.now() - 3600000 * 2), // 2 hours ago
  },
  {
    id: "wf_2",
    name: "AI Welcome Email Automator",
    description: "Generates personalized registration greeting and triggers firestore insert.",
    isActive: true,
    latestVersionNumber: 1,
    updatedAt: new Date(Date.now() - 3600000 * 24), // 1 day ago
  },
  {
    id: "wf_3",
    name: "Monthly Storage Backup Cleaner",
    description: "Scans expired temp logs files in Storage and clears database entries.",
    isActive: false,
    latestVersionNumber: 2,
    updatedAt: new Date(Date.now() - 3600000 * 48), // 2 days ago
  },
];

const mockExecutions = [
  {
    id: "run_104",
    workflowName: "Sync Github to Discord",
    status: "success" as const,
    durationMs: 840,
    startTime: new Date(Date.now() - 600000), // 10m ago
    triggerType: "Webhook Trigger",
  },
  {
    id: "run_103",
    workflowName: "AI Welcome Email Automator",
    status: "success" as const,
    durationMs: 1450,
    startTime: new Date(Date.now() - 1800000), // 30m ago
    triggerType: "Manual Run",
  },
  {
    id: "run_102",
    workflowName: "Sync Github to Discord",
    status: "failed" as const,
    durationMs: 320,
    startTime: new Date(Date.now() - 3600000 * 4), // 4h ago
    triggerType: "Webhook Trigger",
  },
  {
    id: "run_101",
    workflowName: "Monthly Storage Backup Cleaner",
    status: "success" as const,
    durationMs: 2900,
    startTime: new Date(Date.now() - 3600000 * 12), // 12h ago
    triggerType: "Timer Trigger",
  },
];

export default function DashboardPage() {
  const { profile, activeWorkspace } = useAuth();
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [sandboxMode, setSandboxMode] = useState(false);
  const router = useRouter();

  // Load real workflows from Firestore
  useEffect(() => {
    if (!activeWorkspace?.id) return;
    const fetchRealData = async () => {
      try {
        const wfsQuery = query(
          collection(db, "workspaces", activeWorkspace.id, "workflows"),
          orderBy("updatedAt", "desc"),
          limit(5)
        );
        const snap = await getDocs(wfsQuery);
        const list = snap.docs.map((doc) => doc.data() as Workflow);
        setWorkflows(list);
        if (list.length > 0) {
          Promise.resolve().then(() => setSandboxMode(false));
        }
      } catch {
        Promise.resolve().then(() => setSandboxMode(true));
      }
    };
    fetchRealData();
  }, [activeWorkspace?.id]);

  const handleCreateWorkflow = () => {
    router.push("/dashboard/workflows");
  };

  const activeWfsCount = sandboxMode ? 2 : workflows.filter((w) => w.isActive).length;
  const totalWfsCount = sandboxMode ? mockWorkflows.length : workflows.length;
  const successRate = sandboxMode ? "98.2%" : "0%";
  const runsCount = sandboxMode ? 2640 : 0;

  return (
    <div className="flex-1 p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full font-sans">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="flex items-center gap-4">
          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl overflow-hidden border border-white/20 shadow-[0_0_25px_rgba(99,102,241,0.35)] shrink-0 bg-white/5 p-0.5">
            <Image
              src="/icon.png"
              alt="FlowForge AI"
              width={56}
              height={56}
              className="h-full w-full object-cover rounded-xl"
              priority
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-primary font-semibold">
                Workspace Overview
              </span>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/25">
                FlowForge AI v2.4
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white mt-1">
              Welcome back, {profile?.displayName || "Developer"}
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Monitor flow runs, execution latency, API keys, and node executions in real time.
            </p>
          </div>
        </div>

        {/* Sandbox switcher & quick button panel */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 bg-black/60 border border-white/10 px-3.5 py-2 rounded-xl text-xs font-medium glass-panel select-none">
            <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider">
              Demo Sandbox
            </span>
            <button
              onClick={() => setSandboxMode((prev) => !prev)}
              className={cn(
                "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                sandboxMode ? "bg-primary" : "bg-white/10"
              )}
            >
              <span
                className={cn(
                  "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out mt-0.5",
                  sandboxMode ? "translate-x-4" : "translate-x-0.5"
                )}
              />
            </button>
          </div>

          <button
            onClick={handleCreateWorkflow}
            className="group h-9 rounded-xl bg-primary hover:bg-primary/90 text-white px-4 text-xs font-semibold flex items-center gap-2 shadow-md shadow-primary/20 transition-all active:scale-[0.98]"
          >
            <Plus className="h-4 w-4 text-white" />
            <span>New Workflow</span>
          </button>
        </div>
      </div>

      {/* Doppelrand Stats Metrics Grid */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1 */}
        <div className="bezel-shell">
          <div className="bezel-core p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                Total Runs
              </span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Activity className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white">{runsCount}</div>
            <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5" />
              +12.4% from last week
            </p>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bezel-shell">
          <div className="bezel-core p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                Success Rate
              </span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white">{successRate}</div>
            <p className="text-[11px] text-zinc-400">
              Target 98%+ SLA maintained
            </p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bezel-shell">
          <div className="bezel-core p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                Active Flows
              </span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
                <Zap className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white">
              {activeWfsCount} <span className="text-xs font-normal text-zinc-500">/ {totalWfsCount} total</span>
            </div>
            <p className="text-[11px] text-zinc-400">
              Live automated triggers active
            </p>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bezel-shell">
          <div className="bezel-core p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                AI Token Savings
              </span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
                <Sparkles className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white">
              {sandboxMode ? "42k" : "0"} <span className="text-xs font-normal text-zinc-500">tokens</span>
            </div>
            <p className="text-[11px] text-primary font-medium">
              Gemini 1.5 Pro compiler active
            </p>
          </div>
        </div>
      </div>

      {/* Main Charts Block */}
      <div className="grid gap-6 md:grid-cols-7">
        <div className="md:col-span-4 bezel-shell">
          <div className="bezel-core p-6 space-y-4">
            <div>
              <h3 className="text-base font-bold text-white">Daily Run Execution Telemetry</h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Daily trigger executions compiled by successful vs failed runs.
              </p>
            </div>
            <div className="h-72 pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockActivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#71717A" fontSize={11} tickLine={false} />
                  <YAxis stroke="#71717A" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0E0E11",
                      borderColor: "rgba(255,255,255,0.1)",
                      color: "#FAFAFA",
                      fontSize: 12,
                      borderRadius: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="success"
                    stroke="hsl(var(--primary))"
                    fillOpacity={1}
                    fill="url(#colorSuccess)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Ratio Chart */}
        <div className="md:col-span-3 bezel-shell">
          <div className="bezel-core p-6 space-y-4">
            <div>
              <h3 className="text-base font-bold text-white">Success vs Error Ratio</h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Node status breakdown across daily executions.
              </p>
            </div>
            <div className="h-72 pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockActivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="day" stroke="#71717A" fontSize={11} tickLine={false} />
                  <YAxis stroke="#71717A" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0E0E11",
                      borderColor: "rgba(255,255,255,0.1)",
                      color: "#FAFAFA",
                      fontSize: 12,
                      borderRadius: 12,
                    }}
                  />
                  <Bar dataKey="success" fill="hsl(var(--primary))" stackId="a" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="fail" fill="#EF4444" stackId="a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Split lists: Recent Workflows & Executions */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Workflows Panel */}
        <div className="bezel-shell">
          <div className="bezel-core p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-base font-bold text-white">Recent Workflows</h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Workflow node blueprints configured in this workspace.
                </p>
              </div>
              <button
                onClick={() => router.push("/dashboard/workflows")}
                className="text-xs font-semibold text-primary hover:underline"
              >
                View all
              </button>
            </div>

            <div className="space-y-3">
              {sandboxMode ? (
                mockWorkflows.map((wf) => (
                  <div
                    key={wf.id}
                    onClick={() => router.push(`/dashboard/builder/${wf.id}`)}
                    className="group flex items-center justify-between p-4 rounded-xl border border-white/5 bg-black/40 hover:bg-white/5 hover:border-white/15 transition-all cursor-pointer"
                  >
                    <div className="space-y-1 min-w-0 pr-4">
                      <div className="flex items-center gap-2.5">
                        <span className="font-bold text-xs text-white group-hover:text-primary transition-colors truncate">
                          {wf.name}
                        </span>
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded-full text-[9px] font-mono font-semibold uppercase tracking-wider border",
                            wf.isActive
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : "bg-white/5 text-zinc-400 border-white/10"
                          )}
                        >
                          {wf.isActive ? "Active" : "Draft"}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 truncate leading-relaxed">
                        {wf.description}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-zinc-500 group-hover:text-white shrink-0 group-hover:translate-x-1 transition-all" />
                  </div>
                ))
              ) : workflows.length === 0 ? (
                <div className="py-8 text-center text-xs text-zinc-400 space-y-3 border border-dashed border-white/10 rounded-xl bg-black/30">
                  <Layers className="h-8 w-8 mx-auto text-zinc-600" />
                  <p className="font-semibold text-white">No workflows created yet</p>
                  <Button size="sm" variant="outline" onClick={handleCreateWorkflow} className="rounded-xl border-white/10 text-xs">
                    Create first workflow
                  </Button>
                </div>
              ) : (
                workflows.map((wf) => (
                  <div
                    key={wf.id}
                    onClick={() => router.push(`/dashboard/builder/${wf.id}`)}
                    className="group flex items-center justify-between p-4 rounded-xl border border-white/5 bg-black/40 hover:bg-white/5 hover:border-white/15 transition-all cursor-pointer"
                  >
                    <div className="space-y-1 min-w-0 pr-4">
                      <div className="flex items-center gap-2.5">
                        <span className="font-bold text-xs text-white group-hover:text-primary transition-colors truncate">
                          {wf.name}
                        </span>
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded-full text-[9px] font-mono font-semibold uppercase tracking-wider border",
                            wf.isActive
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : "bg-white/5 text-zinc-400 border-white/10"
                          )}
                        >
                          {wf.isActive ? "Active" : "Draft"}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 truncate leading-relaxed">
                        {wf.description}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-zinc-500 group-hover:text-white shrink-0 group-hover:translate-x-1 transition-all" />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Executions Logs Panel */}
        <div className="bezel-shell">
          <div className="bezel-core p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-base font-bold text-white">Recent Run Logs</h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Timeline diagnostic logs for the latest trigger runs.
                </p>
              </div>
              <button
                onClick={() => router.push("/dashboard/executions")}
                className="text-xs font-semibold text-primary hover:underline"
              >
                View all
              </button>
            </div>

            <div className="space-y-3">
              {sandboxMode ? (
                mockExecutions.map((run) => (
                  <div
                    key={run.id}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-white/5 bg-black/40"
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      {run.status === "success" ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-400 shrink-0" />
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-xs text-white truncate leading-none mb-0.5">
                            {run.workflowName}
                          </p>
                          <span className="text-[10px] text-zinc-500 font-mono leading-none">
                            {run.id}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400 flex items-center gap-1.5 mt-1 font-mono">
                          <span>{run.triggerType}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-zinc-500">
                            <Clock className="h-3 w-3" />
                            {formatDuration(run.durationMs)}
                          </span>
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] text-zinc-500 font-mono font-medium shrink-0">
                      {formatDateTime(run.startTime)}
                    </span>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-zinc-400 space-y-3 border border-dashed border-white/10 rounded-xl bg-black/30">
                  <Clock className="h-8 w-8 mx-auto text-zinc-600" />
                  <p className="font-semibold text-white">No execution logs recorded yet</p>
                  <p className="text-[11px] max-w-[240px] mx-auto text-zinc-500 leading-normal">
                    Publish an active workflow to start logging trigger diagnostic runs.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
