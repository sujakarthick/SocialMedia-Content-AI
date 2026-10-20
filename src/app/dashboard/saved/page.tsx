"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bookmark,
  Search,
  Star,
  Copy,
  Check,
  Trash2,
  Share2,
  Calendar,
  PenTool,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useApp } from "@/context/app-context";
import { useToast } from "@/components/ui/toast";
import { SavedContent } from "@/types/database";

export default function SavedContentPage() {
  const { savedContent, toggleFavorite, deleteSavedItem, addCalendarItem } = useApp();
  const toast = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredItems = savedContent.filter((item) => {
    if (onlyFavorites && !item.is_favorite) return false;
    if (selectedFormat !== "all" && item.format !== selectedFormat) return false;
    if (selectedLanguage !== "all" && item.language !== selectedLanguage) return false;
    if (
      searchQuery &&
      !item.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.content.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const handleCopy = (item: SavedContent) => {
    navigator.clipboard.writeText(item.content);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success("Copied to clipboard!");
  };

  const handleQuickSchedule = (item: SavedContent) => {
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
    addCalendarItem({
      brand_id: item.brand_id,
      saved_content_id: item.id,
      title: item.title,
      body: item.content,
      scheduled_date: tomorrow,
      scheduled_time: "12:00",
      platform: item.platform,
      status: "scheduled",
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Saved Content Library
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Access, remix, and schedule your favorite high-performing posts and generated captions.
          </p>
        </div>

        <Link href="/dashboard/studio">
          <Button size="sm" className="gap-1.5">
            <PenTool className="h-4 w-4" />
            <span>Generate New Post</span>
          </Button>
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
        <div className="relative w-full sm:w-72">
          <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search saved copy..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Format */}
          <select
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value)}
            className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200"
          >
            <option value="all">All Formats</option>
            <option value="caption">Captions</option>
            <option value="reel_hook">Reel Hooks</option>
            <option value="tamil_business_ad">Tamil Business Ads</option>
            <option value="festival_campaign">Festival Campaigns</option>
          </select>

          {/* Language */}
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200"
          >
            <option value="all">All Languages</option>
            <option value="tanglish">Tanglish</option>
            <option value="tamil">தமிழ் (Tamil)</option>
            <option value="english">English</option>
          </select>

          {/* Favourites Only */}
          <button
            onClick={() => setOnlyFavorites(!onlyFavorites)}
            className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 font-semibold transition-all cursor-pointer ${
              onlyFavorites
                ? "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300"
                : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
            }`}
          >
            <Star className={`h-3.5 w-3.5 ${onlyFavorites ? "fill-amber-500 text-amber-500" : ""}`} />
            <span>Starred</span>
          </button>
        </div>
      </div>

      {/* Grid of Saved Items */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <Bookmark className="h-10 w-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            No saved posts found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            When you generate great posts in the AI Content Studio, click &quot;Save&quot; to archive them here.
          </p>
          <Link href="/dashboard/studio" className="inline-block pt-2">
            <Button size="sm">Go to AI Studio</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="flex flex-col justify-between hover:border-slate-300">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-sm font-bold truncate">
                    {item.title}
                  </CardTitle>
                  <button
                    onClick={() => toggleFavorite(item.id)}
                    className="text-slate-400 hover:text-amber-500 cursor-pointer p-0.5"
                    title={item.is_favorite ? "Remove star" : "Star item"}
                  >
                    <Star
                      className={`h-4 w-4 ${
                        item.is_favorite ? "fill-amber-500 text-amber-500" : ""
                      }`}
                    />
                  </button>
                </div>
                <div className="flex items-center gap-1.5 pt-1">
                  <Badge variant="indigo" className="text-[10px] uppercase">
                    {item.platform}
                  </Badge>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold uppercase">
                    {item.language}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-5 leading-relaxed whitespace-pre-line font-sans">
                  {item.content}
                </p>
              </CardContent>

              <CardFooter className="pt-3 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(item)}
                  className="flex-1 text-xs gap-1"
                >
                  {copiedId === item.id ? (
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  <span>{copiedId === item.id ? "Copied" : "Copy"}</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickSchedule(item)}
                  className="text-xs gap-1"
                  title="Schedule for tomorrow"
                >
                  <Calendar className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Schedule</span>
                </Button>

                <button
                  onClick={() => deleteSavedItem(item.id)}
                  className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"
                  title="Delete from library"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
