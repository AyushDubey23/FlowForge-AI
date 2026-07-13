"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/context/AuthContext";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Workspace } from "@/types";
import { ChevronDown, Plus, Check, Loader2, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const WorkspaceSwitcher: React.FC = () => {
  const { user, activeWorkspace, switchWorkspace } = useAuth();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newWsName, setNewWsName] = useState("");
  const [creating, setCreating] = useState(false);

  const fetchWorkspaces = React.useCallback(async () => {
    if (!user) return;
    try {
      await Promise.resolve();
      setLoading(true);
      const wsQuery = query(
        collection(db, "workspaces"),
        where(`members.${user.uid}.role`, "in", ["owner", "admin", "member"])
      );
      const snap = await getDocs(wsQuery);
      const list = snap.docs.map((doc) => doc.data() as Workspace);
      setWorkspaces(list);
    } catch (err) {
      console.error("Error fetching workspaces:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchWorkspaces();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchWorkspaces, activeWorkspace?.id]);

  const handleSelect = async (wsId: string) => {
    setDropdownOpen(false);
    await switchWorkspace(wsId);
  };

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newWsName.trim()) return;

    try {
      setCreating(true);
      const wsId = `ws_${Math.random().toString(36).substring(2, 11)}`;
      const workspaceData: Workspace = {
        id: wsId,
        name: newWsName.trim(),
        slug: newWsName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        ownerId: user.uid,
        members: {
          [user.uid]: {
            role: "owner",
            invitedAt: new Date(),
            joinedAt: new Date(),
          },
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await addDoc(collection(db, "workspaces"), workspaceData);
      
      // Auto switch
      await switchWorkspace(wsId);
      
      setNewWsName("");
      setCreateModalOpen(false);
      await fetchWorkspaces();
    } catch (err) {
      console.error("Error creating workspace:", err);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="relative font-sans">
      {/* Selector Trigger bar */}
      <button
        onClick={() => setDropdownOpen((prev) => !prev)}
        className="flex items-center justify-between w-full px-3 py-2 text-xs font-bold rounded-lg border border-border bg-zinc-950/40 hover:bg-zinc-900 transition-all text-left"
      >
        <div className="flex items-center gap-2.5 truncate">
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-primary/20 text-primary">
            <Building className="h-3.5 w-3.5" />
          </div>
          <span className="truncate text-foreground font-semibold">
            {activeWorkspace?.name || "Select Workspace"}
          </span>
        </div>
        <ChevronDown className="h-3 w-3 text-muted-foreground shrink-0 ml-2" />
      </button>

      {/* Switcher Dropdown options */}
      {dropdownOpen && (
        <>
          <div
            className="fixed inset-0 z-20"
            onClick={() => setDropdownOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-card border border-border rounded-lg shadow-xl py-1.5 z-30 animate-fade-in max-h-48 overflow-y-auto glass-panel">
            <div className="px-3 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Workspaces
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              </div>
            ) : (
              workspaces.map((ws) => (
                <button
                  key={ws.id}
                  onClick={() => handleSelect(ws.id)}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted text-left"
                >
                  <span className="truncate">{ws.name}</span>
                  {ws.id === activeWorkspace?.id && (
                    <Check className="h-3.5 w-3.5 text-primary shrink-0 ml-2" />
                  )}
                </button>
              ))
            )}
            <div className="border-t border-border/80 my-1" />
            <button
              onClick={() => {
                setDropdownOpen(false);
                setCreateModalOpen(true);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-primary hover:bg-muted text-left"
            >
              <Plus className="h-3.5 w-3.5" />
              Create Workspace
            </button>
          </div>
        </>
      )}

      {/* Slide-down Create Workspace Dialog Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-40 animate-fade-in">
          <div className="w-full max-w-sm border border-border bg-card rounded-xl p-6 shadow-2xl glass-panel relative">
            <h3 className="text-base font-bold text-foreground mb-1">Create new workspace</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Collaborate on workflows, invite teammates, and manage API keys together.
            </p>
            <form onSubmit={handleCreateWorkspace} className="space-y-4">
              <Input
                label="Workspace Name"
                placeholder="Acme Corp"
                value={newWsName}
                onChange={(e) => setNewWsName(e.target.value)}
                disabled={creating}
                required
              />
              <div className="flex justify-end gap-2.5 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setCreateModalOpen(false)}
                  disabled={creating}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" isLoading={creating}>
                  Create
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
