"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/context/AuthContext";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Workflow, WorkflowVersion } from "@/types";
import {
  Plus,
  GitBranch,
  MoreVertical,
  Trash2,
  Copy,
  Edit2,
  Power,
  Search,
  ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { cn, formatDateTime } from "@/lib/utils";

export default function WorkflowsPage() {
  const { activeWorkspace, user } = useAuth();
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  
  // Modals state
  const [createOpen, setCreateOpen] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [descInput, setDescInput] = useState("");
  const [creating, setCreating] = useState(false);
  
  const [renameId, setRenameId] = useState<string | null>(null);
  const [renameInput, setRenameInput] = useState("");
  const [renaming, setRenaming] = useState(false);

  const router = useRouter();

  // Listen to Firestore workflows in workspace
  useEffect(() => {
    if (!activeWorkspace?.id) {
      Promise.resolve().then(() => setLoading(false));
      return;
    }

    Promise.resolve().then(() => setLoading(true));
    const wfsRef = collection(db, "workspaces", activeWorkspace.id, "workflows");
    const q = query(wfsRef, orderBy("updatedAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((docSnap) => ({
          ...docSnap.data(),
          id: docSnap.id,
        })) as Workflow[];
        setWorkflows(list);
        setLoading(false);
      },
      (err) => {
        console.error("Failed to read workflows:", err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [activeWorkspace?.id]);

  // Create a new workflow
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeWorkspace?.id || !nameInput.trim()) return;

    try {
      setCreating(true);
      const wfsCollection = collection(db, "workspaces", activeWorkspace.id, "workflows");
      
      // 1. Add root workflow document
      const newWfDoc = await addDoc(wfsCollection, {
        name: nameInput.trim(),
        description: descInput.trim() || "Build automations using natural language.",
        isActive: false,
        latestVersionNumber: 1,
        activeVersionId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // 2. Add version 1 subcollection document
      const versionsCollection = collection(
        db,
        "workspaces",
        activeWorkspace.id,
        "workflows",
        newWfDoc.id,
        "versions"
      );
      const newVersionDoc = await addDoc(versionsCollection, {
        versionNumber: 1,
        nodes: [],
        edges: [],
        createdBy: user?.displayName || "User",
        description: "Initial Draft version.",
        isPublished: false,
        createdAt: new Date(),
      });

      // 3. Update root workflow doc with version ID
      await updateDoc(doc(db, "workspaces", activeWorkspace.id, "workflows", newWfDoc.id), {
        activeVersionId: newVersionDoc.id,
      });

      setNameInput("");
      setDescInput("");
      setCreateOpen(false);
      
      // Redirect directly to the builder canvas
      router.push(`/dashboard/builder/${newWfDoc.id}`);
    } catch (err) {
      console.error("Error creating workflow:", err);
    } finally {
      setCreating(false);
    }
  };

  // Toggle active / running state
  const handleToggleActive = async (wf: Workflow) => {
    if (!activeWorkspace?.id) return;
    try {
      const docRef = doc(db, "workspaces", activeWorkspace.id, "workflows", wf.id);
      await updateDoc(docRef, {
        isActive: !wf.isActive,
        updatedAt: new Date(),
      });
    } catch (err) {
      console.error("Failed to toggle status:", err);
    }
  };

  // Rename workflow
  const handleRename = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeWorkspace?.id || !renameId || !renameInput.trim()) return;

    try {
      setRenaming(true);
      const docRef = doc(db, "workspaces", activeWorkspace.id, "workflows", renameId);
      await updateDoc(docRef, {
        name: renameInput.trim(),
        updatedAt: new Date(),
      });
      setRenameId(null);
      setRenameInput("");
    } catch (err) {
      console.error("Failed to rename workflow:", err);
    } finally {
      setRenaming(false);
    }
  };

  // Delete workflow
  const handleDelete = async (wfId: string) => {
    if (!activeWorkspace?.id || !window.confirm("Are you sure you want to delete this workflow? This will erase all execution histories and configurations.")) return;
    try {
      const docRef = doc(db, "workspaces", activeWorkspace.id, "workflows", wfId);
      await deleteDoc(docRef);
      setDropdownOpen(null);
    } catch (err) {
      console.error("Failed to delete workflow:", err);
    }
  };

  // Duplicate workflow (deep copy of latest version nodes/edges)
  const handleDuplicate = async (wf: Workflow) => {
    if (!activeWorkspace?.id) return;
    try {
      setDropdownOpen(null);
      
      // Fetch latest version structure
      const versionsRef = collection(
        db,
        "workspaces",
        activeWorkspace.id,
        "workflows",
        wf.id,
        "versions"
      );
      const snap = await getDocs(versionsRef);
      let sourceVersion: WorkflowVersion | null = null;
      
      if (!snap.empty) {
        // Grab the version with largest versionNumber
        const versions = snap.docs.map(d => d.data() as WorkflowVersion);
        versions.sort((a, b) => b.versionNumber - a.versionNumber);
        sourceVersion = versions[0];
      }

      // Create duplicated workflow root
      const wfsCollection = collection(db, "workspaces", activeWorkspace.id, "workflows");
      const duplicatedWfDoc = await addDoc(wfsCollection, {
        name: `${wf.name} (Copy)`,
        description: wf.description,
        isActive: false,
        latestVersionNumber: 1,
        activeVersionId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Create duplicated version copy
      const targetVersionsRef = collection(
        db,
        "workspaces",
        activeWorkspace.id,
        "workflows",
        duplicatedWfDoc.id,
        "versions"
      );
      const newVersionDoc = await addDoc(targetVersionsRef, {
        versionNumber: 1,
        nodes: sourceVersion?.nodes || [],
        edges: sourceVersion?.edges || [],
        createdBy: user?.displayName || "User",
        description: `Duplicated from ${wf.name}.`,
        isPublished: false,
        createdAt: new Date(),
      });

      await updateDoc(doc(db, "workspaces", activeWorkspace.id, "workflows", duplicatedWfDoc.id), {
        activeVersionId: newVersionDoc.id,
      });

    } catch (err) {
      console.error("Failed to duplicate workflow:", err);
    }
  };

  // Filter list
  const filteredWorkflows = workflows.filter(
    (wf) =>
      wf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wf.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full font-sans relative">
      {/* Top section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl overflow-hidden border border-white/20 shadow-[0_0_15px_rgba(99,102,241,0.35)] shrink-0">
            <Image
              src="/icon.png"
              alt="FlowForge Workflows"
              width={40}
              height={40}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Workflows</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Create, deploy, and manage your automated business visual flows.
            </p>
          </div>
        </div>
        <Button variant="primary" size="sm" onClick={() => setCreateOpen(true)} className="flex gap-2 shrink-0">
          <Plus className="h-4 w-4" />
          Create Workflow
        </Button>
      </div>

      {/* Search Input bar */}
      <div className="flex items-center bg-zinc-950/40 border border-border px-3 rounded-lg focus-within:ring-1 focus-within:ring-ring focus-within:border-primary max-w-md transition-all">
        <Search className="h-4 w-4 text-muted-foreground shrink-0" />
        <input
          type="text"
          placeholder="Filter workflows by name or details..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full py-2.5 px-3 text-xs bg-transparent border-none outline-none text-foreground placeholder-muted-foreground"
        />
      </div>

      {/* Loading states grid skeletons */}
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="glass-panel h-48 flex flex-col justify-between">
              <CardHeader className="space-y-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-3 w-1/3" />
              </CardContent>
              <CardFooter className="border-t border-border/40 pt-4 flex justify-between">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-12" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : filteredWorkflows.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 border border-dashed border-border rounded-xl bg-zinc-950/10 max-w-2xl mx-auto">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <GitBranch className="h-6 w-6" />
          </div>
          <div className="space-y-1.5 max-w-xs">
            <h3 className="text-sm font-bold text-foreground">No workflows found</h3>
            <p className="text-xs text-muted-foreground leading-normal">
              {searchQuery ? "No results match your search query." : "Start automating your workspace. Build workflows inside our visual canvas using natural language."}
            </p>
          </div>
          {!searchQuery && (
            <Button size="sm" variant="outline" onClick={() => setCreateOpen(true)}>
              Initialize Workflow
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredWorkflows.map((wf) => (
            <Card
              key={wf.id}
              className="glass-panel hover:border-primary/30 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group"
            >
              {/* Highlight bar on active */}
              {wf.isActive && (
                <div className="absolute top-0 inset-x-0 h-0.5 bg-primary shadow shadow-primary" />
              )}
              
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2.5">
                  <span
                    onClick={() => router.push(`/dashboard/builder/${wf.id}`)}
                    className="font-bold text-sm text-foreground hover:text-primary transition-colors truncate cursor-pointer leading-tight"
                  >
                    {wf.name}
                  </span>
                  
                  {/* Dropdown controls wrapper */}
                  <div className="relative shrink-0">
                    <button
                      onClick={() => setDropdownOpen((prev) => (prev === wf.id ? null : wf.id))}
                      className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>

                    {dropdownOpen === wf.id && (
                      <>
                        <div
                          className="fixed inset-0 z-20"
                          onClick={() => setDropdownOpen(null)}
                        />
                        <div className="absolute right-0 mt-1 bg-card border border-border rounded-lg shadow-xl py-1 z-30 w-36 glass-panel font-medium">
                          <button
                            onClick={() => {
                              setDropdownOpen(null);
                              setRenameId(wf.id);
                              setRenameInput(wf.name);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-foreground hover:bg-muted text-left"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                            Rename Flow
                          </button>
                          <button
                            onClick={() => handleDuplicate(wf)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-foreground hover:bg-muted text-left"
                          >
                            <Copy className="h-3.5 w-3.5" />
                            Duplicate
                          </button>
                          <div className="border-t border-border/80 my-1" />
                          <button
                            onClick={() => handleDelete(wf.id)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-destructive hover:bg-destructive/10 text-left font-bold"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete Flow
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <CardDescription className="text-xs mt-1.5 line-clamp-2 h-8 leading-relaxed">
                  {wf.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pb-4">
                <span className="text-[10px] text-muted-foreground">
                  Updated: {formatDateTime(wf.updatedAt)}
                </span>
              </CardContent>

              <CardFooter className="border-t border-border/50 pt-4 pb-4 flex items-center justify-between bg-zinc-950/20">
                {/* Active Switcher button toggle */}
                <button
                  onClick={() => handleToggleActive(wf)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border",
                    wf.isActive
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/15"
                      : "bg-zinc-900 text-muted-foreground border-border/80 hover:bg-zinc-800"
                  )}
                >
                  <Power className="h-3 w-3" />
                  {wf.isActive ? "Active" : "Draft"}
                </button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => router.push(`/dashboard/builder/${wf.id}`)}
                  className="text-xs flex gap-1 h-7 px-2.5 border-border/80 bg-black/40"
                >
                  Edit Canvas
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Create Workflow Dialog Modal */}
      {createOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-40 animate-fade-in">
          <div className="w-full max-w-md border border-border bg-card rounded-xl p-6 shadow-2xl glass-panel relative">
            <h3 className="text-base font-bold text-foreground mb-1">Create Workflow</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Enter name and description. We&apos;ll set up a workspace canvas ready for prompts.
            </p>
            <form onSubmit={handleCreate} className="space-y-4">
              <Input
                label="Workflow Name"
                placeholder="Sync Github issues to Discord"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                disabled={creating}
                required
              />
              <Input
                label="Description"
                placeholder="Triggers when Github issues are opened, summarizes description and routes output."
                value={descInput}
                onChange={(e) => setDescInput(e.target.value)}
                disabled={creating}
              />
              <div className="flex justify-end gap-2.5 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setCreateOpen(false)}
                  disabled={creating}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" isLoading={creating}>
                  Create & Launch
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rename Dialog Modal */}
      {renameId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-40 animate-fade-in">
          <div className="w-full max-w-sm border border-border bg-card rounded-xl p-6 shadow-2xl glass-panel relative">
            <h3 className="text-base font-bold text-foreground mb-4">Rename Workflow</h3>
            <form onSubmit={handleRename} className="space-y-4">
              <Input
                label="New Workflow Name"
                placeholder="Sync Github issues"
                value={renameInput}
                onChange={(e) => setRenameInput(e.target.value)}
                disabled={renaming}
                required
              />
              <div className="flex justify-end gap-2.5 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setRenameId(null)}
                  disabled={renaming}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" isLoading={renaming}>
                  Rename
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
