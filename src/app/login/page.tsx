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
      <div className="flex min-h-screen flex-1 flex-col items-center justify-center bg-[#12172A] font-mono">
        <div className="flex flex-col items-center gap-4">
          <Activity className="h-10 w-10 animate-pulse text-[#FFB454]" />
          <p className="text-xs font-semibold uppercase tracking-wider text-[#8E9BB5]">
            Verifying Session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-12 bg-[#12172A] overflow-hidden font-mono">
      {/* Background Grid Layer */}
      <div className="absolute inset-0 blueprint-grid opacity-40 pointer-events-none" />

      {/* Header Logomark */}
      <div className="relative mb-8 flex items-center gap-3 z-10">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1E2640] border border-[#FFB454]/40 shadow-lg shadow-[#FFB454]/10">
          <Activity className="h-5 w-5 text-[#FFB454]" />
        </div>
        <span className="text-xl font-extrabold tracking-tight text-white font-mono">
          FLOWFORGE<span className="text-[#FFB454]">.AI</span>
        </span>
      </div>

      {/* Render core authentication card */}
      <div className="relative w-full max-w-md z-10">
        <AuthCard />
      </div>
    </div>
  );
}
