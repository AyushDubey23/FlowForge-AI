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
        // If user already has real workflows, let's disable sandbox mode by default!
        if (list.length > 0) {
          Promise.resolve().then(() => setSandboxMode(false));
        }
      } catch {
        // Fall back to sandbox if permission/config keys missing
        Promise.resolve().then(() => setSandboxMode(true));
      }
    };
    fetchRealData();
  }, [activeWorkspace?.id]);

  const handleCreateWorkflow = () => {
    router.push("/dashboard/workflows");
  };

  // Compute metrics based on display mode
  const activeWfsCount = sandboxMode ? 2 : workflows.filter((w) => w.isActive).length;
  const totalWfsCount = sandboxMode ? mockWorkflows.length : workflows.length;
  const successRate = sandboxMode ? "98.2%" : "0%";
  const runsCount = sandboxMode ? 2640 : 0; // Starts at zero for real users

  return (
    <div className="flex-1 p-6 space-y-8 max-w-7xl mx-auto w-full font-sans">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome back, {profile?.displayName || "Developer"}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Monitor flow runs, successes, API usage metrics, and node executions.
          </p>
        </div>

        {/* Sandbox switcher & quick button panel */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-zinc-950/60 border border-border px-3 py-1.5 rounded-lg text-xs font-semibold glass-panel select-none">
            <span className="text-[10px] text-muted-foreground uppercase font-bold">
              Demo Sandbox Mode
            </span>
            <button
              onClick={() => setSandboxMode((prev) => !prev)}
              className={cn(
                "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                sandboxMode ? "bg-primary" : "bg-muted"
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

          <Button variant="primary" size="sm" onClick={handleCreateWorkflow} className="flex gap-2">
            <Plus className="h-4 w-4" />
            New Workflow
          </Button>
        </div>
      </div>

      {/* Analytics stats metrics row grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-panel">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Total Runs
            </CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{runsCount}</div>
            <p className="text-[10px] text-emerald-500 font-semibold flex items-center gap-0.5 mt-1">
              <TrendingUp className="h-3 w-3" />
              +12.4% from last week
            </p>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Success Rate
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{successRate}</div>
            <p className="text-[10px] text-muted-foreground mt-1">
              Maintained above 98% target bounds
            </p>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Active Flows
            </CardTitle>
            <Zap className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activeWfsCount} <span className="text-sm font-normal text-muted-foreground">/ {totalWfsCount}</span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">
              Automations active and monitoring
            </p>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              AI Token Savings
            </CardTitle>
            <Sparkles className="h-4 w-4 text-violet-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sandboxMode ? "42k" : "0"} <span className="text-sm font-normal text-muted-foreground">tokens</span>
            </div>
            <p className="text-[10px] text-primary font-semibold mt-1">
              Gemini integration savings
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts & Analytics Block */}
      <div className="grid gap-6 md:grid-cols-7">
        <Card className="col-span-4 glass-panel">
          <CardHeader>
            <CardTitle>Daily Activity Runs</CardTitle>
            <CardDescription className="text-xs">
              Daily trigger runs split by execution success/failure status.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockActivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    color: "hsl(var(--foreground))",
                    fontSize: 12,
                    borderRadius: 8,
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
          </CardContent>
        </Card>

        {/* Success vs Fail breakdown BarChart */}
        <Card className="col-span-3 glass-panel">
          <CardHeader>
            <CardTitle>Success vs Error Ratio</CardTitle>
            <CardDescription className="text-xs">
              Absolute ratio of successful node executions.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockActivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    color: "hsl(var(--foreground))",
                    fontSize: 12,
                    borderRadius: 8,
                  }}
                />
                <Bar dataKey="success" fill="hsl(var(--primary))" stackId="a" radius={[0, 0, 0, 0]} />
                <Bar dataKey="fail" fill="hsl(var(--destructive))" stackId="a" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Split lists: Recent Workflows & Executions */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Workflows Panel */}
        <Card className="glass-panel">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle>Recent Workflows</CardTitle>
              <CardDescription className="text-xs">
                Active workflow canvas blueprints ready for runs.
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs font-semibold"
              onClick={() => router.push("/dashboard/workflows")}
            >
              View all
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {sandboxMode ? (
              mockWorkflows.map((wf) => (
                <div
                  key={wf.id}
                  onClick={() => router.push(`/dashboard/builder/${wf.id}`)}
                  className="group flex items-center justify-between p-3.5 rounded-lg border border-border bg-zinc-950/30 hover:bg-zinc-900/60 hover:border-border/80 transition-all cursor-pointer"
                >
                  <div className="space-y-1.5 min-w-0 pr-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-foreground group-hover:text-primary transition-colors truncate">
                        {wf.name}
                      </span>
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded text-[9px] font-bold tracking-wide uppercase border",
                          wf.isActive
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-muted text-muted-foreground border-border/80"
                        )}
                      >
                        {wf.isActive ? "Active" : "Draft"}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate leading-relaxed">
                      {wf.description}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground shrink-0 group-hover:translate-x-1 transition-all" />
                </div>
              ))
            ) : workflows.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground space-y-4 border border-dashed border-border rounded-xl">
                <Layers className="h-8 w-8 mx-auto text-muted/60" />
                <p className="font-semibold">No workflows created in this workspace yet</p>
                <Button size="sm" variant="outline" onClick={handleCreateWorkflow}>
                  Create automation
                </Button>
              </div>
            ) : (
              workflows.map((wf) => (
                <div
                  key={wf.id}
                  onClick={() => router.push(`/dashboard/builder/${wf.id}`)}
                  className="group flex items-center justify-between p-3.5 rounded-lg border border-border bg-zinc-950/30 hover:bg-zinc-900/60 hover:border-border/80 transition-all cursor-pointer"
                >
                  <div className="space-y-1.5 min-w-0 pr-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-foreground group-hover:text-primary transition-colors truncate">
                        {wf.name}
                      </span>
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded text-[9px] font-bold tracking-wide uppercase border",
                          wf.isActive
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-muted text-muted-foreground border-border/80"
                        )}
                      >
                        {wf.isActive ? "Active" : "Draft"}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate leading-relaxed">
                      {wf.description}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground shrink-0 group-hover:translate-x-1 transition-all" />
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Executions Logs Panel */}
        <Card className="glass-panel">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle>Recent Run Logs</CardTitle>
              <CardDescription className="text-xs">
                Timeline logs for the latest workspace trigger runs.
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs font-semibold"
              onClick={() => router.push("/dashboard/executions")}
            >
              View all
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {sandboxMode ? (
              mockExecutions.map((run) => (
                <div
                  key={run.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border bg-zinc-950/10"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    {run.status === "success" ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 text-destructive shrink-0" />
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-xs text-foreground truncate leading-none mb-0.5">
                          {run.workflowName}
                        </p>
                        <span className="text-[9px] text-muted-foreground font-mono leading-none">
                          {run.id}
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <span>{run.triggerType}</span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5">
                          <Clock className="h-3 w-3" />
                          {formatDuration(run.durationMs)}
                        </span>
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] text-muted-foreground font-semibold shrink-0">
                    {formatDateTime(run.startTime)}
                  </span>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-muted-foreground space-y-3 border border-dashed border-border rounded-xl">
                <Clock className="h-8 w-8 mx-auto text-muted/60" />
                <p className="font-semibold">No workflow executions triggered yet</p>
                <p className="text-[11px] max-w-[240px] mx-auto text-muted-foreground leading-normal">
                  Publish a workflow with triggers to start generating run analytics logs.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
