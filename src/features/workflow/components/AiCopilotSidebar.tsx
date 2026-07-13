"use client";

import React, { useState } from "react";
import { Sparkles, MessageSquare, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWorkflowStore } from "../store/useWorkflowStore";
import { cn } from "@/lib/utils";

interface ChatMessage {
  sender: "user" | "ai";
  text: string;
  isHtml?: boolean;
}

export const AiCopilotSidebar: React.FC = () => {
  const { nodes, edges, setNodes, setEdges, clearCanvas } = useWorkflowStore();
  const [tab, setTab] = useState<"generate" | "assistant">("generate");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [warning, setWarning] = useState<string | null>(null);

  // Assistant states
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "ai",
      text: "Hello! I am your FlowForge AI copilot. Click one of the quick actions below, or ask me questions about your workflow layout.",
    },
  ]);
  const [assistantLoading, setAssistantLoading] = useState(false);

  // Generate complete workflow from natural language
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    try {
      setLoading(true);
      setWarning(null);
      
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      const res = await response.json();

      if (res.success) {
        // Overwrite canvas with AI generated layout
        clearCanvas();
        setNodes(res.nodes);
        setEdges(res.edges);
        
        if (res.isMock) {
          setWarning("AI Sandbox Mode: Generated a template workflow. Configure your GEMINI_API_KEY in .env.local to activate dynamic custom generations.");
        }
        
        // Push explanation to message list
        setTab("assistant");
        setMessages((prev) => [
          ...prev,
          { sender: "user", text: `Generate: ${prompt}` },
          { sender: "ai", text: `### Workflow Generated!\n\n${res.explanation || "I've assembled the nodes and edges on your canvas. Click on any node to view details."}` },
        ]);
        setPrompt("");
      } else {
        setWarning(res.error || "Failed to process workflow instruction.");
      }
    } catch (err) {
      console.error(err);
      setWarning("Failed to connect to AI server endpoints.");
    } finally {
      setLoading(false);
    }
  };

  // Trigger Chat Assistant quick actions
  const handleQuickAction = async (action: "explain" | "optimize" | "suggest") => {
    try {
      setAssistantLoading(true);
      setWarning(null);

      // Append user instruction
      const actionLabels = {
        explain: "Explain this workflow",
        optimize: "Optimize connections and logs",
        suggest: "Suggest structural improvements",
      };

      setMessages((prev) => [
        ...prev,
        { sender: "user", text: actionLabels[action] },
      ]);

      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, nodes, edges }),
      });

      const res = await response.json();

      if (res.success) {
        if (res.isMock) {
          setWarning("AI Sandbox Mode: Showing simulated logs output. Connect GEMINI_API_KEY to unlock live GPT-style diagnostic reports.");
        }
        setMessages((prev) => [
          ...prev,
          { sender: "ai", text: res.response },
        ]);
      } else {
        setWarning(res.error || "Failed to analyze workflow state.");
      }
    } catch (err) {
      console.error(err);
      setWarning("Failed to connect to AI copilot service.");
    } finally {
      setAssistantLoading(false);
    }
  };

  return (
    <div className="w-80 border-l border-border bg-card/30 backdrop-blur-md flex flex-col h-full overflow-hidden font-sans shrink-0">
      {/* Sidebar Navigation TABS */}
      <div className="flex border-b border-border/80 shrink-0 bg-zinc-950/20">
        <button
          onClick={() => setTab("generate")}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-bold border-b-2 transition-all",
            tab === "generate"
              ? "border-primary text-primary bg-primary/5"
              : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
          )}
        >
          <Sparkles className="h-4 w-4" />
          AI Copilot
        </button>
        <button
          onClick={() => setTab("assistant")}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-bold border-b-2 transition-all",
            tab === "assistant"
              ? "border-primary text-primary bg-primary/5"
              : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
          )}
        >
          <MessageSquare className="h-4 w-4" />
          Assistant
        </button>
      </div>

      {/* Warning banner display */}
      {warning && (
        <div className="p-3 bg-amber-500/10 border-b border-amber-500/20 text-[10px] text-amber-300 font-medium flex gap-1.5 items-start leading-normal shrink-0">
          <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
          <span>{warning}</span>
        </div>
      )}

      {/* Tab panel contents */}
      <div className="flex-1 flex flex-col min-h-0">
        {tab === "generate" && (
          <div className="flex-1 flex flex-col p-4 justify-between h-full overflow-y-auto">
            <div className="space-y-4">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                Workflow Builder
              </span>
              <h4 className="text-xs font-bold text-foreground leading-normal">
                Assemble flows using natural language commands.
              </h4>
              <p className="text-[10px] text-muted-foreground leading-normal font-medium">
                Describe the trigger rules and actions you want to run. Gemini will generate the nodes, connect edges, and pre-initialize parameters on your canvas.
              </p>
              
              <div className="rounded-lg border border-border/80 bg-zinc-950/40 p-3 space-y-2 text-[10px] font-mono leading-relaxed text-muted-foreground">
                <span className="text-primary font-bold text-[9px] uppercase tracking-wider block">
                  Example Prompt:
                </span>
                <p>&quot;Whenever someone calls a Github webhook, summarize details using AI, then post a notification to Discord.&quot;</p>
              </div>
            </div>

            <form onSubmit={handleGenerate} className="mt-6 space-y-3.5">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your automation in plain English..."
                rows={4}
                required
                disabled={loading}
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-primary disabled:opacity-50"
              />
              <Button type="submit" variant="primary" className="w-full h-10 font-bold" isLoading={loading}>
                Generate Automation
              </Button>
            </form>
          </div>
        )}

        {tab === "assistant" && (
          <div className="flex-1 flex flex-col min-h-0 h-full">
            {/* Scrollable message timeline */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex flex-col max-w-[85%] rounded-lg p-2.5 text-xs leading-relaxed",
                    msg.sender === "user"
                      ? "bg-primary text-primary-foreground self-end ml-auto"
                      : "bg-zinc-950/40 border border-border/85 text-foreground self-start mr-auto"
                  )}
                >
                  {/* Clean custom renderer for simple markdown tags in AI replies */}
                  <div className="space-y-1 whitespace-pre-line font-sans font-medium text-[11px]">
                    {msg.text
                      .replace(/### (.*)/g, "$1") // Simplify titles
                      .replace(/\*\*(.*)\*\*/g, "$1") // Simplify bold
                    }
                  </div>
                </div>
              ))}
              {assistantLoading && (
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-semibold px-2 py-1">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                  AI is analyzing diagram...
                </div>
              )}
            </div>

            {/* Quick action buttons panel */}
            <div className="p-3 border-t border-border/80 bg-zinc-950/20 shrink-0 grid grid-cols-3 gap-1.5">
              <Button
                variant="outline"
                size="sm"
                className="text-[9px] font-bold p-1 h-7 border-border/60 hover:bg-white/5"
                onClick={() => handleQuickAction("explain")}
                disabled={assistantLoading || nodes.length === 0}
              >
                Explain Flow
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-[9px] font-bold p-1 h-7 border-border/60 hover:bg-white/5"
                onClick={() => handleQuickAction("optimize")}
                disabled={assistantLoading || nodes.length === 0}
              >
                Optimize
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-[9px] font-bold p-1 h-7 border-border/60 hover:bg-white/5"
                onClick={() => handleQuickAction("suggest")}
                disabled={assistantLoading || nodes.length === 0}
              >
                Suggest
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default AiCopilotSidebar;
