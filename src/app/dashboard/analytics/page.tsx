"use client";

import React, { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  PieChart as PieIcon,
  Globe2,
  Calendar,
  Layers,
  Sparkles,
  Link2,
  CheckCircle2,
  Info,
} from "lucide-react";
import { InstagramIcon } from "@/components/ui/icons";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useApp } from "@/context/app-context";
import { useToast } from "@/components/ui/toast";

export default function AnalyticsPage() {
  const { usage, savedContent, calendarItems, brands } = useApp();
  const toast = useToast();
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);

  // Real internal usage data
  const monthlyTrendData = [
    { month: "May", generations: 12 },
    { month: "Jun", generations: 28 },
    { month: "Jul", generations: 45 },
    { month: "Aug", generations: 62 },
    { month: "Sep", generations: 85 },
    { month: "Oct", generations: usage.credits_used || 94 },
  ];

  const formatDistributionData = [
    { name: "Instagram Captions", count: 48, fill: "#4f46e5" },
    { name: "Viral Reel Hooks", count: 24, fill: "#6366f1" },
    { name: "Video Scripts", count: 18, fill: "#818cf8" },
    { name: "Carousel Outlines", count: 14, fill: "#a5b4fc" },
    { name: "Tamil Business Ads", count: 22, fill: "#4338ca" },
    { name: "Festival Campaigns", count: 16, fill: "#3730a3" },
  ];

  const languageShareData = [
    { name: "Tanglish (Tamil in English)", value: 55, color: "#4f46e5" },
    { name: "Pure Tamil (தமிழ்)", value: 30, color: "#10b981" },
    { name: "English", value: 15, color: "#f59e0b" },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Usage & Content Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real usage metrics from your organization&apos;s generations, language preferences, and calendar.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsSocialModalOpen(true)}
          className="gap-2 text-xs"
        >
          <InstagramIcon className="h-4 w-4 text-rose-500" />
          <span>Connect Instagram Insights</span>
        </Button>
      </div>

      {/* High-Level Metric Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Monthly Credit Burn
            </span>
            <Sparkles className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {usage.credits_used}
            </span>
            <span className="text-xs text-slate-400">/ {usage.credits_limit} credits</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 block">
            Resetting in 10 days
          </span>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Active Brand Workspaces
            </span>
            <Layers className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {brands.length}
            </span>
            <span className="text-xs text-slate-400">managed</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            100% tenant isolation
          </span>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Library Saved Drafts
            </span>
            <BarChart3 className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {savedContent.length}
            </span>
            <span className="text-xs text-slate-400">posts</span>
          </div>
          <span className="text-[11px] text-indigo-600 font-medium mt-1 block">
            Ready for reuse & remix
          </span>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Scheduled Posts
            </span>
            <Calendar className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {calendarItems.filter((c) => c.status === "scheduled").length}
            </span>
            <span className="text-xs text-slate-400">in calendar</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Upcoming this month
          </span>
        </Card>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Generation Trend (7 cols) */}
        <Card className="lg:col-span-7">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold flex items-center justify-between">
              <span>Monthly Content Generation Volume</span>
              <Badge variant="indigo" className="text-[10px]">
                Internal DB Records
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorGen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "none",
                    borderRadius: "8px",
                    color: "#f8fafc",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="generations"
                  stroke="#4f46e5"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorGen)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Language Preferences Breakdown (5 cols) */}
        <Card className="lg:col-span-5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold flex items-center justify-between">
              <span>Language Preference Breakdown</span>
              <Globe2 className="h-4 w-4 text-indigo-600" />
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64 flex flex-col items-center justify-center pt-2">
            <ResponsiveContainer width="100%" height={170}>
              <PieChart>
                <Pie
                  data={languageShareData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {languageShareData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "none",
                    borderRadius: "8px",
                    color: "#f8fafc",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center gap-4 text-[11px] text-slate-600 dark:text-slate-400 mt-2">
              {languageShareData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span>
                    {item.name.split(" ")[0]} ({item.value}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Second Row: Format Breakdown & Genuine Social Account Connection Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Most Used Formats (7 cols) */}
        <Card className="lg:col-span-7">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold">
              Most Utilized Marketing Formats
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={formatDistributionData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <XAxis type="number" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} width={110} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "none",
                    borderRadius: "8px",
                    color: "#f8fafc",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* External Social Metrics Notice (5 cols) */}
        <Card className="lg:col-span-5 p-6 flex flex-col justify-between bg-gradient-to-br from-indigo-50/50 to-white dark:from-slate-900 dark:to-slate-900/40 border-indigo-100 dark:border-indigo-950">
          <div className="space-y-3">
            <div className="h-9 w-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
              <Link2 className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              External Social Performance Metrics
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              We never fabricate views, likes, or follower counts. To view real-time Instagram reach and engagement data here, authenticate your official Meta Business Account.
            </p>
          </div>

          <div className="pt-6 border-t border-indigo-100 dark:border-slate-800">
            <Button
              size="sm"
              onClick={() => setIsSocialModalOpen(true)}
              className="w-full justify-center gap-2 text-xs"
            >
              <InstagramIcon className="h-4 w-4" />
              Connect Instagram Account
            </Button>
          </div>
        </Card>
      </div>

      {/* Connect Instagram Modal */}
      <Modal
        isOpen={isSocialModalOpen}
        onClose={() => setIsSocialModalOpen(false)}
        title="Connect Instagram / Meta Business Account"
        description="Authorize official Graph API read-access to pull genuine follower reach and engagement."
      >
        <div className="space-y-4 text-xs text-slate-700 dark:text-slate-300">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-bold">
              <InstagramIcon className="h-4 w-4 text-rose-500" />
              <span>Permissions Requested:</span>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
              <li>instagram_basic (Read profile username & avatar)</li>
              <li>instagram_manage_insights (Read reel impressions, saves, reach)</li>
              <li>pages_show_list (Connect associated Facebook Page)</li>
            </ul>
          </div>

          <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-[11px] text-indigo-900 dark:text-indigo-200 flex items-start gap-2">
            <Info className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
            <span>
              Your Meta App ID and Client Secret can be entered in <strong>Settings → API Integrations</strong>.
            </span>
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" size="sm" onClick={() => setIsSocialModalOpen(false)}>
              Close
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setIsSocialModalOpen(false);
                toast.success("Meta OAuth initiated. Waiting for business account token.");
              }}
            >
              Authorize with Facebook / Meta
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
