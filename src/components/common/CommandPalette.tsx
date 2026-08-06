"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Command,
  LayoutDashboard,
  GitBranch,
  Settings,
  BookOpen,
  Plus,
  LogOut,
  FolderOpen,
} from "lucide-react";
import { useAuth } from "@/features/auth/context/AuthContext";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface CommandItem {
  icon: React.ReactNode;
  label: string;
  category: "Navigation" | "Actions" | "Resources";
  action: () => void;
}

export const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [workflows, setWorkflows] = useState<Array<{ id: string; name: string }>>([]);
  const router = useRouter();
  const { logout, activeWorkspace } = useAuth();
  const overlayRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch workflows in active workspace for quick navigation
  useEffect(() => {
    if (!activeWorkspace?.id) return;
    const fetchWfs = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(db, "workspaces", activeWorkspace.id, "workflows")
        );
        const list = querySnapshot.docs.map((d) => ({
          id: d.id,
          name: d.data().name || "Untitled Workflow",
        }));
        setWorkflows(list);
      } catch {
        // Silent fail if permissions or keys missing
      }
    };
    fetchWfs();
  }, [activeWorkspace?.id, isOpen]);

  // Toggle Command Palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Autofocus input instantly when opened (Raycast style: 0ms delay)
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setSelectedIndex(0);
      setQuery("");
    }
  }, [isOpen]);

  const handleClose = () => setIsOpen(false);

  // Define global command items
  const baseCommands: CommandItem[] = [
    {
      icon: <LayoutDashboard className="h-4 w-4" />,
      label: "Go to Dashboard",
      category: "Navigation",
      action: () => {
        router.push("/dashboard");
        handleClose();
      },
    },
    {
      icon: <GitBranch className="h-4 w-4" />,
      label: "Go to Workflows",
      category: "Navigation",
      action: () => {
        router.push("/dashboard/workflows");
        handleClose();
      },
    },
    {
      icon: <Settings className="h-4 w-4" />,
      label: "Go to Settings",
      category: "Navigation",
      action: () => {
        router.push("/dashboard/settings");
        handleClose();
      },
    },
    {
      icon: <Plus className="h-4 w-4" />,
      label: "Create New Workflow",
      category: "Actions",
      action: async () => {
        if (!activeWorkspace) return;
        try {
          const workflowRef = collection(db, "workspaces", activeWorkspace.id, "workflows");
          const docRef = await addDoc(workflowRef, {
            name: "Untitled Workflow",
            description: "Build automations using natural language.",
            isActive: false,
            latestVersionNumber: 1,
            activeVersionId: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          
          // Create initial version
          const versionRef = collection(db, "workspaces", activeWorkspace.id, "workflows", docRef.id, "versions");
          await addDoc(versionRef, {
            versionNumber: 1,
            nodes: [],
            edges: [],
            createdBy: "User",
            description: "Initial Version",
            isPublished: false,
            createdAt: new Date(),
          });

          router.push(`/dashboard/builder/${docRef.id}`);
          handleClose();
        } catch (e) {
          console.error("Failed to create workflow:", e);
        }
      },
    },
    {
      icon: <BookOpen className="h-4 w-4" />,
      label: "Open Documentation",
      category: "Resources",
      action: () => {
        router.push("/docs");
        handleClose();
      },
    },
    {
      icon: <LogOut className="h-4 w-4" />,
      label: "Sign Out",
      category: "Actions",
      action: () => {
        logout();
        router.push("/login");
        handleClose();
      },
    },
  ];

  // Dynamic commands matching workspace workflows
  const workflowCommands: CommandItem[] = workflows.map((wf) => ({
    icon: <FolderOpen className="h-4 w-4" />,
    label: `Open Workflow: ${wf.name}`,
    category: "Navigation",
    action: () => {
      router.push(`/dashboard/builder/${wf.id}`);
      handleClose();
    },
  }));

  const allCommands = [...baseCommands, ...workflowCommands];

  // Filter commands by search query
  const filteredCommands = allCommands.filter((cmd) =>
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
      }
    } else if (e.key === "Escape") {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      onClick={(e) => {
        if (e.target === overlayRef.current) handleClose();
      }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[15vh] px-4 z-50 animate-fade-in font-sans"
    >
      <div className="w-full max-w-lg border border-border bg-card/95 rounded-xl shadow-2xl glass-panel flex flex-col overflow-hidden max-h-[50vh]">
        {/* Search Input bar */}
        <div className="flex items-center px-4 border-b border-border/80 gap-3">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search workflows..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            className="w-full py-4 text-sm bg-transparent outline-none border-none placeholder-muted-foreground text-foreground"
          />
          <div className="flex items-center gap-1 bg-muted px-2 py-0.5 rounded border border-border/60 text-[10px] text-muted-foreground font-mono uppercase">
            <Command className="h-3 w-3" />
            <span>K</span>
          </div>
        </div>

        {/* Command list content */}
        <div className="flex-1 overflow-y-auto p-2">
          {filteredCommands.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground font-medium">
              No results found for &quot;{query}&quot;
            </div>
          ) : (
            <div>
              {/* Group commands by category */}
              {["Navigation", "Actions", "Resources"].map((cat) => {
                const catItems = filteredCommands.filter((cmd) => cmd.category === cat);
                if (catItems.length === 0) return null;
                return (
                  <div key={cat} className="space-y-1 mt-2 first:mt-0">
                    <div className="px-3 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      {cat}
                    </div>
                    {catItems.map((cmd) => {
                      const absoluteIndex = filteredCommands.indexOf(cmd);
                      const isSelected = absoluteIndex === selectedIndex;
                      return (
                        <button
                          key={cmd.label}
                          onClick={cmd.action}
                          onMouseEnter={() => setSelectedIndex(absoluteIndex)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-xs font-semibold transition-all duration-150 ${
                            isSelected
                              ? "bg-primary text-primary-foreground shadow shadow-primary/20"
                              : "text-foreground hover:bg-muted"
                          }`}
                        >
                          {cmd.icon}
                          <span className="flex-1 truncate">{cmd.label}</span>
                          {isSelected && (
                            <span className="text-[10px] font-medium opacity-80 shrink-0 font-mono">
                              ↵ Enter
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
