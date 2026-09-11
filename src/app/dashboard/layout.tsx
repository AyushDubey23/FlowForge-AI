"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/features/auth/context/AuthContext";
import { WorkspaceSwitcher } from "@/features/workspaces/components/WorkspaceSwitcher";
import { UserProfileMenu } from "@/components/common/UserProfileMenu";
import { CommandPalette } from "@/components/common/CommandPalette";
import {
  LayoutDashboard,
  GitBranch,
  Settings,
  BookOpen,
  History,
  Store,
  Activity,
  Menu,
  X,
  Keyboard,
  Search,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // Authentication Guard
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-1 flex-col items-center justify-center bg-black font-mono">
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
          <p className="text-xs font-medium uppercase tracking-widest text-zinc-500 font-mono">
            Loading Workspace...
          </p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  // Sidebar Links
  const navItems: NavItem[] = [
    {
      name: "Analytics",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      name: "Workflows",
      href: "/dashboard/workflows",
      icon: <GitBranch className="h-4 w-4" />,
    },
    {
      name: "Runs History",
      href: "/dashboard/executions",
      icon: <History className="h-4 w-4" />,
    },
    {
      name: "Activity Feed",
      href: "/dashboard/activity",
      icon: <Activity className="h-4 w-4" />,
    },
    {
      name: "Templates",
      href: "/dashboard/templates",
      icon: <Store className="h-4 w-4" />,
    },
    {
      name: "Documentation",
      href: "/docs",
      icon: <BookOpen className="h-4 w-4" />,
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: <Settings className="h-4 w-4" />,
    },
  ];

  return (
    <div className="flex min-h-screen bg-black text-foreground font-sans relative">
      {/* Background Radial Mesh Glow */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Sidebar - Desktop Agency Layout */}
      <aside className="hidden md:flex flex-col w-64 border-r border-white/10 bg-zinc-950/80 backdrop-blur-xl shrink-0 z-20">
        {/* Brand Header */}
        <Link
          href="/dashboard"
          className="flex h-16 items-center px-6 gap-3 border-b border-white/10 hover:opacity-90 transition-opacity"
        >
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg overflow-hidden border border-white/20 shadow-[0_0_15px_rgba(99,102,241,0.4)] shrink-0">
            <Image
              src="/icon.png"
              alt="FlowForge AI"
              width={32}
              height={32}
              className="h-full w-full object-cover"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-tight text-white flex items-center gap-1">
              FlowForge<span className="text-indigo-400">AI</span>
            </span>
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">Console</span>
          </div>
        </Link>

        {/* Workspace selector widget */}
        <div className="p-4 border-b border-white/10">
          <WorkspaceSwitcher />
        </div>

        {/* Primary nav list */}
        <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium spring-transition relative",
                  isActive
                    ? "bg-primary text-white font-semibold shadow-md shadow-primary/20"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                )}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer Search & User Details */}
        <div className="p-4 border-t border-white/10 space-y-3">
          <div className="flex items-center justify-between px-3 py-2 text-[11px] text-zinc-400 font-mono bg-black/60 rounded-xl border border-white/10">
            <span className="flex items-center gap-1.5">
              <Keyboard className="h-3.5 w-3.5 text-primary" />
              Ctrl + K
            </span>
            <span className="flex items-center gap-1 text-[10px] text-zinc-500">
              <Search className="h-3 w-3" /> Search
            </span>
          </div>
          <UserProfileMenu />
        </div>
      </aside>

      {/* Mobile Top navbar Header */}
      <div className="flex flex-col flex-1 min-w-0">
        <header className="md:hidden flex h-16 items-center justify-between px-6 border-b border-white/10 bg-zinc-950/90 backdrop-blur-xl z-20">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg overflow-hidden border border-white/20 shadow-[0_0_12px_rgba(99,102,241,0.4)] shrink-0">
              <Image
                src="/icon.png"
                alt="FlowForge AI"
                width={32}
                height={32}
                className="h-full w-full object-cover"
              />
            </div>
            <span className="font-bold text-base text-white tracking-tight flex items-center gap-1">
              FlowForge<span className="text-indigo-400">AI</span>
            </span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="p-1.5 rounded-xl hover:bg-white/10 text-zinc-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </header>

        {/* Mobile menu overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-x-0 top-16 bg-zinc-950 border-b border-white/10 shadow-2xl py-5 px-6 space-y-5 z-20 animate-fade-in glass-panel">
            <WorkspaceSwitcher />
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all",
                      isActive ? "bg-primary text-white font-bold" : "text-zinc-400 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="border-t border-white/10 pt-4">
              <UserProfileMenu />
            </div>
          </div>
        )}

        {/* Main Workspace content viewport */}
        <main className="flex-1 flex flex-col min-h-0 overflow-y-auto relative">
          {children}
        </main>
      </div>

      {/* Global Command Palette search container */}
      <CommandPalette />
    </div>
  );
}
