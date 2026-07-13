"use client";

import React from "react";
import { useWorkflowStore } from "../store/useWorkflowStore";
import { Trash2, Copy, AlertCircle, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";

export const SidebarConfigPanel: React.FC = () => {
  const { nodes, selectedNodeId, updateNodeData, deleteWorkflowNode, duplicateWorkflowNode } =
    useWorkflowStore();

  const selectedNode = nodes.find((node) => node.id === selectedNodeId);

  if (!selectedNode) {
    return (
      <div className="w-80 border-l border-border bg-card/30 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center h-full font-sans shrink-0">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/20 text-muted-foreground mb-4">
          <Settings className="h-6 w-6" />
        </div>
        <h4 className="text-xs font-bold text-foreground">No node selected</h4>
        <p className="text-[10px] text-muted-foreground mt-1 max-w-[200px] leading-normal">
          Click any canvas node to edit its trigger configurations or action parameters.
        </p>
      </div>
    );
  }

  const type = selectedNode.type || "http";
  const data = selectedNode.data as unknown as Record<string, string | number | undefined>;

  // Generic data field updates
  const handleChange = (key: string, value: string | number | boolean) => {
    updateNodeData(selectedNode.id, { [key]: value });
  };

  return (
    <div className="w-80 border-l border-border bg-card/30 backdrop-blur-md flex flex-col h-full overflow-hidden font-sans shrink-0">
      {/* Panel Header */}
      <div className="p-4 border-b border-border/80 flex items-center justify-between shrink-0 bg-zinc-950/20">
        <div>
          <span className="text-[9px] text-primary font-bold uppercase tracking-widest leading-none block mb-1">
            Node Configuration
          </span>
          <h3 className="text-xs font-bold text-foreground capitalize truncate leading-none">
            {type.replace(/([A-Z])/g, " $1")} Settings
          </h3>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => duplicateWorkflowNode(selectedNode.id)}
            className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
            title="Duplicate Node"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => deleteWorkflowNode(selectedNode.id)}
            className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
            title="Delete Node"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Configuration Form Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Core fields (Label & description) */}
        <div className="space-y-3.5">
          <Input
            label="Node Custom Name"
            value={data.label || ""}
            onChange={(e) => handleChange("label", e.target.value)}
          />
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Node Description
            </label>
            <textarea
              value={data.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={2}
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs shadow-sm transition-all placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-primary"
            />
          </div>
        </div>

        <div className="border-t border-border/60 pt-4" />

        {/* Specialized Fields based on Node Type */}
        <div className="space-y-4">
          {type === "webhook" && (
            <div className="space-y-4 font-sans">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Webhook URL (Read Only)
                </label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={data.webhookUrl || ""}
                    readOnly
                    className="flex-1 h-9 rounded-md border border-border bg-zinc-950/60 px-3 text-[10px] font-mono text-foreground focus-visible:outline-none select-all"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  HTTP Method
                </label>
                <select
                  value={data.method || "POST"}
                  onChange={(e) => handleChange("method", e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-card px-3 py-1 text-xs shadow-sm transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-primary"
                >
                  <option value="POST">POST</option>
                  <option value="GET">GET</option>
                  <option value="PUT">PUT</option>
                </select>
              </div>
            </div>
          )}

          {type === "http" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  API Endpoint URL
                </label>
                <Input
                  placeholder="https://api.domain.com/v1/..."
                  value={data.url || ""}
                  onChange={(e) => handleChange("url", e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  HTTP Method
                </label>
                <select
                  value={data.method || "GET"}
                  onChange={(e) => handleChange("method", e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-card px-3 py-1 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-primary"
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Headers (JSON Format)
                </label>
                <textarea
                  value={data.headers || "{}"}
                  onChange={(e) => handleChange("headers", e.target.value)}
                  rows={3}
                  className="w-full rounded-md border border-input bg-zinc-950/30 px-3 py-2 text-xs font-mono focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Request Body (JSON)
                </label>
                <textarea
                  value={data.body || "{}"}
                  onChange={(e) => handleChange("body", e.target.value)}
                  rows={3}
                  className="w-full rounded-md border border-input bg-zinc-950/30 px-3 py-2 text-xs font-mono focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-primary"
                />
              </div>
            </div>
          )}

          {type === "aiPrompt" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Gemini System Prompt
                </label>
                <textarea
                  value={data.prompt || ""}
                  onChange={(e) => handleChange("prompt", e.target.value)}
                  rows={4}
                  placeholder="You are a helpful assistant. Summarize the following input data..."
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground">
                  <span>Temperature</span>
                  <span className="text-foreground">{data.temperature ?? 0.7}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={data.temperature ?? 0.7}
                  onChange={(e) => handleChange("temperature", parseFloat(e.target.value))}
                  className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
            </div>
          )}

          {type === "email" && (
            <div className="space-y-4">
              <Input
                label="Send To"
                placeholder="recipient@example.com"
                value={data.to || ""}
                onChange={(e) => handleChange("to", e.target.value)}
              />
              <Input
                label="Subject"
                placeholder="Workflow Update"
                value={data.subject || ""}
                onChange={(e) => handleChange("subject", e.target.value)}
              />
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Email Body (HTML Supported)
                </label>
                <textarea
                  value={data.body || ""}
                  onChange={(e) => handleChange("body", e.target.value)}
                  rows={5}
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-primary"
                />
              </div>
            </div>
          )}

          {type === "condition" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Condition Expression
                </label>
                <textarea
                  value={data.expression || ""}
                  onChange={(e) => handleChange("expression", e.target.value)}
                  rows={3}
                  placeholder="input.body.amount > 100"
                  className="w-full rounded-md border border-input bg-zinc-950/40 px-3 py-2 text-xs font-mono focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-primary"
                />
                <p className="text-[10px] text-muted-foreground flex gap-1.5 items-start mt-1 leading-normal">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0 text-amber-500 mt-0.5" />
                  Evaluate using sandboxed JS rules. Must return a boolean true/false output.
                </p>
              </div>
            </div>
          )}

          {type === "delay" && (
            <div className="space-y-4">
              <Input
                label="Delay Duration (Seconds)"
                type="number"
                min="1"
                placeholder="60"
                value={data.delaySeconds ?? 60}
                onChange={(e) => handleChange("delaySeconds", parseInt(e.target.value) || 0)}
              />
            </div>
          )}

          {type === "js" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  JavaScript Code Editor
                </label>
                <textarea
                  value={data.code || ""}
                  onChange={(e) => handleChange("code", e.target.value)}
                  rows={10}
                  className="w-full rounded-md border border-input bg-zinc-950/80 px-3 py-2.5 text-xs font-mono text-emerald-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-primary leading-relaxed"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default SidebarConfigPanel;
