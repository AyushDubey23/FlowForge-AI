"use client";

import React from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import {
  Zap,
  Globe,
  Sparkles,
  Mail,
  GitFork,
  RefreshCw,
  Clock,
  Database,
  HardDrive,
  Bell,
  Play,
  Timer,
  FileCode,
  Trash2,
  Copy,
} from "lucide-react";
import { useWorkflowStore } from "../store/useWorkflowStore";
import { cn } from "@/lib/utils";

// Map types to premium styling & icons
const nodeConfig: Record<
  string,
  {
    icon: React.ReactNode;
    colorClass: string;
    bgClass: string;
    borderClass: string;
    category: "trigger" | "action" | "logic";
  }
> = {
  // Triggers
  webhook: {
    icon: <Zap className="h-4 w-4" />,
    colorClass: "text-purple-400",
    bgClass: "bg-purple-950/20",
    borderClass: "border-purple-500/30 group-hover:border-purple-500/50",
    category: "trigger",
  },
  manual: {
    icon: <Play className="h-4 w-4" />,
    colorClass: "text-fuchsia-400",
    bgClass: "bg-fuchsia-950/20",
    borderClass: "border-fuchsia-500/30 group-hover:border-fuchsia-500/50",
    category: "trigger",
  },
  timer: {
    icon: <Timer className="h-4 w-4" />,
    colorClass: "text-violet-400",
    bgClass: "bg-violet-950/20",
    borderClass: "border-violet-500/30 group-hover:border-violet-500/50",
    category: "trigger",
  },
  // Actions
  http: {
    icon: <Globe className="h-4 w-4" />,
    colorClass: "text-blue-400",
    bgClass: "bg-blue-950/20",
    borderClass: "border-blue-500/30 group-hover:border-blue-500/50",
    category: "action",
  },
  aiPrompt: {
    icon: <Sparkles className="h-4 w-4" />,
    colorClass: "text-indigo-400",
    bgClass: "bg-indigo-950/20",
    borderClass: "border-indigo-500/30 group-hover:border-indigo-500/50",
    category: "action",
  },
  email: {
    icon: <Mail className="h-4 w-4" />,
    colorClass: "text-sky-400",
    bgClass: "bg-sky-950/20",
    borderClass: "border-sky-500/30 group-hover:border-sky-500/50",
    category: "action",
  },
  firestore: {
    icon: <Database className="h-4 w-4" />,
    colorClass: "text-cyan-400",
    bgClass: "bg-cyan-950/20",
    borderClass: "border-cyan-500/30 group-hover:border-cyan-500/50",
    category: "action",
  },
  storage: {
    icon: <HardDrive className="h-4 w-4" />,
    colorClass: "text-teal-400",
    bgClass: "bg-teal-950/20",
    borderClass: "border-teal-500/30 group-hover:border-teal-500/50",
    category: "action",
  },
  notification: {
    icon: <Bell className="h-4 w-4" />,
    colorClass: "text-pink-400",
    bgClass: "bg-pink-950/20",
    borderClass: "border-pink-500/30 group-hover:border-pink-500/50",
    category: "action",
  },
  js: {
    icon: <FileCode className="h-4 w-4" />,
    colorClass: "text-emerald-400",
    bgClass: "bg-emerald-950/20",
    borderClass: "border-emerald-500/30 group-hover:border-emerald-500/50",
    category: "action",
  },
  // Logic
  condition: {
    icon: <GitFork className="h-4 w-4" />,
    colorClass: "text-amber-400",
    bgClass: "bg-amber-950/20",
    borderClass: "border-amber-500/30 group-hover:border-amber-500/50",
    category: "logic",
  },
  loop: {
    icon: <RefreshCw className="h-4 w-4" />,
    colorClass: "text-orange-400",
    bgClass: "bg-orange-950/20",
    borderClass: "border-orange-500/30 group-hover:border-orange-500/50",
    category: "logic",
  },
  delay: {
    icon: <Clock className="h-4 w-4" />,
    colorClass: "text-yellow-400",
    bgClass: "bg-yellow-950/20",
    borderClass: "border-yellow-500/30 group-hover:border-yellow-500/50",
    category: "logic",
  },
};

export const CustomNode: React.FC<NodeProps> = ({ id, type, data, selected }) => {
  const { deleteWorkflowNode, duplicateWorkflowNode, selectNode } = useWorkflowStore();
  const nodeType = type || "http";
  const dataVal = data as unknown as Record<string, string | number | boolean | undefined>;
  const config = nodeConfig[nodeType] || {
    icon: <Zap className="h-4 w-4" />,
    colorClass: "text-gray-400",
    bgClass: "bg-zinc-900",
    borderClass: "border-zinc-800",
    category: "action",
  };

  const isTrigger = config.category === "trigger";
  const isCondition = nodeType === "condition";

  return (
    <div
      onClick={() => selectNode(id)}
      className={cn(
        "group w-64 rounded-xl border bg-card/90 shadow-lg transition-all duration-200 glass-panel",
        config.borderClass,
        selected ? "ring-2 ring-primary ring-offset-2 ring-offset-black border-primary/50" : ""
      )}
    >
      {/* Target input handle (Only if not a trigger) */}
      {!isTrigger && (
        <Handle
          type="target"
          position={Position.Left}
          className="w-2.5 h-2.5 !bg-zinc-800 !border-border !transition-all hover:!bg-primary hover:!scale-125"
        />
      )}

      {/* Node Header */}
      <div className="flex items-center justify-between p-3.5 border-b border-border/60">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-border/80", config.bgClass, config.colorClass)}>
            {config.icon}
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-foreground truncate leading-none mb-1">
              {dataVal.label}
            </h4>
            <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider leading-none">
              {nodeType}
            </p>
          </div>
        </div>

        {/* Quick action buttons (copy, delete) */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 shrink-0 ml-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              duplicateWorkflowNode(id);
            }}
            className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
            title="Duplicate Node"
          >
            <Copy className="h-3 w-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteWorkflowNode(id);
            }}
            className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
            title="Delete Node"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Node Body / Summary Info */}
      <div className="p-3 text-[10px] text-muted-foreground leading-normal font-medium bg-zinc-950/20">
        {nodeType === "webhook" && (
          <div className="font-mono truncate bg-zinc-950/50 p-1.5 rounded border border-border/40 select-all">
            {dataVal.webhookUrl ? String(dataVal.webhookUrl).substring(0, 32) + "..." : "No URL"}
          </div>
        )}
        {nodeType === "http" && (
          <div className="flex items-center justify-between font-mono bg-zinc-950/50 p-1.5 rounded border border-border/40">
            <span className="text-blue-400 font-bold shrink-0">{dataVal.method || "GET"}</span>
            <span className="truncate ml-2">{dataVal.url || "https://..."}</span>
          </div>
        )}
        {nodeType === "aiPrompt" && (
          <p className="line-clamp-2 italic font-mono bg-zinc-950/40 p-1.5 rounded border border-border/30">
            &quot;{dataVal.prompt || "Write your prompt..."}&quot;
          </p>
        )}
        {nodeType === "email" && (
          <div className="space-y-1">
            <div className="truncate">To: <span className="font-bold text-foreground">{dataVal.to || "Not set"}</span></div>
            <div className="truncate">Subject: <span className="italic">{dataVal.subject || "No subject"}</span></div>
          </div>
        )}
        {nodeType === "condition" && (
          <div className="font-mono bg-zinc-950/50 p-1.5 rounded border border-border/40 truncate text-amber-300">
            if ({dataVal.expression || "true"})
          </div>
        )}
        {nodeType === "delay" && (
          <div className="flex items-center gap-1 font-semibold text-foreground">
            <Clock className="h-3.5 w-3.5 text-yellow-500" />
            Wait for {dataVal.delaySeconds || 60} seconds
          </div>
        )}
        {nodeType === "js" && (
          <div className="font-mono truncate text-emerald-400 text-[9px] bg-zinc-950/60 p-1.5 rounded border border-border/40">
            {dataVal.code ? String(dataVal.code).split("\n")[0] : "// code..."}
          </div>
        )}
        {!["webhook", "http", "aiPrompt", "email", "condition", "delay", "js"].includes(nodeType) && (
          <p className="truncate text-muted-foreground italic">
            {dataVal.description || "Click to configure parameters."}
          </p>
        )}
      </div>

      {/* Source output handle */}
      {isCondition ? (
        <>
          {/* Conditional Branch Handles: True & False */}
          <div className="absolute right-0 top-1/3 translate-x-1/2 flex items-center">
            <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950/75 border border-emerald-500/20 px-1 py-0.2 rounded shrink-0 mr-1.5 leading-none">
              True
            </span>
            <Handle
              type="source"
              id="true"
              position={Position.Right}
              className="w-2.5 h-2.5 !bg-emerald-500 !border-border !transition-all hover:!bg-emerald-400 hover:!scale-125"
              style={{ top: "35%" }}
            />
          </div>
          <div className="absolute right-0 bottom-1/3 translate-x-1/2 flex items-center">
            <span className="text-[9px] font-bold text-destructive bg-destructive/15 border border-destructive/20 px-1 py-0.2 rounded shrink-0 mr-1.5 leading-none">
              False
            </span>
            <Handle
              type="source"
              id="false"
              position={Position.Right}
              className="w-2.5 h-2.5 !bg-destructive !border-border !transition-all hover:!bg-destructive/80 hover:!scale-125"
              style={{ top: "65%" }}
            />
          </div>
        </>
      ) : (
        /* Regular Output Handle */
        <Handle
          type="source"
          position={Position.Right}
          className="w-2.5 h-2.5 !bg-zinc-800 !border-border !transition-all hover:!bg-primary hover:!scale-125"
        />
      )}
    </div>
  );
};
CustomNode.displayName = "CustomNode";
