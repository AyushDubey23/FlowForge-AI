"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useWorkflowStore } from "@/features/workflow/store/useWorkflowStore";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Workflow, WorkflowVersion } from "@/types";
import { NodeSelectorSidebar } from "@/features/workflow/components/NodeSelectorSidebar";
import { WorkflowBuilder } from "@/features/workflow/components/WorkflowBuilder";
import { SidebarConfigPanel } from "@/features/workflow/components/SidebarConfigPanel";
import { AiCopilotSidebar } from "@/features/workflow/components/AiCopilotSidebar";
import {
  ArrowLeft,
  Sparkles,
  Settings,
  GitBranch,
  Loader2,
  Edit2,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function BuilderPage() {
  const router = useRouter();
  const params = useParams();
  const workflowId = params.id as string;

  const { activeWorkspace } = useAuth();
  const { setNodes, setEdges, clearCanvas, selectedNodeId, selectNode } = useWorkflowStore();

  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Right Hand Side panel selection toggles
  const [rhsView, setRhsView] = useState<"ai" | "config">("ai");
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState("");
  const [savingTitle, setSavingTitle] = useState(false);

  // Load workflow metadata and draft version nodes/edges on mount
  useEffect(() => {
    if (!activeWorkspace?.id || !workflowId) return;

    const loadWorkflowData = async () => {
      try {
        setLoading(true);
        setError(null);

        const wfRef = doc(db, "workspaces", activeWorkspace.id, "workflows", workflowId);
        const wfSnap = await getDoc(wfRef);

        if (!wfSnap.exists()) {
          setError("Workflow blueprint not found.");
          setLoading(false);
          return;
        }

        const wfData = wfSnap.data() as Workflow;
        setWorkflow({ ...wfData, id: wfSnap.id });
        setTitleInput(wfData.name);

        // Load version data (draft_v1 or activeVersionId)
        const verRef = doc(
          db,
          "workspaces",
          activeWorkspace.id,
          "workflows",
          workflowId,
          "versions",
          "draft_v1"
        );
        const verSnap = await getDoc(verRef);

        if (verSnap.exists()) {
          const verData = verSnap.data() as WorkflowVersion;
          setNodes(verData.nodes || []);
          setEdges(verData.edges || []);
        } else {
          // Initialize empty
          setNodes([]);
          setEdges([]);
        }
      } catch (err) {
        console.error("Failed to load builder workspace:", err);
        setError("Missing Firestore rules permissions or invalid project setup.");
      } finally {
        setLoading(false);
      }
    };

    loadWorkflowData();

    // Clean up canvas store when leaving builder page
    return () => {
      clearCanvas();
    };
  }, [activeWorkspace?.id, workflowId, clearCanvas, setEdges, setNodes]);

  // Auto switch RHS panel to config mode when a node is clicked/selected
  useEffect(() => {
    if (selectedNodeId) {
      Promise.resolve().then(() => setRhsView("config"));
    }
  }, [selectedNodeId]);

  // Rename workflow header
  const handleSaveTitle = async () => {
    if (!activeWorkspace?.id || !workflowId || !titleInput.trim()) return;
    try {
      setSavingTitle(true);
      const wfRef = doc(db, "workspaces", activeWorkspace.id, "workflows", workflowId);
      await updateDoc(wfRef, {
        name: titleInput.trim(),
        updatedAt: new Date(),
      });
      setWorkflow((prev) => (prev ? { ...prev, name: titleInput.trim() } : null));
      setEditingTitle(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSavingTitle(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-4 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
            Loading Canvas Workspace...
          </p>
        </div>
      </div>
    );
  }

  if (error || !workflow) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-black p-6 text-center space-y-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h3 className="text-base font-bold text-foreground">Failed to Load Builder</h3>
        <p className="text-xs text-muted-foreground max-w-sm leading-normal">
          {error || "An unexpected database synchronization issue occurred."}
        </p>
        <Button variant="outline" size="sm" onClick={() => router.push("/dashboard/workflows")}>
          Return to Workflows
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-black text-foreground overflow-hidden font-sans relative">
      {/* Visual Canvas Background grid elements */}
      <div className="absolute inset-0 canvas-grid opacity-20 pointer-events-none" />

      {/* Top Header navbar */}
      <header className="flex h-14 items-center justify-between px-4 border-b border-border bg-card/45 backdrop-blur-md z-20 shrink-0 select-none">
        <div className="flex items-center gap-4 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/dashboard/workflows")}
            className="h-8 w-8 text-muted-foreground hover:text-foreground shrink-0 border border-border/40"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-2 min-w-0">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-primary/20 text-primary">
              <GitBranch className="h-3.5 w-3.5" />
            </div>
            
            {/* Title click-to-edit inline editor */}
            {editingTitle ? (
              <div className="flex items-center gap-1.5 min-w-0">
                <input
                  type="text"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  onBlur={handleSaveTitle}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveTitle();
                  }}
                  autoFocus
                  disabled={savingTitle}
                  className="h-8 w-44 rounded-md border border-input bg-zinc-950 px-2 py-1 text-xs font-semibold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-primary text-foreground"
                />
              </div>
            ) : (
              <div
                onClick={() => setEditingTitle(true)}
                className="group flex items-center gap-2 cursor-pointer min-w-0"
              >
                <span className="font-bold text-xs text-foreground group-hover:text-primary transition-colors truncate">
                  {workflow.name}
                </span>
                <Edit2 className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </div>
            )}
          </div>
        </div>

        {/* Global toggles in right header menu */}
        <div className="flex items-center gap-2.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              selectNode(null);
              setRhsView("ai");
            }}
            className={cn(
              "h-8 text-xs gap-1.5 px-3 border border-border/50",
              rhsView === "ai"
                ? "bg-primary/10 text-primary border-primary/20 hover:bg-primary/15"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Sparkles className="h-3.5 w-3.5" />
            AI Copilot
          </Button>

          {selectedNodeId && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setRhsView("config")}
              className={cn(
                "h-8 text-xs gap-1.5 px-3 border border-border/50",
                rhsView === "config"
                  ? "bg-primary/10 text-primary border-primary/20 hover:bg-primary/15"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Settings className="h-3.5 w-3.5" />
              Node Settings
            </Button>
          )}
        </div>
      </header>

      {/* Main Builder layout content */}
      <div className="flex-1 flex min-h-0 relative">
        {/* LHS Panel: Node templates palette selector */}
        <NodeSelectorSidebar />

        {/* Center Panel: React Flow canvas viewport */}
        <WorkflowBuilder workflowId={workflowId} />

        {/* RHS Panel: Config dashboard or AI Assistant sidebar */}
        <div className="h-full flex z-10 shrink-0 select-none">
          {rhsView === "ai" ? <AiCopilotSidebar /> : <SidebarConfigPanel />}
        </div>
      </div>
    </div>
  );
}
