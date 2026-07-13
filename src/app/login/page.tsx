"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/context/AuthContext";
import { AuthCard } from "@/features/auth/components/AuthCard";
import { Activity } from "lucide-react";

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-1 flex-col items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-4">
          <Activity className="h-10 w-10 animate-pulse text-primary" />
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Verifying Session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-12 bg-black overflow-hidden font-sans">
      {/* Background radial highlights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-violet-600/5 rounded-full blur-[80px] pointer-events-none" />
      
      {/* Background Grid Layer */}
      <div className="absolute inset-0 canvas-grid opacity-30 pointer-events-none" />

      {/* Header Logomark */}
      <div className="relative mb-8 flex items-center gap-2.5 z-10">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-violet-600 shadow-lg shadow-primary/20">
          <Activity className="h-5 w-5 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/75 bg-clip-text text-transparent">
          FlowForge AI
        </span>
      </div>

      {/* Render core authentication card */}
      <div className="relative w-full max-w-md z-10">
        <AuthCard />
      </div>
    </div>
  );
}
