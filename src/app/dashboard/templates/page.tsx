"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/context/AuthContext";
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Template, Workflow, WorkflowVersion } from "@/types";
import {
  Download,
  Upload,
  Plus,
  CheckCircle2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { cn } from "@/lib/utils";

// Mock marketplace template collection for sandbox/offline runs
const mockTemplates: Template[] = [
  {
    id: "tpl_1",
    name: "Sync Github to Discord",
    description: "Listen for Github issues triggers, summarize content with Gemini AI, and post cards to Discord webhooks.",
    category: "AI & Communication",
    nodes: [
      { id: "webhook_1", type: "webhook", position: { x: 100, y: 150 }, data: { label: "Github Webhook" } },
      { id: "aiPrompt_1", type: "aiPrompt", position: { x: 420, y: 150 }, data: { label: "Gemini Summary", prompt: "Summarize issue body:" } },
      { id: "notification_1", type: "notification", position: { x: 740, y: 150 }, data: { label: "Post to Discord" } }
    ],
    edges: [
      { id: "e1", source: "webhook_1", target: "aiPrompt_1" },
      { id: "e2", source: "aiPrompt_1", target: "notification_1" }
    ],
    downloadsCount: 1420,
    author: "FlowForge AI Team",
    isFeatured: true,
    createdAt: new Date(),
  },
  {
    id: "tpl_2",
    name: "AI Welcome Email Automator",
    description: "Triggers on new user signups. Automatically write customized marketing greetings using AI and trigger Firestore record writes.",
    category: "Lead Management",
    nodes: [
      { id: "manual_1", type: "manual", position: { x: 100, y: 150 }, data: { label: "Lead Signup Trigger" } },
      { id: "aiPrompt_1", type: "aiPrompt", position: { x: 420, y: 150 }, data: { label: "Gemini Mail Generator", prompt: "Write greeting for client:" } },
      { id: "email_1", type: "email", position: { x: 740, y: 150 }, data: { label: "Deliver Email" } }
    ],
    edges: [
      { id: "e1", source: "manual_1", target: "aiPrompt_1" },
      { id: "e2", source: "aiPrompt_1", target: "email_1" }
    ],
    downloadsCount: 980,
    author: "Vercel Partner Team",
    isFeatured: true,
    createdAt: new Date(),
  },
  {
    id: "tpl_3",
    name: "HTTP REST API Polling Trigger",
    description: "Trigger flow periodically using cron schedules. Query endpoints, run logic if expressions pass, and forward alerts.",
    category: "Monitoring & Logic",
    nodes: [
      { id: "timer_1", type: "timer", position: { x: 100, y: 150 }, data: { label: "Cron Timer Schedule" } },
      { id: "http_1", type: "http", position: { x: 420, y: 150 }, data: { label: "Fetch API Status", url: "https://api.status.io" } },
      { id: "condition_1", type: "condition", position: { x: 740, y: 150 }, data: { label: "If Status Fail", expression: "input.status !== 200" } }
    ],
    edges: [
      { id: "e1", source: "timer_1", target: "http_1" },
      { id: "e2", source: "http_1", target: "condition_1" }
    ],
    downloadsCount: 430,
    author: "DevOps Core Team",
    isFeatured: false,
    createdAt: new Date(),
  }
];

export default function TemplatesPage() {
  const { activeWorkspace, user } = useAuth();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [userWorkflows, setUserWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [sandboxMode, setSandboxMode] = useState(true);
  
  // Modals state
  const [publishOpen, setPublishOpen] = useState(false);
  const [selectedWfId, setSelectedWfId] = useState("");
  const [categoryInput, setCategoryInput] = useState("Marketing");
  const [publishing, setPublishing] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const router = useRouter();

  // Load marketplace templates from Firestore
  const loadMarketplace = async () => {
    try {
      setLoading(true);
      const snap = await getDocs(collection(db, "templates"));
      const list = snap.docs.map((d) => ({ ...d.data(), id: d.id })) as Template[];
      setTemplates(list);
      if (list.length > 0) {
        setSandboxMode(false);
      }
    } catch {
      setSandboxMode(true);
    } finally {
      setLoading(false);
    }
  };

  // Load user workflows to publish
  useEffect(() => {
    if (!activeWorkspace?.id) return;
    const fetchUserWfs = async () => {
      try {
        const snap = await getDocs(collection(db, "workspaces", activeWorkspace.id, "workflows"));
        setUserWorkflows(snap.docs.map((d) => ({ ...d.data(), id: d.id })) as Workflow[]);
      } catch {
        // Silent
      }
    };
    
    Promise.resolve().then(() => {
      fetchUserWfs();
      loadMarketplace();
    });
  }, [activeWorkspace?.id]);

  // Clone Template to Workspace
  const handleClone = async (tpl: Template) => {
    if (!activeWorkspace?.id) return;
    try {
      setLoading(true);
      const wfsCollection = collection(db, "workspaces", activeWorkspace.id, "workflows");

      // 1. Create duplicated workflow root
      const newWfDoc = await addDoc(wfsCollection, {
        name: `${tpl.name} (Cloned)`,
        description: tpl.description,
        isActive: false,
        latestVersionNumber: 1,
        activeVersionId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // 2. Create duplicated version snapshot
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
        nodes: tpl.nodes,
        edges: tpl.edges,
        createdBy: user?.displayName || "User",
        description: `Cloned from marketplace template: ${tpl.name}`,
        isPublished: false,
        createdAt: new Date(),
      });

      await updateDoc(doc(db, "workspaces", activeWorkspace.id, "workflows", newWfDoc.id), {
        activeVersionId: newVersionDoc.id,
      });

      // Redirect immediately to new canvas
      router.push(`/dashboard/builder/${newWfDoc.id}`);
    } catch (err) {
      console.error("Clone template failed:", err);
      setLoading(false);
    }
  };

  // Publish Template to public collection
  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeWorkspace?.id || !selectedWfId) return;

    try {
      setPublishing(true);
      const wf = userWorkflows.find((w) => w.id === selectedWfId);
      if (!wf) return;

      // Fetch active version nodes & edges
      const verRef = doc(
        db,
        "workspaces",
        activeWorkspace.id,
        "workflows",
        selectedWfId,
        "versions",
        "draft_v1"
      );
      const verSnap = await getDoc(verRef);
      const verData = verSnap.data() as WorkflowVersion | undefined;

      const templatesRef = collection(db, "templates");
      const templateData: Omit<Template, "id"> = {
        name: wf.name,
        description: wf.description,
        category: categoryInput,
        nodes: verData?.nodes || [],
        edges: verData?.edges || [],
        downloadsCount: 0,
        author: user?.displayName || "Community Builder",
        isFeatured: false,
        createdAt: new Date(),
      };

      await addDoc(templatesRef, templateData);

      setSuccessMsg("Workflow successfully published to marketplace catalog!");
      setSelectedWfId("");
      setTimeout(() => {
        setSuccessMsg(null);
        setPublishOpen(false);
        loadMarketplace();
      }, 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setPublishing(false);
    }
  };

  const displayList = sandboxMode ? mockTemplates : templates;

  return (
    <div className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full font-sans relative">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl overflow-hidden border border-white/20 shadow-[0_0_15px_rgba(99,102,241,0.35)] shrink-0">
            <Image
              src="/icon.png"
              alt="FlowForge Marketplace"
              width={40}
              height={40}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Marketplace</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Discover community-curated visual workflow templates, or publish your own flow.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {templates.length === 0 && (
            <div className="flex items-center gap-2 bg-zinc-950/60 border border-border px-3 py-1.5 rounded-lg text-xs font-semibold glass-panel select-none shrink-0">
              <span className="text-[10px] text-muted-foreground uppercase font-bold">
                Sandbox templates
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
          <Button variant="primary" size="sm" onClick={() => setPublishOpen(true)} className="flex gap-1.5">
            <Upload className="h-4 w-4" />
            Publish Template
          </Button>
        </div>
      </div>

      {/* Templates display list */}
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2].map((i) => (
            <Card key={i} className="glass-panel h-52 flex flex-col justify-between">
              <CardHeader className="space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-full" />
              </CardHeader>
              <CardFooter>
                <Skeleton className="h-8 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {displayList.map((tpl) => (
            <Card
              key={tpl.id}
              className="glass-panel hover:border-primary/30 transition-all duration-300 flex flex-col justify-between overflow-hidden relative"
            >
              {tpl.isFeatured && (
                <div className="absolute top-0 right-0 bg-primary/20 text-primary text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-bl border-l border-b border-primary/20">
                  Featured
                </div>
              )}
              <CardHeader className="pb-3">
                <span className="text-[10px] text-primary font-bold uppercase tracking-wider">
                  {tpl.category}
                </span>
                <CardTitle className="text-sm font-bold text-foreground mt-1 truncate">
                  {tpl.name}
                </CardTitle>
                <CardDescription className="text-xs leading-relaxed line-clamp-3 mt-1.5">
                  {tpl.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pb-4">
                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    {tpl.author.includes("FlowForge") && (
                      <div className="relative h-3.5 w-3.5 rounded-full overflow-hidden border border-white/20 shrink-0">
                        <Image src="/icon.png" alt="FlowForge" width={14} height={14} className="h-full w-full object-cover" />
                      </div>
                    )}
                    <span>Publisher: {tpl.author}</span>
                  </div>
                  <span className="flex items-center gap-1">
                    <Download className="h-3.5 w-3.5" />
                    {tpl.downloadsCount} installs
                  </span>
                </div>
              </CardContent>

              <CardFooter className="border-t border-border/50 pt-4 bg-zinc-950/20">
                <Button
                  onClick={() => handleClone(tpl)}
                  className="w-full flex gap-1.5 h-8.5 font-semibold text-xs border border-border/80 bg-black/40 hover:bg-primary hover:text-primary-foreground hover:shadow hover:shadow-primary/10 transition-all"
                >
                  <Plus className="h-4 w-4" />
                  Install Template Blueprint
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Publish Template Dialog Modal */}
      {publishOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-40 animate-fade-in">
          <div className="w-full max-w-sm border border-border bg-card rounded-xl p-6 shadow-2xl glass-panel relative">
            <h3 className="text-base font-bold text-foreground mb-1">Publish to Marketplace</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Select one of your workflow drafts to publish as a community template.
            </p>

            {successMsg ? (
              <div className="rounded-lg border border-primary/20 bg-primary/10 p-4 text-center space-y-3">
                <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-primary">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <p className="text-xs text-foreground font-semibold">{successMsg}</p>
              </div>
            ) : (
              <form onSubmit={handlePublish} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Select Workflow Draft
                  </label>
                  <select
                    value={selectedWfId}
                    onChange={(e) => setSelectedWfId(e.target.value)}
                    required
                    className="flex h-9 w-full rounded-md border border-input bg-card px-3 py-1 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-primary"
                  >
                    <option value="">Choose a workflow...</option>
                    {userWorkflows.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Template Category
                  </label>
                  <select
                    value={categoryInput}
                    onChange={(e) => setCategoryInput(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-card px-3 py-1 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-primary"
                  >
                    <option value="AI & Communication">AI & Communication</option>
                    <option value="Lead Management">Lead Management</option>
                    <option value="Monitoring & Logic">Monitoring & Logic</option>
                    <option value="Data Processing">Data Processing</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2.5 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setPublishOpen(false)}
                    disabled={publishing}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    isLoading={publishing}
                    disabled={!selectedWfId}
                  >
                    Publish
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
