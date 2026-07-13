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
} from "lucide-react";
import Link from "next/link";
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
      <div className="flex min-h-screen flex-1 flex-col items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-4">
          <Activity className="h-10 w-10 animate-pulse text-primary" />
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
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
      {/* Background Radial Glow */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Sidebar - Desktop Layout */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card/45 backdrop-blur-md shrink-0">
        {/* Brand Header */}
        <div className="flex h-16 items-center px-6 gap-2.5 border-b border-border/80">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-violet-600 shadow shadow-primary/25">
            <Activity className="h-4.5 w-4.5 text-white" />
          </div>
          <span className="font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            FlowForge AI
          </span>
        </div>

        {/* Workspace selector widget */}
        <div className="p-4 border-b border-border/80">
          <WorkspaceSwitcher />
        </div>

        {/* Primary nav list */}
        <nav className="flex-1 space-y-1.5 p-4 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow shadow-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
                )}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer User Details */}
        <div className="p-4 border-t border-border/80 space-y-3">
          <div className="flex items-center justify-between px-2.5 py-1 text-[10px] text-muted-foreground font-semibold bg-zinc-950/45 rounded border border-border/60">
            <span className="flex items-center gap-1.5 font-mono">
              <Keyboard className="h-3.5 w-3.5" />
              Ctrl + K
            </span>
            <span>Search</span>
          </div>
          <UserProfileMenu />
        </div>
      </aside>

      {/* Mobile Top navbar Header */}
      <div className="flex flex-col flex-1 min-w-0">
        <header className="md:hidden flex h-16 items-center justify-between px-6 border-b border-border bg-card/45 backdrop-blur-md z-20">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-violet-600">
              <Activity className="h-4.5 w-4.5 text-white" />
            </div>
            <span className="font-bold tracking-tight">FlowForge AI</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </header>

        {/* Mobile menu overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-x-0 top-16 bg-card border-b border-border shadow-xl py-4 px-6 space-y-4 z-20 animate-fade-in glass-panel">
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
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all",
                      isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                    )}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="border-t border-border/80 pt-4">
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
