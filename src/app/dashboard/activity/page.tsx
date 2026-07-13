"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/context/AuthContext";
import { collection, query, orderBy, onSnapshot, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Activity as WorkspaceActivity } from "@/types";
import {
  Activity,
  User,
  GitBranch,
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
  Edit,
  UserPlus,
  Layers,
  Clock,
  Sparkles,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// Simulated/Fallback Activity Timeline logs if Firestore is empty
const mockTimeline: WorkspaceActivity[] = [
  {
    id: "act_1",
    workspaceId: "ws_1",
    userId: "u_1",
    userName: "Ayush",
    userEmail: "ayush@flowforge.ai",
    userPhotoURL: null,
    action: "renamed_workflow",
    targetId: "wf_1",
    targetName: "Sync Github to Discord",
    targetType: "workflow",
    createdAt: new Date(Date.now() - 3600000 * 0.5), // 30m ago
  },
  {
    id: "act_2",
    workspaceId: "ws_1",
    userId: "u_2",
    userName: "FlowForge AI",
    userEmail: "copilot@flowforge.ai",
    userPhotoURL: null,
    action: "ai_optimized",
    targetId: "wf_1",
    targetName: "Sync Github to Discord",
    targetType: "version",
    createdAt: new Date(Date.now() - 3600000 * 1.5), // 1.5h ago
  },
  {
    id: "act_3",
    workspaceId: "ws_1",
    userId: "u_system",
    userName: "Execution Runner",
    userEmail: "runner@flowforge.ai",
    userPhotoURL: null,
    action: "execution_failed",
    targetId: "run_102",
    targetName: "Sync Github to Discord",
    targetType: "workflow",
    createdAt: new Date(Date.now() - 3600000 * 4), // 4h ago
  },
  {
    id: "act_4",
    workspaceId: "ws_1",
    userId: "u_1",
    userName: "Ayush",
    userEmail: "ayush@flowforge.ai",
    userPhotoURL: null,
    action: "published_version",
    targetId: "ver_3",
    targetName: "Version 3 (Staging)",
    targetType: "version",
    createdAt: new Date(Date.now() - 3600000 * 8), // 8h ago
  },
  {
    id: "act_5",
    workspaceId: "ws_1",
    userId: "u_1",
    userName: "Ayush",
    userEmail: "ayush@flowforge.ai",
    userPhotoURL: null,
    action: "member_joined",
    targetId: "member_new",
    targetName: "Collaborator (admin)",
    targetType: "member",
    createdAt: new Date(Date.now() - 3600000 * 24), // 1 day ago
  },
];

export default function ActivityTimelinePage() {
  const { activeWorkspace } = useAuth();
  const [activities, setActivities] = useState<WorkspaceActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [sandboxMode, setSandboxMode] = useState(true);

  // Sync with Firestore collection
  useEffect(() => {
    if (!activeWorkspace?.id) {
      Promise.resolve().then(() => setLoading(false));
      return;
    }

    Promise.resolve().then(() => setLoading(true));
    const actRef = collection(db, "workspaces", activeWorkspace.id, "activities");
    const q = query(actRef, orderBy("createdAt", "desc"), limit(100));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((docSnap) => ({
          ...docSnap.data(),
          id: docSnap.id,
        })) as WorkspaceActivity[];
        setActivities(list);
        Promise.resolve().then(() => {
          setLoading(false);
          if (list.length > 0) {
            setSandboxMode(false);
          }
        });
      },
      (err) => {
        console.error("Firestore activity timeline error:", err);
        Promise.resolve().then(() => {
          setLoading(false);
          setSandboxMode(true);
        });
      }
    );

    return () => unsubscribe();
  }, [activeWorkspace?.id]);

  const displayList = sandboxMode ? mockTimeline : activities;

  // Render Action Icon indicator
  const getActionIcon = (action: string) => {
    switch (action) {
      case "renamed_workflow":
        return <Edit className="h-3.5 w-3.5 text-blue-400" />;
      case "ai_optimized":
        return <Sparkles className="h-3.5 w-3.5 text-violet-400 animate-pulse" />;
      case "execution_failed":
        return <XCircle className="h-3.5 w-3.5 text-destructive" />;
      case "published_version":
        return <GitBranch className="h-3.5 w-3.5 text-emerald-400" />;
      case "member_joined":
        return <UserPlus className="h-3.5 w-3.5 text-pink-400" />;
      default:
        return <Activity className="h-3.5 w-3.5 text-primary" />;
    }
  };

  // Convert raw action keys to human words
  const getActionText = (act: WorkspaceActivity) => {
    const boldTarget = <span className="font-bold text-foreground">{act.targetName}</span>;
    switch (act.action) {
      case "renamed_workflow":
        return <>renamed workflow to {boldTarget}</>;
      case "ai_optimized":
        return <>optimized node mappings inside {boldTarget} using Gemini AI</>;
      case "execution_failed":
        return <>noted an execution run fail on {boldTarget}</>;
      case "published_version":
        return <>published version snapshot {boldTarget}</>;
      case "member_joined":
        return <>added {boldTarget} to workspace collaborators</>;
      default:
        return <>updated {act.targetType} parameters in {boldTarget}</>;
    }
  };

  return (
    <div className="flex-1 p-6 space-y-6 max-w-4xl mx-auto w-full font-sans">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Activity Feed</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Audit history trace log of workflow edits, optimizations, runs, and workspace updates.
          </p>
        </div>

        {/* Sandbox toggle badge */}
        {activities.length === 0 && (
          <div className="flex items-center gap-2 bg-zinc-950/60 border border-border px-3.5 py-1.5 rounded-lg text-xs font-semibold glass-panel select-none shrink-0 self-start md:self-auto">
            <span className="text-[10px] text-muted-foreground uppercase font-bold">
              Demo sandbox timeline
            </span>
            <button
              onClick={() => setSandboxMode((prev) => !prev)}
              className={cn(
                "relative inline-flex h-4.5 w-8 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200",
                sandboxMode ? "bg-primary" : "bg-muted"
              )}
            >
              <span
                className={cn(
                  "pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition duration-200 mt-0.5",
                  sandboxMode ? "translate-x-3.5" : "translate-x-0.5"
                )}
              />
            </button>
          </div>
        )}
      </div>

      {/* Main vertical timeline panel */}
      {loading ? (
        <div className="space-y-6 pl-4 border-l border-border/60">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 relative">
              <Skeleton className="h-6 w-6 rounded-full shrink-0" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : displayList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 border border-dashed border-border rounded-xl bg-zinc-950/10">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/20 text-muted-foreground">
            <Activity className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-foreground">Timeline Empty</h3>
            <p className="text-xs text-muted-foreground leading-normal max-w-xs">
              No auditable events logged in this workspace yet.
            </p>
          </div>
        </div>
      ) : (
        <div className="relative pl-6 border-l border-border/80 ml-4 space-y-8 py-2">
          {displayList.map((act) => {
            const initialLetter = act.userName ? act.userName.charAt(0).toUpperCase() : "?";
            return (
              <div key={act.id} className="relative flex gap-4 items-start group">
                {/* Timeline node node connector */}
                <div className="absolute -left-[35px] top-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-black border border-border text-current shadow">
                  {getActionIcon(act.action)}
                </div>

                {/* Profile Avatar letter */}
                <div className="h-8 w-8 rounded-full border border-border bg-zinc-900/60 flex items-center justify-center text-xs font-bold text-primary shrink-0 select-none">
                  {act.userPhotoURL ? (
                    <img src={act.userPhotoURL} alt={act.userName} className="h-full w-full object-cover rounded-full" />
                  ) : (
                    <span>{initialLetter}</span>
                  )}
                </div>

                {/* Content block details */}
                <div className="flex-1 space-y-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <p className="text-xs text-muted-foreground leading-normal">
                      <span className="font-bold text-foreground">{act.userName}</span>{" "}
                      {getActionText(act)}
                    </p>
                    <span className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1 shrink-0 font-mono">
                      <Clock className="h-3 w-3" />
                      {new Date(act.createdAt as unknown as string | number | Date).toLocaleDateString([], {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground/80 font-mono">
                    User: {act.userEmail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
