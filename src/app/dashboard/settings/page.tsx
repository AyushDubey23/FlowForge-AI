"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/features/auth/context/AuthContext";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { WorkspaceApiKey } from "@/types";
import {
  User,
  Key,
  Users,
  Trash2,
  Copy,
  Check,
  Lock,
  CreditCard,
  Sparkles,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { cn } from "@/lib/utils";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function SettingsPage() {
  const { user, profile, activeWorkspace, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<"profile" | "keys" | "members" | "billing">("profile");

  // Profile Settings
  const [displayName, setDisplayName] = useState(profile?.displayName || "");
  const [photoURL, setPhotoURL] = useState(profile?.photoURL || "");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  // API Keys
  const [apiKeys, setApiKeys] = useState<WorkspaceApiKey[]>([]);
  const [keyName, setKeyName] = useState("");
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  // Billing Settings
  const [upgrading, setUpgrading] = useState(false);

  const handleUpgrade = async () => {
    if (!activeWorkspace?.id) return;

    try {
      setUpgrading(true);
      // 1. Create order ID
      const orderRes = await fetch("/api/payment/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workspaceId: activeWorkspace.id }),
      });
      const orderData = await orderRes.json();
      if (!orderData.success) {
        throw new Error(orderData.error || "Order creation failed");
      }

      // 2. Load script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert("Failed to load Razorpay SDK. Check your internet connection.");
        return;
      }

      // 3. Open Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder",
        amount: orderData.amount,
        currency: orderData.currency,
        name: "FlowForge AI",
        description: "Upgrade Workspace to Pro Plan",
        order_id: orderData.orderId,
        handler: async function (response: any) {
          try {
            setUpgrading(true);
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                workspaceId: activeWorkspace.id,
                isMock: orderData.isMock,
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              alert("Congratulations! Your workspace has been upgraded to Pro.");
              window.location.reload();
            } else {
              alert(`Verification failed: ${verifyData.error}`);
            }
          } catch (err: any) {
            alert(`Payment verification error: ${err.message}`);
          } finally {
            setUpgrading(false);
          }
        },
        prefill: {
          name: profile?.displayName || "",
          email: profile?.email || "",
        },
        theme: {
          color: "#7c3aed",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      alert(`Payment checkout initialization error: ${err.message}`);
    } finally {
      setUpgrading(false);
    }
  };

  // Members Settings
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"admin" | "member">("member");
  const [inviting, setInviting] = useState(false);
  const [memberSuccess, setMemberSuccess] = useState(false);

  useEffect(() => {
    if (profile) {
      Promise.resolve().then(() => {
        setDisplayName(profile.displayName || "");
        setPhotoURL(profile.photoURL || "");
      });
    }
  }, [profile]);

  useEffect(() => {
    if (activeWorkspace) {
      Promise.resolve().then(() => {
        setApiKeys(activeWorkspace.apiKeys || []);
      });
    }
  }, [activeWorkspace]);

  // Save Profile Details
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) return;

    try {
      setSavingProfile(true);
      setProfileSuccess(false);
      await updateProfile(displayName.trim(), photoURL.trim() || null);
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setSavingProfile(false);
    }
  };

  // Generate API Secret Key
  const handleCreateApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeWorkspace?.id || !keyName.trim()) return;

    try {
      setGenerating(true);
      const suffix = Math.random().toString(36).substring(2, 22);
      const fullKey = `ff_live_${suffix}`;
      const prefix = "ff_live_";
      const hash = `hash_${Math.random().toString(36).substring(2, 12)}`; // Simulated hash

      const newKey: WorkspaceApiKey = {
        name: keyName.trim(),
        prefix,
        hash,
        createdAt: new Date(),
      };

      const wsRef = doc(db, "workspaces", activeWorkspace.id);
      await updateDoc(wsRef, {
        apiKeys: arrayUnion(newKey),
      });

      setGeneratedKey(fullKey);
      setKeyName("");
      setApiKeys((prev) => [...prev, newKey]);
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  // Delete API Key
  const handleDeleteKey = async (keyToDelete: WorkspaceApiKey) => {
    if (!activeWorkspace?.id || !window.confirm(`Are you sure you want to delete "${keyToDelete.name}"? Applications using this API key will lose access.`)) return;
    try {
      const wsRef = doc(db, "workspaces", activeWorkspace.id);
      await updateDoc(wsRef, {
        apiKeys: arrayRemove(keyToDelete),
      });
      setApiKeys((prev) => prev.filter((k) => k.hash !== keyToDelete.hash));
    } catch (err) {
      console.error(err);
    }
  };

  // Copy Generated Key
  const handleCopyKey = () => {
    if (!generatedKey) return;
    navigator.clipboard.writeText(generatedKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Invite Workspace Member Collaborator
  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeWorkspace?.id || !inviteEmail.trim()) return;

    try {
      setInviting(true);
      setMemberSuccess(false);
      
      // Look up target member or simply add email mock record to members map
      // For scalability, we add them directly to workspaces/{wsId} members map
      // Generate simulated userId for email invite
      const mockUserId = `usr_${Math.random().toString(36).substring(2, 9)}`;
      const wsRef = doc(db, "workspaces", activeWorkspace.id);

      await updateDoc(wsRef, {
        [`members.${mockUserId}`]: {
          role: inviteRole,
          invitedAt: new Date(),
          joinedAt: new Date(),
          email: inviteEmail.trim(), // Storing email metadata
        },
      });

      setInviteEmail("");
      setMemberSuccess(true);
      setTimeout(() => setMemberSuccess(false), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setInviting(false);
    }
  };

  const tabs = [
    { id: "profile", name: "Account Profile", icon: <User className="h-4 w-4" /> },
    { id: "keys", name: "Developer API Keys", icon: <Key className="h-4 w-4" /> },
    { id: "members", name: "Workspace Team", icon: <Users className="h-4 w-4" /> },
    { id: "billing", name: "Billing & Plans", icon: <CreditCard className="h-4 w-4" /> },
  ] as const;

  return (
    <div className="flex-1 p-6 space-y-6 max-w-4xl mx-auto w-full font-sans">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="relative flex h-10 w-10 items-center justify-center rounded-xl overflow-hidden border border-white/20 shadow-[0_0_15px_rgba(99,102,241,0.35)] shrink-0">
          <Image
            src="/icon.png"
            alt="FlowForge Settings"
            width={40}
            height={40}
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Workspace Settings</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage developer credentials, workspace members, and profile settings.
          </p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-border/80 shrink-0 bg-zinc-950/20 rounded-t-lg overflow-hidden">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-1.5 px-4 py-3.5 text-xs font-bold border-b-2 transition-all",
              activeTab === tab.id
                ? "border-primary text-primary bg-primary/5"
                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
            )}
          >
            {tab.icon}
            {tab.name}
          </button>
        ))}
      </div>

      {/* Profile Form View */}
      {activeTab === "profile" && (
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle>Account Profile Details</CardTitle>
            <CardDescription className="text-xs">
              Manage your display name, image URL, and notifications profiles settings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveProfile} className="space-y-4 max-w-md">
              <Input
                label="Profile Display Name"
                placeholder="Ayush"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                disabled={savingProfile}
                required
              />
              <Input
                label="Avatar URL Link"
                placeholder="https://example.com/photo.png"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                disabled={savingProfile}
              />
              <div className="flex justify-end pt-2">
                <Button type="submit" variant="primary" size="sm" isLoading={savingProfile}>
                  {profileSuccess ? "Saved Successfully" : "Save Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* API Keys View */}
      {activeTab === "keys" && (
        <div className="space-y-6">
          {/* Key Generation Modal details overlay if key was just generated */}
          {generatedKey && (
            <Card className="border-primary/20 bg-primary/5 glass-panel relative overflow-hidden animate-fade-in">
              <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-primary to-violet-500" />
              <CardHeader>
                <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                  <Lock className="h-4 w-4" />
                  <span>Copy API Secret Key</span>
                </div>
                <CardTitle className="text-sm mt-1">Make sure to copy your secret API key now.</CardTitle>
                <CardDescription className="text-xs">
                  For security, we cannot show this API key to you again.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3.5">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={generatedKey}
                    readOnly
                    className="flex-1 h-9 rounded-md border border-border bg-zinc-950/60 px-3 text-[11px] font-mono text-primary font-bold select-all focus-visible:outline-none"
                  />
                  <Button size="sm" variant="primary" onClick={handleCopyKey} className="h-9">
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </CardContent>
              <CardFooter>
                <Button size="sm" variant="outline" onClick={() => setGeneratedKey(null)} className="text-xs w-full">
                  I have copied my key safely
                </Button>
              </CardFooter>
            </Card>
          )}

          <Card className="glass-panel">
            <CardHeader>
              <CardTitle>Create API Secret Key</CardTitle>
              <CardDescription className="text-xs">
                Generate an API credential to trigger workflows via HTTP requests.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateApiKey} className="flex gap-3 max-w-md items-end">
                <div className="flex-1">
                  <Input
                    label="Credential Name"
                    placeholder="Discord Automation Webhook"
                    value={keyName}
                    onChange={(e) => setKeyName(e.target.value)}
                    disabled={generating}
                    required
                  />
                </div>
                <Button type="submit" variant="primary" size="sm" className="h-10 px-4 mb-0.5" isLoading={generating}>
                  Generate
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Active keys listing */}
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle>Active API Credentials</CardTitle>
              <CardDescription className="text-xs">
                List of registered API credentials that can run automations.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {apiKeys.length === 0 ? (
                <div className="py-6 text-center text-xs text-muted-foreground font-semibold">
                  No active credentials generated.
                </div>
              ) : (
                apiKeys.map((key, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-lg border border-border bg-zinc-950/10"
                  >
                    <div className="min-w-0">
                      <p className="font-bold text-xs text-foreground truncate">{key.name}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5 flex gap-1 items-center">
                        <span className="font-mono bg-zinc-900 border border-border/40 px-1 py-0.2 rounded font-bold">
                          {key.prefix}••••••••
                        </span>
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteKey(key)}
                      className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive text-muted-foreground"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Workspace Members Settings View */}
      {activeTab === "members" && (
        <div className="space-y-6">
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle>Invite Team Member</CardTitle>
              <CardDescription className="text-xs">
                Invite collaborators to edit workflows and check logs run histories.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleInviteMember} className="flex flex-col sm:flex-row gap-3 items-end">
                <div className="flex-1 w-full">
                  <Input
                    label="Teammate Email"
                    type="email"
                    placeholder="teammate@example.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    disabled={inviting}
                    required
                />
              </div>
              <div className="w-full sm:w-32 space-y-1.5 mb-0.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Role
                  </label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as "admin" | "member")}
                    className="flex h-10 w-full rounded-md border border-input bg-card px-3 py-1 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-primary"
                  >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <Button type="submit" variant="primary" size="sm" className="h-10 px-4 w-full sm:w-auto mb-0.5" isLoading={inviting}>
                  {memberSuccess ? "Sent" : "Invite"}
                </Button>
              </form>
            </CardContent>
          </Card>
 
          {/* Members List */}
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle>Workspace Collaborators</CardTitle>
              <CardDescription className="text-xs font-medium">
                Active team members in {activeWorkspace?.name || "Workspace"}.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {activeWorkspace &&
                Object.entries(activeWorkspace.members).map(([uid, mem]) => {
                  const initialLetter = mem.email ? mem.email.charAt(0).toUpperCase() : "?";
                  return (
                    <div
                      key={uid}
                      className="flex items-center justify-between p-3 rounded-lg border border-border bg-zinc-950/10"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="h-8 w-8 rounded-full border border-border bg-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0 select-none">
                          {initialLetter}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-xs text-foreground truncate">
                            {mem.email || (uid === user?.uid ? user.displayName : "Collaborator")}
                          </p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            Role: <span className="font-bold uppercase text-foreground/80">{mem.role}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Billing & Plans View */}
      {activeTab === "billing" && (
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Free Tier Card */}
            <Card className="glass-panel relative overflow-hidden border-border/80">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] bg-zinc-900 border border-border px-2 py-0.5 rounded font-bold uppercase tracking-wider text-muted-foreground">
                    {activeWorkspace?.tier !== "pro" ? "Current Plan" : "Available"}
                  </span>
                </div>
                <CardTitle className="text-xl font-bold mt-2">Free Community Sandbox</CardTitle>
                <CardDescription className="text-xs">
                  For hobbyists exploring natural language workflow generation.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-foreground">₹0</span>
                  <span className="text-xs text-muted-foreground">/ month</span>
                </div>
                
                <div className="space-y-2 border-t border-border/40 pt-4 text-xs text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    Up to 3 active workflows
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    100 free Gemini runs per month
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    Standard execution speed limits
                  </p>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button variant="outline" className="w-full text-xs font-bold" disabled={activeWorkspace?.tier !== "pro"}>
                  {activeWorkspace?.tier !== "pro" ? "Active Subscription" : "Free Plan Option"}
                </Button>
              </CardFooter>
            </Card>

            {/* Pro Tier Card */}
            <Card className="glass-panel relative overflow-hidden border-primary/30 bg-primary/5">
              <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-primary to-violet-500" />
              <CardHeader>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] bg-primary/20 border border-primary/30 px-2 py-0.5 rounded font-bold uppercase tracking-wider text-primary flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    {activeWorkspace?.tier === "pro" ? "Active Plan" : "Most Popular"}
                  </span>
                  <div className="relative h-6 w-6 rounded-lg overflow-hidden border border-white/20 shadow-[0_0_8px_rgba(99,102,241,0.4)]">
                    <Image src="/icon.png" alt="FlowForge Pro" width={24} height={24} className="h-full w-full object-cover" />
                  </div>
                </div>
                <CardTitle className="text-xl font-bold mt-2">FlowForge Pro Architect</CardTitle>
                <CardDescription className="text-xs">
                  Unlock advanced branching blueprints, priority processing, and unlimited AI execution logs.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-foreground">₹1,499</span>
                  <span className="text-xs text-muted-foreground">/ month</span>
                </div>

                <div className="space-y-2 border-t border-primary/25 pt-4 text-xs text-zinc-300">
                  <p className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    <strong>Unlimited</strong> active workflows
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    Priority execution scheduling
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    Advanced conditional branching nodes
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    Priority 24/7 developer ticket support
                  </p>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                {activeWorkspace?.tier === "pro" ? (
                  <Button variant="outline" className="w-full text-xs font-bold border-primary/40 text-primary bg-primary/5 hover:bg-primary/10" disabled>
                    ✓ Subscribed as Pro
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    className="w-full text-xs font-bold gap-1.5"
                    onClick={handleUpgrade}
                    isLoading={upgrading}
                  >
                    <Zap className="h-3.5 w-3.5 fill-current" />
                    Upgrade Workspace
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
