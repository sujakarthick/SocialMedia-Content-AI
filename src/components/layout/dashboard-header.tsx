"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Menu,
  Sparkles,
  Building2,
  ChevronDown,
  PlusCircle,
  Zap,
  Check,
} from "lucide-react";
import { useApp } from "@/context/app-context";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export function DashboardHeader({ onToggleSidebar }: HeaderProps) {
  const { brands, activeBrand, setActiveBrandId, usage } = useApp();
  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Mobile hamburger & Active Brand Switcher */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Brand Switcher Popover */}
        <div className="relative">
          <button
            onClick={() => setBrandDropdownOpen(!brandDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left cursor-pointer"
          >
            <div className="h-6 w-6 rounded-lg bg-indigo-100 dark:bg-indigo-900/80 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-xs">
              {activeBrand?.name ? activeBrand.name.charAt(0) : "B"}
            </div>
            <div className="hidden sm:block">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block max-w-[160px] truncate">
                {activeBrand?.name || "Select Brand"}
              </span>
              <span className="text-[10px] text-slate-500 capitalize block -mt-0.5">
                {activeBrand?.industry || "workspace"}
              </span>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {brandDropdownOpen && (
            <div className="absolute left-0 mt-2 w-64 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow-xl z-50 animate-in fade-in zoom-in-95">
              <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Switch Brand Workspace
              </div>
              <div className="space-y-1">
                {brands.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => {
                      setActiveBrandId(b.id);
                      setBrandDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-xs font-semibold text-left transition-colors cursor-pointer ${
                      b.id === activeBrand?.id
                        ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <div className="h-5 w-5 rounded bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px]">
                        {b.name.charAt(0)}
                      </div>
                      <span className="truncate">{b.name}</span>
                    </div>
                    {b.id === activeBrand?.id && <Check className="h-3.5 w-3.5 text-indigo-600" />}
                  </button>
                ))}
              </div>

              <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <Link
                  href="/dashboard/brands"
                  onClick={() => setBrandDropdownOpen(false)}
                  className="flex items-center gap-2 p-2 rounded-lg text-xs font-semibold text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Manage or Add Brands</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right: Credits, Create CTA & Theme */}
      <div className="flex items-center gap-3">
        {/* Credits remaining indicator */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 font-medium">
          <Zap className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
          <span>
            {usage.credits_limit - usage.credits_used} credits left
          </span>
        </div>

        <ThemeToggle />

        <Link href="/dashboard/studio">
          <Button size="sm" className="gap-1.5 shadow-xs">
            <Sparkles className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">New Content</span>
          </Button>
        </Link>
      </div>
    </header>
  );
}
