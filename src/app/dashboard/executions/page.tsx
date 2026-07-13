"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/context/AuthContext";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  getDocs,
  limit,
  addDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { WorkflowExecution } from "@/types";
import {
  History,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCw,
  Search,
  Filter,
  Eye,
  AlertCircle,
  FileText,
  StopCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, formatDuration, formatDateTime } from "@/lib/utils";

export default function ExecutionsPage() {
  const { activeWorkspace } = useAuth();
  const [executions, setExecutions] = useState<WorkflowExecution[]>([]);
  const [workflows, setWorkflows] = useState<Record<string, string>>({}); // workflowId -> name
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  // Selected execution details panel state
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);
  const [retryingId, setRetryingId] = useState<string | null>(null);
  
  const selectedRun = executions.find((r) => r.id === selectedRunId);

  // Load workflow names for display
  useEffect(() => {
    if (!activeWorkspace?.id) return;
    const loadWfNames = async () => {
      try {
        const snap = await getDocs(collection(db, "workspaces", activeWorkspace.id, "workflows"));
        const map: Record<string, string> = {};
        snap.docs.forEach((d) => {
          map[d.id] = d.data().name || "Untitled Workflow";
        });
        setWorkflows(map);
      } catch {
        // Silent catch
      }
    };
    loadWfNames();
  }, [activeWorkspace?.id]);

  // Listen to executions collection in active workspace
  useEffect(() => {
    if (!activeWorkspace?.id) {
      Promise.resolve().then(() => setLoading(false));
      return;
    }

    Promise.resolve().then(() => setLoading(true));
    // Executions stored under workspace root executions subcollection for easy global listing
    const execsRef = collection(db, "workspaces", activeWorkspace.id, "executions");
    const q = query(execsRef, orderBy("startTime", "desc"), limit(100));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((docSnap) => ({
          ...docSnap.data(),
          id: docSnap.id,
        })) as WorkflowExecution[];
        setExecutions(list);
        Promise.resolve().then(() => setLoading(false));
      },
      (err) => {
        console.error("Failed to sync execution history:", err);
        Promise.resolve().then(() => setLoading(false));
      }
    );

    return () => unsubscribe();
  }, [activeWorkspace?.id]);

  // Mock trigger rerun (Retry flow)
  const handleRetry = async (run: WorkflowExecution) => {
    if (!activeWorkspace?.id || retryingId) return;

    try {
      setRetryingId(run.id);
      
      const execsRef = collection(db, "workspaces", activeWorkspace.id, "executions");
      const newRunId = `run_${Math.random().toString(36).substring(2, 9)}`;

      // Simulate a running execution that finishes after 1.5s
      const newRun: WorkflowExecution = {
        id: newRunId,
        workflowId: run.workflowId,
        versionId: run.versionId,
        status: "success",
        startTime: new Date(),
        endTime: new Date(Date.now() + 1200),
        durationMs: 1200,
        triggerType: "Manual Retry",
        logs: [
          { timestamp: new Date(), level: "info", message: "Starting manual retry execution trigger." },
          { timestamp: new Date(Date.now() + 300), level: "info", message: "Successfully fetched version snapshot variables." },
          { timestamp: new Date(Date.now() + 600), level: "info", message: "Connecting to webhook trigger mappings." },
          { timestamp: new Date(Date.now() + 900), level: "info", message: "Execution run ended with return code 0." },
        ],
        error: null,
      };

      await addDoc(execsRef, newRun);
      
      // Auto select the new execution
      setTimeout(() => {
        setSelectedRunId(newRunId);
        setRetryingId(null);
      }, 1000);
    } catch (err) {
      console.error(err);
      setRetryingId(null);
    }
  };

  // Filter list
  const filteredExecutions = executions.filter((run) => {
    const wfName = workflows[run.workflowId] || "Unknown Workflow";
    const matchesSearch =
      run.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wfName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      run.triggerType.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || run.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex-1 flex min-h-0 relative font-sans">
      {/* LHS list pane */}
      <div className="flex-1 flex flex-col p-6 space-y-6 overflow-y-auto">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Run History</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Audit logs and variables outputs for all workspace executions.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row gap-3.5 items-stretch md:items-center justify-between shrink-0">
          <div className="flex items-center bg-zinc-950/40 border border-border px-3 rounded-lg focus-within:ring-1 focus-within:ring-ring focus-within:border-primary max-w-sm flex-1 transition-all">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="Search by execution ID or workflow..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2.5 px-3 text-xs bg-transparent border-none outline-none text-foreground placeholder-muted-foreground"
            />
          </div>

          <div className="flex items-center gap-2 bg-zinc-950/60 border border-border px-3.5 py-1.5 rounded-lg text-xs font-semibold glass-panel select-none">
            <Filter className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-foreground border-none outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
              <option value="running">Running</option>
            </select>
          </div>
        </div>

        {/* Run list elements */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-14 w-full rounded-lg" />
            ))}
          </div>
        ) : filteredExecutions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 border border-dashed border-border rounded-xl bg-zinc-950/10">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/20 text-muted-foreground">
              <History className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-foreground">No executions logged</h3>
              <p className="text-xs text-muted-foreground leading-normal max-w-xs">
                Make sure your workflows are active and configured with live trigger endpoints.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredExecutions.map((run) => {
              const isActive = run.id === selectedRunId;
              const wfName = workflows[run.workflowId] || "Unknown Workflow";
              return (
                <div
                  key={run.id}
                  onClick={() => setSelectedRunId(run.id)}
                  className={cn(
                    "flex items-center justify-between p-3.5 rounded-lg border bg-zinc-950/20 hover:bg-zinc-900/40 transition-all cursor-pointer",
                    isActive
                      ? "border-primary bg-primary/5 shadow shadow-primary/5"
                      : "border-border/60"
                  )}
                >
                  <div className="flex items-center gap-3.5 min-w-0 pr-2">
                    {run.status === "success" && (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    )}
                    {run.status === "failed" && (
                      <XCircle className="h-4 w-4 text-destructive shrink-0" />
                    )}
                    {run.status === "running" && (
                      <Loader2 className="h-4 w-4 animate-spin text-primary shrink-0" />
                    )}
                    {run.status === "cancelled" && (
                      <StopCircle className="h-4 w-4 text-muted-foreground shrink-0" />
                    )}
                    
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-xs text-foreground truncate leading-none mb-0.5">
                          {wfName}
                        </p>
                        <span className="text-[9px] text-muted-foreground font-mono leading-none">
                          {run.id}
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground flex items-center gap-1.5 mt-1">
                        <span>{run.triggerType}</span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5">
                          <Clock className="h-3.5 w-3.5" />
                          {formatDuration(run.durationMs)}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <span className="text-[10px] text-muted-foreground font-semibold">
                      {formatDateTime(run.startTime)}
                    </span>
                    <Button variant="ghost" size="icon" className="h-7 w-7 border border-border/40 hover:bg-muted">
                      <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* RHS details inspector pane */}
      <div className="w-96 border-l border-border bg-card/25 backdrop-blur-md flex flex-col h-full overflow-hidden shrink-0 select-none">
        {selectedRun ? (
          <div className="flex flex-col h-full min-h-0">
            {/* Inspector Header */}
            <div className="p-4 border-b border-border/80 flex items-center justify-between shrink-0 bg-zinc-950/20">
              <div>
                <span className="text-[9px] text-primary font-bold uppercase tracking-widest leading-none block mb-1">
                  Run Diagnostics
                </span>
                <h3 className="text-xs font-bold text-foreground font-mono">
                  {selectedRun.id}
                </h3>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-[10px] font-bold gap-1 px-2.5 border-border/80"
                onClick={() => handleRetry(selectedRun)}
                disabled={retryingId === selectedRun.id}
              >
                <RotateCw className={cn("h-3 w-3", retryingId === selectedRun.id && "animate-spin")} />
                Rerun Flow
              </Button>
            </div>

            {/* Diagnostics details body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              {/* Properties parameters list */}
              <div className="space-y-3.5 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-border/40">
                  <span className="text-muted-foreground font-semibold">Workflow name</span>
                  <span className="text-foreground font-bold">{workflows[selectedRun.workflowId] || "Unknown"}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-border/40">
                  <span className="text-muted-foreground font-semibold">Start Time</span>
                  <span className="text-foreground">{formatDateTime(selectedRun.startTime)}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-border/40">
                  <span className="text-muted-foreground font-semibold">Run Duration</span>
                  <span className="text-foreground font-mono">{formatDuration(selectedRun.durationMs)}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-border/40">
                  <span className="text-muted-foreground font-semibold">Execution status</span>
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider",
                      selectedRun.status === "success" && "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                      selectedRun.status === "failed" && "bg-destructive/10 text-destructive border-destructive/20"
                    )}
                  >
                    {selectedRun.status}
                  </span>
                </div>
              </div>

              <div className="border-t border-border/60 pt-4" />

              {/* Execution Error Message if any */}
              {selectedRun.error && (
                <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 text-destructive font-bold">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>Error in node &quot;{selectedRun.error.nodeId || "system"}&quot;</span>
                  </div>
                  <p className="text-muted-foreground leading-normal font-mono text-[10px] bg-black/40 p-2 rounded border border-border/40 whitespace-pre-wrap">
                    {selectedRun.error.message}
                  </p>
                </div>
              )}

              {/* Realtime event logs stream */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-foreground/80 uppercase tracking-widest flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-primary" />
                  Terminal Log Output
                </h4>
                
                <div className="rounded-lg border border-border bg-zinc-950/60 p-3.5 space-y-3 font-mono text-[10px] leading-relaxed max-h-[30vh] overflow-y-auto">
                  {selectedRun.logs.length === 0 ? (
                    <p className="text-muted-foreground italic">No logs recorded.</p>
                  ) : (
                    selectedRun.logs.map((log, index) => (
                      <div key={index} className="flex gap-2">
                        <span className="text-[9px] text-muted-foreground shrink-0 select-none">
                          {new Date(log.timestamp as unknown as string | number | Date).toLocaleTimeString([], {
                            hour12: false,
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })}
                        </span>
                        <span
                          className={cn(
                            "font-bold shrink-0 uppercase text-[9px] tracking-wide select-none",
                            log.level === "info" && "text-blue-400",
                            log.level === "warn" && "text-amber-400",
                            log.level === "error" && "text-destructive"
                          )}
                        >
                          [{log.level}]
                        </span>
                        <span className="text-foreground/90">{log.message}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center h-full">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/20 text-muted-foreground mb-4">
              <History className="h-6 w-6" />
            </div>
            <h4 className="text-xs font-bold text-foreground">No run selected</h4>
            <p className="text-[10px] text-muted-foreground mt-1 max-w-[200px] leading-normal">
              Click any execution list item on the left to inspect its terminal logs, errors, and re-trigger execution variables.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
