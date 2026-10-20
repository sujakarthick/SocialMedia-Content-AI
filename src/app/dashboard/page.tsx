"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  Zap,
  Bookmark,
  Calendar,
  Building2,
  ArrowRight,
  TrendingUp,
  Clock,
  Layers,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/context/app-context";
import { useToast } from "@/components/ui/toast";
import { PLAN_CONFIGS } from "@/types/database";

export default function DashboardOverviewPage() {
  const {
    profile,
    organization,
    brands,
    activeBrand,
    setActiveBrandId,
    usage,
    savedContent,
    calendarItems,
  } = useApp();
  const toast = useToast();

  const plan = PLAN_CONFIGS[organization.plan_tier];
  const creditsRemaining = Math.max(0, usage.credits_limit - usage.credits_used);
  const upcomingPosts = calendarItems
    .filter((item) => item.status === "scheduled")
    .slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800 text-white shadow-xl shadow-indigo-500/10">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-[11px] font-semibold text-white backdrop-blur-xs">
            <Sparkles className="h-3 w-3" />
            <span>Active Brand: {activeBrand?.name || "General Workspace"}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Vanakkam, {profile.full_name}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-indigo-100 max-w-xl">
            Your Tamil, Tanglish & English AI social copilot is ready. What would you like to create today?
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/dashboard/studio">
            <Button size="md" className="bg-white text-indigo-700 hover:bg-indigo-50 shadow-md gap-2 font-bold text-xs sm:text-sm">
              <Sparkles className="h-4 w-4" />
              Open AI Studio
            </Button>
          </Link>
          <Link href="/dashboard/calendar">
            <Button
              variant="outline"
              size="md"
              className="border-white/30 text-white hover:bg-white/10 text-xs sm:text-sm"
            >
              Plan Calendar
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Stat KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Remaining AI Credits */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Remaining AI Credits
            </span>
            <div className="h-8 w-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
              <Zap className="h-4 w-4 fill-amber-500" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {creditsRemaining}
            </span>
            <span className="text-xs text-slate-400">/ {usage.credits_limit}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Plan: {plan.name}</span>
            <Link href="/dashboard/billing" className="text-indigo-600 font-semibold hover:underline">
              Upgrade →
            </Link>
          </div>
        </Card>

        {/* Total Generated This Month */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Generated This Month
            </span>
            <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {usage.credits_used}
            </span>
            <span className="text-xs text-slate-400">posts</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-600 font-medium">
            Active content velocity
          </div>
        </Card>

        {/* Saved Drafts */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Saved Library Drafts
            </span>
            <div className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <Bookmark className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {savedContent.length}
            </span>
            <span className="text-xs text-slate-400">saved</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            <Link href="/dashboard/saved" className="hover:underline">
              View all library items →
            </Link>
          </div>
        </Card>

        {/* Scheduled Posts */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Upcoming Scheduled
            </span>
            <div className="h-8 w-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
              <Calendar className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {upcomingPosts.length}
            </span>
            <span className="text-xs text-slate-400">scheduled</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            <Link href="/dashboard/calendar" className="hover:underline">
              Open calendar →
            </Link>
          </div>
        </Card>
      </div>

      {/* Middle Section: Brand Workspaces & Upcoming Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Brand Profiles Quick Switcher (5 cols) */}
        <Card className="lg:col-span-5">
          <CardHeader className="py-4 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Building2 className="h-4 w-4 text-indigo-600" />
              <span>Brand Workspaces ({brands.length})</span>
            </CardTitle>
            <Link
              href="/dashboard/brands"
              className="text-xs font-semibold text-indigo-600 hover:underline"
            >
              Manage
            </Link>
          </CardHeader>

          <CardContent className="space-y-3 pt-0">
            {brands.map((b) => {
              const isSelected = b.id === activeBrand?.id;
              return (
                <div
                  key={b.id}
                  onClick={() => setActiveBrandId(b.id)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    isSelected
                      ? "border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-xs">
                      {b.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {b.name}
                      </h4>
                      <p className="text-[10px] text-slate-500 capitalize">
                        {b.industry} &middot; {b.location_address || "Tamil Nadu"}
                      </p>
                    </div>
                  </div>

                  {isSelected ? (
                    <Badge variant="indigo" className="text-[9px]">
                      Active
                    </Badge>
                  ) : (
                    <span className="text-[11px] text-slate-400 hover:text-indigo-600 font-semibold">
                      Switch
                    </span>
                  )}
                </div>
              );
            })}

            <Link
              href="/dashboard/brands"
              className="flex items-center justify-center gap-1.5 p-2 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:border-indigo-500 hover:text-indigo-600 transition-colors"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Add Brand Profile</span>
            </Link>
          </CardContent>
        </Card>

        {/* Upcoming Posts on Calendar (7 cols) */}
        <Card className="lg:col-span-7">
          <CardHeader className="py-4 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Calendar className="h-4 w-4 text-indigo-600" />
              <span>Upcoming Scheduled Content</span>
            </CardTitle>
            <Link
              href="/dashboard/calendar"
              className="text-xs font-semibold text-indigo-600 hover:underline"
            >
              View Calendar
            </Link>
          </CardHeader>

          <CardContent className="space-y-3 pt-0">
            {upcomingPosts.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500">
                No upcoming scheduled posts. Head over to the Content Studio to draft and schedule posts.
              </div>
            ) : (
              upcomingPosts.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {item.title}
                      </span>
                      <Badge variant="indigo" className="text-[9px] uppercase">
                        {item.platform}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-1">
                      {item.body}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500 shrink-0">
                    <Clock className="h-3.5 w-3.5" />
                    <span>
                      {item.scheduled_date} at {item.scheduled_time}
                    </span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Subscription Alert & Call-to-Action */}
      <Card className="p-6 bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
              Current Plan: {plan.name}
            </span>
            <Badge variant="success" className="text-[10px]">
              Active
            </Badge>
          </div>
          <p className="text-xs text-slate-500">
            Need more generations or multiple client brands? Upgrade to Pro or Agency anytime.
          </p>
        </div>

        <Link href="/dashboard/billing">
          <Button size="sm" className="gap-1.5 shrink-0">
            <span>Manage Subscription</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </Card>
    </div>
  );
}
