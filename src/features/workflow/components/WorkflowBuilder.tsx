"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useWorkflowStore } from "../store/useWorkflowStore";
import { CustomNode } from "./CustomNode";
import { useAuth } from "@/features/auth/context/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Loader2,
  Undo2,
  Redo2,
  Play,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface BuilderProps {
  workflowId: string;
}

const nodeTypes = {
  webhook: CustomNode,
  manual: CustomNode,
  timer: CustomNode,
  http: CustomNode,
  aiPrompt: CustomNode,
  email: CustomNode,
  firestore: CustomNode,
  storage: CustomNode,
  notification: CustomNode,
  js: CustomNode,
  condition: CustomNode,
  loop: CustomNode,
  delay: CustomNode,
};

// Internal Canvas Wrapper to access useReactFlow
const Canvas: React.FC<{ workflowId: string }> = ({ workflowId }) => {
  const { activeWorkspace } = useAuth();
  const reactFlowInstance = useReactFlow();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addWorkflowNode,
    undo,
    redo,
    undoStack,
    redoStack,
  } = useWorkflowStore();

  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("saved");

  // Keyboard Shortcuts for Undo & Redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "z") {
        e.preventDefault();
        undo();
      } else if ((e.metaKey || e.ctrlKey) && e.key === "y") {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  // Debounced auto-saving to Firestore
  useEffect(() => {
    if (nodes.length === 0 && edges.length === 0) return;
    if (!activeWorkspace?.id || !workflowId) return;

    const saveInit = setTimeout(() => {
      setSaveStatus("saving");
    }, 0);
    const delayDebounceFn = setTimeout(async () => {
      try {
        // Fetch activeVersionId first (for production structure) or save to workflow draft.
        // For simplicity and high scalability, we will save to root workflow draft snapshot
        // and a subcollection "versions" under "activeVersionId" if set.
        const wfRef = doc(db, "workspaces", activeWorkspace.id, "workflows", workflowId);
        
        await updateDoc(wfRef, {
          updatedAt: new Date(),
        });

        // Let's also save the nodes and edges arrays directly under the active version snapshot!
        // We'll write to workspaces/{wsId}/workflows/{wfId}/versions/v1 or similar activeVersionId.
        // Let's first search if we can query activeVersionId from our workflow metadata.
        // For now, let's commit the current canvas snapshot to a subcollection "versions/v1" or standard draft
        const verRef = doc(db, "workspaces", activeWorkspace.id, "workflows", workflowId, "versions", "draft_v1");
        await updateDoc(verRef, {
          nodes: JSON.parse(JSON.stringify(nodes)),
          edges: JSON.parse(JSON.stringify(edges)),
          updatedAt: new Date(),
        }).catch(async () => {
          // If update fails (doc doesn't exist), let's set it!
          const { setDoc } = await import("firebase/firestore");
          await setDoc(verRef, {
            versionNumber: 1,
            nodes: JSON.parse(JSON.stringify(nodes)),
            edges: JSON.parse(JSON.stringify(edges)),
            createdBy: "User",
            description: "Auto Saved Canvas",
            isPublished: false,
            createdAt: new Date(),
          });
        });

        setSaveStatus("saved");
      } catch (err) {
        console.error("Auto save failed:", err);
        setSaveStatus("error");
      }
    }, 1500); // 1.5s debounce duration

    return () => {
      clearTimeout(saveInit);
      clearTimeout(delayDebounceFn);
    };
  }, [nodes, edges, activeWorkspace?.id, workflowId]);

  // Drag and Drop handlers
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();

    const type = e.dataTransfer.getData("application/reactflow");
    if (!type || !reactFlowWrapper.current) return;

    const rect = reactFlowWrapper.current.getBoundingClientRect();
    const position = reactFlowInstance.screenToFlowPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });

    addWorkflowNode(type, position);
  };

  return (
    <div className="flex-1 flex flex-col h-full relative" ref={reactFlowWrapper}>
      {/* Top Builder Canvas Header Actions overlay */}
      <div className="absolute top-4 left-4 right-4 h-12 flex items-center justify-between z-10 pointer-events-none">
        {/* Save Cloud Status Widget */}
        <div className="pointer-events-auto flex items-center gap-2 bg-zinc-950/85 border border-border px-3.5 py-1.5 rounded-xl shadow-lg glass-panel text-xs font-semibold select-none">
          {saveStatus === "saving" && (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span className="text-muted-foreground animate-pulse">Syncing nodes...</span>
            </>
          )}
          {saveStatus === "saved" && (
            <>
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              <span className="text-foreground/90">Changes saved to cloud</span>
            </>
          )}
          {saveStatus === "error" && (
            <>
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <span className="text-destructive font-bold">Offline: Sync Failed</span>
            </>
          )}
        </div>

        {/* Action button triggers (Undo, Redo, Run) */}
        <div className="pointer-events-auto flex items-center gap-2 bg-zinc-950/85 border border-border p-1.5 rounded-xl shadow-lg glass-panel">
          <Button
            variant="ghost"
            size="icon"
            onClick={undo}
            disabled={undoStack.length === 0}
            className="h-8 w-8 text-muted-foreground hover:text-foreground disabled:opacity-30"
          >
            <Undo2 className="h-4.5 w-4.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={redo}
            disabled={redoStack.length === 0}
            className="h-8 w-8 text-muted-foreground hover:text-foreground disabled:opacity-30"
          >
            <Redo2 className="h-4.5 w-4.5" />
          </Button>
          <div className="w-[1px] bg-border h-6 my-1" />
          <Button
            variant="primary"
            size="sm"
            className="h-8 gap-1.5 px-3.5 bg-emerald-600 hover:bg-emerald-500 text-white border-none shadow shadow-emerald-500/20"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            Run Test
          </Button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDragOver={onDragOver}
        onDrop={onDrop}
        nodeTypes={nodeTypes}
        fitView
        className="canvas-grid"
      >
        <Background gap={24} size={1} color="rgba(255,255,255,0.06)" />
        <Controls showInteractive={false} className="!bg-card !border-border !rounded-lg !shadow-xl" />
        <MiniMap
          style={{ height: 100, width: 150 }}
          nodeColor="rgba(255,255,255,0.12)"
          maskColor="rgba(0,0,0,0.6)"
          className="!bg-card !border-border !rounded-lg !shadow-xl !overflow-hidden"
        />
      </ReactFlow>
    </div>
  );
};

export const WorkflowBuilder: React.FC<BuilderProps> = ({ workflowId }) => {
  return (
    <ReactFlowProvider>
      <Canvas workflowId={workflowId} />
    </ReactFlowProvider>
  );
};
export default WorkflowBuilder;
