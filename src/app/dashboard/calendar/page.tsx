"use client";

import React, { useState } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Filter,
  CheckCircle2,
  AlertCircle,
  Share2,
  Trash2,
  Edit2,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useApp } from "@/context/app-context";
import { useToast } from "@/components/ui/toast";
import {
  ContentCalendarItem,
  SocialPlatform,
  CalendarStatus,
} from "@/types/database";

export default function CalendarPage() {
  const {
    calendarItems,
    brands,
    activeBrand,
    addCalendarItem,
    updateCalendarStatus,
    deleteCalendarItem,
  } = useApp();
  const toast = useToast();

  const [viewMode, setViewMode] = useState<"month" | "list">("month");
  const [selectedBrandFilter, setSelectedBrandFilter] = useState<string>("all");
  const [selectedPlatformFilter, setSelectedPlatformFilter] = useState<string>("all");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("all");

  const [currentDate, setCurrentDate] = useState(() => new Date("2026-10-20T00:00:00"));
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedItemForView, setSelectedItemForView] = useState<ContentCalendarItem | null>(null);

  const [formTitle, setFormTitle] = useState("");
  const [formBody, setFormBody] = useState("");
  const [formDate, setFormDate] = useState("2026-10-21");
  const [formTime, setFormTime] = useState("11:30");
  const [formPlatform, setFormPlatform] = useState<SocialPlatform>("instagram");
  const [formStatus, setFormStatus] = useState<CalendarStatus>("scheduled");

  // Filter items
  const filteredItems = calendarItems.filter((item) => {
    if (selectedBrandFilter !== "all" && item.brand_id !== selectedBrandFilter) return false;
    if (selectedPlatformFilter !== "all" && item.platform !== selectedPlatformFilter) return false;
    if (selectedStatusFilter !== "all" && item.status !== selectedStatusFilter) return false;
    return true;
  });

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  const firstDayIndex = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const handleCreateNew = () => {
    if (!formTitle.trim() || !formBody.trim()) {
      toast.error("Please provide both a title and post content.");
      return;
    }

    addCalendarItem({
      brand_id: activeBrand?.id,
      title: formTitle,
      body: formBody,
      scheduled_date: formDate,
      scheduled_time: formTime,
      platform: formPlatform,
      status: formStatus,
    });

    setIsAddModalOpen(false);
    setFormTitle("");
    setFormBody("");
  };

  const getStatusBadge = (status: CalendarStatus) => {
    switch (status) {
      case "scheduled":
        return <Badge variant="indigo">Scheduled</Badge>;
      case "published":
        return <Badge variant="success">Published</Badge>;
      case "draft":
        return <Badge variant="default">Draft</Badge>;
      case "failed":
        return <Badge variant="danger">Failed</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Marketing Content Calendar
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Organize upcoming social posts, schedule planned campaigns, and manage reminders.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setViewMode("month")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                viewMode === "month"
                  ? "bg-white dark:bg-slate-900 text-indigo-600 shadow-xs"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              Month View
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                viewMode === "list"
                  ? "bg-white dark:bg-slate-900 text-indigo-600 shadow-xs"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              List View ({filteredItems.length})
            </button>
          </div>

          <Button onClick={() => setIsAddModalOpen(true)} size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            <span>Schedule Post</span>
          </Button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-1.5 text-slate-500">
          <Filter className="h-3.5 w-3.5" />
          <span>Filters:</span>
        </div>

        {/* Brand Filter */}
        <select
          value={selectedBrandFilter}
          onChange={(e) => setSelectedBrandFilter(e.target.value)}
          className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 text-xs text-slate-800 dark:text-slate-200"
        >
          <option value="all">All Brands</option>
          {brands.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>

        {/* Platform Filter */}
        <select
          value={selectedPlatformFilter}
          onChange={(e) => setSelectedPlatformFilter(e.target.value)}
          className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 text-xs text-slate-800 dark:text-slate-200"
        >
          <option value="all">All Platforms</option>
          <option value="instagram">Instagram</option>
          <option value="facebook">Facebook</option>
          <option value="whatsapp">WhatsApp</option>
          <option value="youtube_shorts">YouTube Shorts</option>
          <option value="linkedin">LinkedIn</option>
        </select>

        {/* Status Filter */}
        <select
          value={selectedStatusFilter}
          onChange={(e) => setSelectedStatusFilter(e.target.value)}
          className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 text-xs text-slate-800 dark:text-slate-200"
        >
          <option value="all">All Statuses</option>
          <option value="scheduled">Scheduled</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="failed">Failed</option>
        </select>

        <div className="ml-auto flex items-center gap-1.5 text-[11px] text-slate-500">
          <span className="inline-block h-2 w-2 rounded-full bg-indigo-500" /> Scheduled
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 ml-2" /> Published
          <span className="inline-block h-2 w-2 rounded-full bg-slate-400 ml-2" /> Draft
        </div>
      </div>

      {/* Disclaimers / Publishing Notice */}
      <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-900 dark:text-indigo-200 flex items-start gap-2.5">
        <Info className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
        <span>
          <strong>Publishing Control:</strong> NammaContent AI coordinates your editorial calendar and reminders. Direct 1-click automatic publishing is executed when your Instagram Graph API credentials are authenticated in Settings. Otherwise, copy the scheduled draft directly to your Instagram App.
        </span>
      </div>

      {/* Month Grid View */}
      {viewMode === "month" && (
        <Card>
          <CardHeader className="py-4 flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <CalendarIcon className="h-5 w-5 text-indigo-600" />
              <CardTitle className="text-base font-bold">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </CardTitle>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handlePrevMonth} className="p-2">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(new Date())}
                className="text-xs"
              >
                Today
              </Button>
              <Button variant="outline" size="sm" onClick={handleNextMonth} className="p-2">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {/* Days of week header */}
            <div className="grid grid-cols-7 border-b border-slate-100 dark:border-slate-800 text-center py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <div>Sun</div>
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
            </div>

            {/* Calendar Cells */}
            <div className="grid grid-cols-7 auto-rows-fr">
              {Array.from({ length: firstDayIndex }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="min-h-[110px] p-2 border-b border-r border-slate-100 dark:border-slate-800/60 bg-slate-50/40 dark:bg-slate-900/40"
                />
              ))}

              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const formattedDay = dayNum < 10 ? `0${dayNum}` : `${dayNum}`;
                const formattedMonth =
                  currentDate.getMonth() + 1 < 10
                    ? `0${currentDate.getMonth() + 1}`
                    : `${currentDate.getMonth() + 1}`;
                const dateKey = `${currentDate.getFullYear()}-${formattedMonth}-${formattedDay}`;

                const itemsOnThisDay = filteredItems.filter(
                  (item) => item.scheduled_date === dateKey
                );

                const isToday = "2026-10-20" === dateKey;

                return (
                  <div
                    key={dayNum}
                    className={`min-h-[110px] p-2 border-b border-r border-slate-100 dark:border-slate-800 relative transition-colors ${
                      isToday ? "bg-indigo-50/30 dark:bg-indigo-950/20" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`text-xs font-bold ${
                          isToday
                            ? "h-5 w-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]"
                            : "text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {dayNum}
                      </span>
                    </div>

                    <div className="space-y-1 overflow-y-auto max-h-[80px]">
                      {itemsOnThisDay.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setSelectedItemForView(item)}
                          className={`w-full text-left p-1.5 rounded text-[11px] font-medium border truncate block transition-all cursor-pointer ${
                            item.status === "scheduled"
                              ? "bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border-indigo-200"
                              : item.status === "published"
                              ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200"
                          }`}
                        >
                          <div className="flex items-center gap-1">
                            <Clock className="h-2.5 w-2.5 shrink-0" />
                            <span className="truncate">{item.title}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <div className="space-y-3">
          {filteredItems.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <CalendarIcon className="h-10 w-10 text-slate-400 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                No scheduled posts found
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Generate new content in the Studio or schedule a draft to appear here.
              </p>
              <Button
                size="sm"
                className="mt-4"
                onClick={() => setIsAddModalOpen(true)}
              >
                Schedule First Post
              </Button>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs hover:border-indigo-300 transition-colors"
              >
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {item.title}
                    </span>
                    {getStatusBadge(item.status)}
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase font-bold">
                      {item.platform}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                    {item.body}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <CalendarIcon className="h-3 w-3" />
                      {item.scheduled_date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {item.scheduled_time}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={item.status}
                    onChange={(e) => updateCalendarStatus(item.id, e.target.value as any)}
                    className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1 text-xs text-slate-800 dark:text-slate-200"
                  >
                    <option value="draft">Draft</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="published">Published</option>
                    <option value="failed">Failed</option>
                  </select>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedItemForView(item)}
                    className="text-xs"
                  >
                    View
                  </Button>

                  <button
                    onClick={() => deleteCalendarItem(item.id)}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                    title="Delete item"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Add New Calendar Item Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Schedule Planned Content"
        description="Add a new post directly to your social calendar."
        maxWidth="lg"
      >
        <div className="space-y-4">
          <Input
            label="Campaign or Post Title"
            required
            placeholder="e.g. Sunday Biryani Offer Reel"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Scheduled Date"
              type="date"
              value={formDate}
              onChange={(e) => setFormDate(e.target.value)}
            />

            <Input
              label="Scheduled Time"
              type="time"
              value={formTime}
              onChange={(e) => setFormTime(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Platform
              </label>
              <select
                value={formPlatform}
                onChange={(e) => setFormPlatform(e.target.value as any)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="instagram">Instagram</option>
                <option value="facebook">Facebook</option>
                <option value="whatsapp">WhatsApp Business</option>
                <option value="youtube_shorts">YouTube Shorts</option>
                <option value="linkedin">LinkedIn</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Status
              </label>
              <select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as any)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="scheduled">Scheduled</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          <Textarea
            label="Post Body / Caption & Hashtags"
            rows={4}
            required
            placeholder="Type your copy in Tamil, Tanglish, or English..."
            value={formBody}
            onChange={(e) => setFormBody(e.target.value)}
          />

          <div className="pt-4 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" size="sm" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleCreateNew}>
              Save to Calendar
            </Button>
          </div>
        </div>
      </Modal>

      {/* View Item Details Modal */}
      {selectedItemForView && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedItemForView(null)}
          title={selectedItemForView.title}
          description={`Scheduled for ${selectedItemForView.scheduled_date} at ${selectedItemForView.scheduled_time} on ${selectedItemForView.platform}`}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Status:</span>
              {getStatusBadge(selectedItemForView.status)}
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed font-sans">
              {selectedItemForView.body}
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(selectedItemForView.body);
                  toast.success("Post content copied to clipboard!");
                }}
              >
                Copy Text
              </Button>

              <Button size="sm" onClick={() => setSelectedItemForView(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
