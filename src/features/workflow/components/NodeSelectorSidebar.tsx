"use client";

import React from "react";
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
} from "lucide-react";
import { useWorkflowStore } from "../store/useWorkflowStore";
import { cn } from "@/lib/utils";

interface NodeTemplate {
  type: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  colorClass: string;
  bgClass: string;
}

const templates: Record<"Triggers" | "Actions" | "Logic", NodeTemplate[]> = {
  Triggers: [
    {
      type: "webhook",
      label: "Webhook",
      description: "Trigger flow using external web requests.",
      icon: <Zap className="h-4 w-4" />,
      colorClass: "text-purple-400",
      bgClass: "bg-purple-950/20 border-purple-500/20",
    },
    {
      type: "manual",
      label: "Manual Trigger",
      description: "Trigger flow manually with variables.",
      icon: <Play className="h-4 w-4" />,
      colorClass: "text-fuchsia-400",
      bgClass: "bg-fuchsia-950/20 border-fuchsia-500/20",
    },
    {
      type: "timer",
      label: "Timer Trigger",
      description: "Run flow on cron schedules or intervals.",
      icon: <Timer className="h-4 w-4" />,
      colorClass: "text-violet-400",
      bgClass: "bg-violet-950/20 border-violet-500/20",
    },
  ],
  Actions: [
    {
      type: "http",
      label: "HTTP Request",
      description: "Send dynamic REST API request payload.",
      icon: <Globe className="h-4 w-4" />,
      colorClass: "text-blue-400",
      bgClass: "bg-blue-950/20 border-blue-500/20",
    },
    {
      type: "aiPrompt",
      label: "AI Prompt (Gemini)",
      description: "Generate responses or transform inputs.",
      icon: <Sparkles className="h-4 w-4" />,
      colorClass: "text-indigo-400",
      bgClass: "bg-indigo-950/20 border-indigo-500/20",
    },
    {
      type: "email",
      label: "Send Email",
      description: "Deliver SMTP notifications or summaries.",
      icon: <Mail className="h-4 w-4" />,
      colorClass: "text-sky-400",
      bgClass: "bg-sky-950/20 border-sky-500/20",
    },
    {
      type: "firestore",
      label: "Firestore",
      description: "Read or write data collection fields.",
      icon: <Database className="h-4 w-4" />,
      colorClass: "text-cyan-400",
      bgClass: "bg-cyan-950/20 border-cyan-500/20",
    },
    {
      type: "storage",
      label: "Cloud Storage",
      description: "Save outputs or read asset media logs.",
      icon: <HardDrive className="h-4 w-4" />,
      colorClass: "text-teal-400",
      bgClass: "bg-teal-950/20 border-teal-500/20",
    },
    {
      type: "notification",
      label: "Notification Alert",
      description: "Post payload messages to Slack/Discord.",
      icon: <Bell className="h-4 w-4" />,
      colorClass: "text-pink-400",
      bgClass: "bg-pink-950/20 border-pink-500/20",
    },
    {
      type: "js",
      label: "JavaScript Script",
      description: "Run sandboxed ES6 transformation scripts.",
      icon: <FileCode className="h-4 w-4" />,
      colorClass: "text-emerald-400",
      bgClass: "bg-emerald-950/20 border-emerald-500/20",
    },
  ],
  Logic: [
    {
      type: "condition",
      label: "Conditional (If/Else)",
      description: "Branch flows using custom expression test.",
      icon: <GitFork className="h-4 w-4" />,
      colorClass: "text-amber-400",
      bgClass: "bg-amber-950/20 border-amber-500/20",
    },
    {
      type: "loop",
      label: "Loop Iterator",
      description: "Loop execution over lists or arrays.",
      icon: <RefreshCw className="h-4 w-4" />,
      colorClass: "text-orange-400",
      bgClass: "bg-orange-950/20 border-orange-500/20",
    },
    {
      type: "delay",
      label: "Delay Timer",
      description: "Pause flow run execution for seconds.",
      icon: <Clock className="h-4 w-4" />,
      colorClass: "text-yellow-400",
      bgClass: "bg-yellow-950/20 border-yellow-500/20",
    },
  ],
};

export const NodeSelectorSidebar: React.FC = () => {
  const { addWorkflowNode } = useWorkflowStore();

  const onDragStart = (e: React.DragEvent, nodeType: string) => {
    e.dataTransfer.setData("application/reactflow", nodeType);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleClick = (nodeType: string) => {
    // Center of screen relative offset
    addWorkflowNode(nodeType, { x: 100, y: 150 });
  };

  return (
    <div className="w-72 border-r border-border bg-card/30 backdrop-blur-md flex flex-col h-full overflow-hidden font-sans shrink-0">
      <div className="p-4 border-b border-border/80">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Node Palette
        </h3>
        <p className="text-[10px] text-muted-foreground mt-0.5">
          Drag cards to canvas or click to add.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {Object.entries(templates).map(([category, items]) => (
          <div key={category} className="space-y-2">
            <h4 className="text-[10px] font-bold text-foreground/80 uppercase tracking-widest">
              {category}
            </h4>
            <div className="grid gap-2">
              {items.map((item) => (
                <div
                  key={item.type}
                  draggable
                  onDragStart={(e) => onDragStart(e, item.type)}
                  onClick={() => handleClick(item.type)}
                  className={cn(
                    "flex items-start gap-3 p-2.5 rounded-lg border bg-zinc-950/15 cursor-grab hover:bg-zinc-900/60 active:cursor-grabbing hover:border-primary/20 transition-all select-none group"
                  )}
                >
                  <div className={cn("flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-md border", item.bgClass, item.colorClass)}>
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <h5 className="text-[11px] font-bold text-foreground group-hover:text-primary transition-colors truncate">
                      {item.label}
                    </h5>
                    <p className="text-[9px] text-muted-foreground leading-normal line-clamp-2 mt-0.5 font-medium">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default NodeSelectorSidebar;
