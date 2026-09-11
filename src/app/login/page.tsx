"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/context/AuthContext";
import { AuthCard } from "@/features/auth/components/AuthCard";
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
          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl overflow-hidden border border-white/20 shadow-[0_0_30px_rgba(99,102,241,0.5)] animate-pulse">
            <Image
              src="/icon.png"
              alt="FlowForge AI"
              width={56}
              height={56}
              className="h-full w-full object-cover"
              priority
            />
          </div>
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
      <Link href="/" className="relative mb-8 flex items-center gap-3 z-10 group cursor-pointer">
        <div className="relative flex h-11 w-11 items-center justify-center rounded-xl overflow-hidden border border-white/20 shadow-[0_0_20px_rgba(99,102,241,0.5)] group-hover:scale-105 transition-transform duration-300">
          <Image
            src="/icon.png"
            alt="FlowForge AI"
            width={44}
            height={44}
            className="h-full w-full object-cover"
            priority
          />
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-extrabold tracking-tight text-white font-open-sans-custom">
            FlowForge<span className="text-indigo-400">AI</span>
          </span>
          <span className="text-[10px] text-gray-400 font-open-sans-custom tracking-wider uppercase font-medium">
            Authentication Portal
          </span>
        </div>
      </Link>

      {/* Render core authentication card */}
      <div className="relative w-full max-w-md z-10">
        <AuthCard />
      </div>
    </div>
  );
}
