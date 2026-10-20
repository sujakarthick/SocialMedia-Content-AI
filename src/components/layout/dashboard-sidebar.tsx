"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  LayoutDashboard,
  PenTool,
  Building2,
  Calendar,
  BookmarkCheck,
  BarChart3,
  CreditCard,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/context/app-context";
import { Badge } from "@/components/ui/badge";

interface SidebarProps {
  onNavigate?: () => void;
}

export function DashboardSidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const { organization, usage } = useApp();

  const navigation = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "AI Content Studio", href: "/dashboard/studio", icon: PenTool, badge: "Tamil & Tanglish" },
    { name: "Brand Workspace", href: "/dashboard/brands", icon: Building2 },
    { name: "Content Calendar", href: "/dashboard/calendar", icon: Calendar },
    { name: "Saved Library", href: "/dashboard/saved", icon: BookmarkCheck },
    { name: "Usage Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { name: "Billing & Plans", href: "/dashboard/billing", icon: CreditCard },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between shrink-0 h-screen sticky top-0">
      <div>
        {/* Brand Logo */}
        <div className="h-16 px-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <span className="font-bold text-base text-slate-900 dark:text-white tracking-tight">
                NammaContent
              </span>
              <span className="text-[10px] block text-indigo-600 dark:text-indigo-400 font-semibold -mt-0.5">
                AI Copilot
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation list */}
        <nav className="p-3 space-y-1">
          {navigation.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group",
                  isActive
                    ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon
                    className={cn(
                      "h-4 w-4 transition-colors",
                      isActive
                        ? "text-indigo-600 dark:text-indigo-400"
                        : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                    )}
                  />
                  <span>{item.name}</span>
                </div>
                {item.badge ? (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-bold">
                    {item.badge}
                  </span>
                ) : (
                  isActive && <ChevronRight className="h-3 w-3 text-indigo-600" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Subscription Tier & Quota Footer */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Plan
            </span>
            <Badge variant="indigo" className="text-[10px] capitalize">
              {organization.plan_tier} Plan
            </Badge>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-slate-600 dark:text-slate-300">
              <span>Monthly Credits</span>
              <span className="font-bold">
                {usage.credits_used} / {usage.credits_limit}
              </span>
            </div>
            <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(
                    100,
                    Math.round((usage.credits_used / usage.credits_limit) * 100)
                  )}%`,
                }}
              />
            </div>
          </div>

          <Link
            href="/dashboard/billing"
            className="block text-center text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline pt-1"
          >
            Manage or Upgrade →
          </Link>
        </div>

        <div className="mt-3 flex items-center justify-between px-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-900 dark:hover:text-slate-300">
            Public Website
          </Link>
          <Link href="/auth/login" className="flex items-center gap-1 hover:text-red-500">
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign out</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
