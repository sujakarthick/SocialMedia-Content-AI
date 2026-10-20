"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Send,
  Copy,
  Check,
  Bookmark,
  Calendar,
  RefreshCw,
  Sliders,
  Layers,
  Globe2,
  AlertCircle,
  Edit3,
  Video,
  Hash,
  ShoppingBag,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { useApp } from "@/context/app-context";
import { useToast } from "@/components/ui/toast";
import {
  SocialPlatform,
  ContentFormat,
  ContentLanguage,
  GeneratedContentOutput,
} from "@/types/database";

export default function ContentStudioPage() {
  const {
    activeBrand,
    canGenerate,
    recordGeneration,
    saveContentItem,
    addCalendarItem,
  } = useApp();
  const toast = useToast();

  const [platform, setPlatform] = useState<SocialPlatform>("instagram");
  const [contentType, setContentType] = useState<ContentFormat>("caption");
  const [language, setLanguage] = useState<ContentLanguage>("tanglish");
  const [topic, setTopic] = useState("Sunday Special Seeraga Samba Mutton Biryani");
  const [offer, setOffer] = useState("Buy 2 Mutton Biryani get 1 Chicken 65 Free");
  const [targetAudience, setTargetAudience] = useState(activeBrand?.target_audience || "Local families & foodies");
  const [tone, setTone] = useState("friendly_trendy");
  const [contentLength, setContentLength] = useState<"short" | "medium" | "long">("medium");

  const [isLoading, setIsLoading] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<GeneratedContentOutput | null>({
    headline: "Sunday-na Biryani illaama epdi boss?! 🍗🔥",
    body: `Vera level manam, authentic seeraga samba arisi, tender mutton chunks marinated in traditional Karaikudi spices! Inaikku Velan Chettinad-la Sunday Special Biryani ready aayiruchu.\n\n✨ Exclusive Offer: Pre-order 2 Mutton Biryani and get Crispy Chicken 65 absolutely FREE! ✨\n\nFamily kooda vaanga, illana Swiggy/Zomato-la order pannunga. Vazhai ilai potu saapda marakkaadheenga!`,
    cta: "Call us at +91 98401 23456 or tap the link in bio to order now! 🛵",
    hashtags: [
      "#ChennaiBiryani",
      "#NammaChennai",
      "#TanglishMemes",
      "#ChettinadFood",
      "#TNagarEats",
      "#SundayBiryaniSpecial",
    ],
    visual_cue: "Close-up slow pan of steam rising from hot seeraga samba biryani pot with fried onions.",
    slides: [
      {
        slide_number: 1,
        headline: "Why Seeraga Samba Mutton Biryani Hits Different?",
        description: "Not Basmati! Pure heirloom short grain rice that absorbs rich mutton marrow juices.",
        visual_note: "Graphic showing grains of Seeraga Samba",
      },
      {
        slide_number: 2,
        headline: "Direct from Karaikudi Spice Grinders",
        description: "Freshly roasted stone-ground spices every morning without artificial coloring.",
        visual_note: "Traditional stone grinder visual",
      },
      {
        slide_number: 3,
        headline: "Sunday Special Free Starter Offer",
        description: "Order 2 Biryanis today and enjoy crispy Chicken 65 on the house!",
        visual_note: "Sizzling red chicken 65 photo",
      },
    ],
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editableBody, setEditableBody] = useState(generatedResult?.body || "");
  const [editableHeadline, setEditableHeadline] = useState(generatedResult?.headline || "");
  const [copied, setCopied] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("2026-10-21");
  const [scheduleTime, setScheduleTime] = useState("12:00");
  const [modelBadge, setModelBadge] = useState<string>("Local Intelligent Engine");
  const [isMockResult, setIsMockResult] = useState(true);

  // Preset topics for quick ideas
  const presetPills = [
    { label: "Sunday Biryani Feast", topic: "Sunday Special Seeraga Samba Mutton Biryani", offer: "Buy 2 get Chicken 65 free" },
    { label: "Aadi Clearance Sale", topic: "Aadi Discount Mega Clearance Sarees", offer: "Flat 40% OFF on all silk sarees" },
    { label: "Bridal Glow Combo", topic: "Pre-Bridal Glow Facial & Hair Treatment", offer: "Save ₹1,500 on advance package booking" },
    { label: "Pongal Thirunaal Offer", topic: "Special Pongal Sweet & Savoury Gift Hampers", offer: "Free Brass Lamp with every ₹2000 order" },
    { label: "Class 10/12 Batch Admission", topic: "Target 2027 Board Exam Foundation Batch", offer: "Free diagnostic test & 10% early bird fee waiver" },
  ];

  const handleGenerate = async () => {
    const quota = canGenerate();
    if (!quota.allowed) {
      toast.error(quota.reason || "Credit limit reached");
      return;
    }

    if (!topic.trim()) {
      toast.error("Please enter a topic or product description.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandId: activeBrand?.id,
          brandName: activeBrand?.name || "Namma Business",
          industry: activeBrand?.industry || "Retail",
          brandDescription: activeBrand?.description,
          platform,
          contentType,
          language,
          topic,
          offer,
          targetAudience,
          tone,
          contentLength,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || "Generation request failed");
      }

      setGeneratedResult(data.output);
      setEditableHeadline(data.output.headline || "");
      setEditableBody(data.output.body || "");
      setIsMockResult(data.is_mock);
      setModelBadge(data.model_used);

      // Record credit deduction in client store
      recordGeneration({
        id: "gen-" + Math.random().toString(36).substring(2, 9),
        organization_id: activeBrand?.organization_id || "org-default-201",
        user_id: "user-default-101",
        brand_id: activeBrand?.id,
        platform,
        content_type: contentType,
        language,
        prompt_inputs: { topic, offer, tone, target_audience: targetAudience },
        output_content: data.output,
        model_used: data.model_used,
        credits_used: 1,
        is_mock: data.is_mock,
        created_at: new Date().toISOString(),
      });

      toast.success(
        data.is_mock
          ? "Generated with Intelligent Engine (Mock Mode)!"
          : "Generated successfully with Gemini AI!"
      );
    } catch (err: any) {
      toast.error(err.message || "Failed to generate content.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyFullPost = () => {
    if (!generatedResult) return;
    const fullText = `${editableHeadline}\n\n${editableBody}\n\n${generatedResult.cta}\n\n${generatedResult.hashtags?.join(" ")}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Copied to clipboard!");
  };

  const handleSaveToLibrary = () => {
    if (!generatedResult) return;
    saveContentItem({
      brand_id: activeBrand?.id,
      title: editableHeadline || topic,
      content: `${editableHeadline}\n\n${editableBody}\n\n${generatedResult.cta}\n\n${generatedResult.hashtags?.join(" ")}`,
      format: contentType,
      platform,
      language,
      tags: [contentType, language, activeBrand?.industry || "business"],
      is_favorite: false,
    });
  };

  const handleSchedulePost = () => {
    if (!generatedResult) return;
    addCalendarItem({
      brand_id: activeBrand?.id,
      title: editableHeadline || topic,
      body: `${editableHeadline}\n\n${editableBody}\n\n${generatedResult.cta}\n\n${generatedResult.hashtags?.join(" ")}`,
      scheduled_date: scheduleDate,
      scheduled_time: scheduleTime,
      platform,
      status: "scheduled",
    });
    setIsScheduleModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Context Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              AI Content Studio
            </h1>
            <Badge variant="indigo" className="text-xs">
              Tamil • Tanglish • English
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Generating context for active brand:{" "}
            <span className="font-bold text-slate-900 dark:text-slate-100">
              {activeBrand?.name || "General Business"}
            </span>{" "}
            ({activeBrand?.industry})
          </p>
        </div>

        {/* Quick presets */}
        <div className="hidden lg:flex items-center gap-1.5 overflow-x-auto pb-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 mr-1">
            Idea Presets:
          </span>
          {presetPills.slice(0, 3).map((pill, idx) => (
            <button
              key={idx}
              onClick={() => {
                setTopic(pill.topic);
                setOffer(pill.offer);
              }}
              className="text-xs px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-indigo-400 hover:text-indigo-600 transition-colors shrink-0 cursor-pointer"
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Studio Grid: Left Form Controls, Right Live Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Generator Form (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-sm flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-indigo-600" />
                  Target Specifications
                </span>
                <span className="text-xs font-normal text-slate-400">1 Credit / generation</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 pt-0">
              {/* Language Selector */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Select Output Language
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "tanglish", label: "Tanglish", sub: "Tamil in English alphabet" },
                    { id: "tamil", label: "தமிழ் (Tamil)", sub: "Native Tamil script" },
                    { id: "english", label: "English", sub: "Polished Indian English" },
                  ].map((l) => (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => setLanguage(l.id as ContentLanguage)}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                        language === l.id
                          ? "border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold ring-2 ring-indigo-500/20"
                          : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      <span className="text-xs block">{l.label}</span>
                      <span className="text-[9px] block text-slate-400">{l.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Social Platform & Format */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Platform
                  </label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value as SocialPlatform)}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="instagram">Instagram</option>
                    <option value="facebook">Facebook</option>
                    <option value="whatsapp">WhatsApp Business</option>
                    <option value="youtube_shorts">YouTube Shorts</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="twitter">X / Twitter</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Content Format
                  </label>
                  <select
                    value={contentType}
                    onChange={(e) => setContentType(e.target.value as ContentFormat)}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="caption">Instagram Caption</option>
                    <option value="reel_hook">Viral Reel Hook</option>
                    <option value="video_script">Video Script (Visuals + Audio)</option>
                    <option value="carousel">Carousel Post Outline</option>
                    <option value="festival_campaign">Festival / Seasonal Campaign</option>
                    <option value="tamil_business_ad">Tamil Business Ad</option>
                    <option value="tanglish_promo">Tanglish Promo Hook</option>
                    <option value="promotional_campaign">Promotional Launch</option>
                    <option value="product_description">Product / Menu Description</option>
                    <option value="content_ideas">Content Pillar Ideas</option>
                    <option value="hashtags">Hashtag Stacks</option>
                    <option value="call_to_action">High-Conversion CTA</option>
                  </select>
                </div>
              </div>

              {/* Topic / Product */}
              <Textarea
                label="Topic, Dish, or Product to Promote"
                required
                rows={2}
                placeholder="e.g. Mutton Chukka, Soft Silk Bridal Sarees, Hydra Facial, Math Crash Course"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />

              {/* Special Offer or Discount */}
              <Input
                label="Offer, Discount, or Call to Action (Optional)"
                placeholder="e.g. Flat 20% OFF this Sunday / Free dessert on pre-orders"
                value={offer}
                onChange={(e) => setOffer(e.target.value)}
              />

              {/* Tone & Length */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Tone of Voice
                  </label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="friendly_trendy">Trendy & Friendly (Vera Level)</option>
                    <option value="traditional_respectful">Traditional & Respectful (மரியாதை)</option>
                    <option value="premium_luxury">Premium & Luxury</option>
                    <option value="urgent_promotional">Urgent / Limited Time Offer</option>
                    <option value="punchy_local">Punchy Local (Chennai Style)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Length
                  </label>
                  <select
                    value={contentLength}
                    onChange={(e) => setContentLength(e.target.value as any)}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="short">Short (Punchy)</option>
                    <option value="medium">Medium (Standard Post)</option>
                    <option value="long">Long (Detailed Narrative)</option>
                  </select>
                </div>
              </div>

              {/* Generate Button */}
              <div className="pt-2">
                <Button
                  onClick={handleGenerate}
                  isLoading={isLoading}
                  className="w-full justify-center gap-2 shadow-md shadow-indigo-500/20 py-2.5"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Generate Content in {language.toUpperCase()}</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: AI Output Display & Workspace Editor (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="border-indigo-100 dark:border-indigo-950/60 shadow-lg">
            <CardHeader className="py-4 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <span>Generated Social Media Copy</span>
                </CardTitle>
                {isMockResult ? (
                  <Badge variant="warning" className="text-[10px]">
                    Mock Demo Mode (Smart Engine)
                  </Badge>
                ) : (
                  <Badge variant="success" className="text-[10px]">
                    Live Gemini AI Output
                  </Badge>
                )}
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 cursor-pointer transition-colors ${
                    isEditing
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                  title="Toggle in-line edit mode"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{isEditing ? "Done" : "Edit"}</span>
                </button>

                <button
                  onClick={handleCopyFullPost}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs flex items-center gap-1 cursor-pointer"
                  title="Copy full text to clipboard"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
                </button>

                <button
                  onClick={handleSaveToLibrary}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs flex items-center gap-1 cursor-pointer"
                  title="Save to Library"
                >
                  <Bookmark className="h-3.5 w-3.5 text-indigo-600" />
                  <span className="hidden sm:inline">Save</span>
                </button>

                <button
                  onClick={() => setIsScheduleModalOpen(true)}
                  className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs flex items-center gap-1 cursor-pointer"
                  title="Schedule on Calendar"
                >
                  <Calendar className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Calendar</span>
                </button>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {generatedResult ? (
                <>
                  {/* Headline / Hook */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block mb-1">
                      Headline / First 3-Sec Hook
                    </span>
                    {isEditing ? (
                      <Input
                        value={editableHeadline}
                        onChange={(e) => setEditableHeadline(e.target.value)}
                        className="font-bold text-sm"
                      />
                    ) : (
                      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                        {editableHeadline}
                      </h3>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                      Primary Post Content
                    </span>
                    {isEditing ? (
                      <Textarea
                        rows={8}
                        value={editableBody}
                        onChange={(e) => setEditableBody(e.target.value)}
                        className="text-sm font-sans leading-relaxed"
                      />
                    ) : (
                      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line font-sans">
                        {editableBody}
                      </div>
                    )}
                  </div>

                  {/* Call to Action */}
                  {generatedResult.cta && (
                    <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 flex items-start gap-2.5">
                      <Send className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 block">
                          Call to Action
                        </span>
                        <p className="text-xs text-emerald-900 dark:text-emerald-200 font-medium mt-0.5">
                          {generatedResult.cta}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Visual Creative Cue */}
                  {generatedResult.visual_cue && (
                    <div className="p-3 rounded-lg bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-800/60 flex items-start gap-2.5">
                      <Video className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 block">
                          Visual & Reel Shoot Direction
                        </span>
                        <p className="text-xs text-indigo-950 dark:text-indigo-200 mt-0.5 leading-relaxed">
                          {generatedResult.visual_cue}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Carousel Slides (if carousel format) */}
                  {generatedResult.slides && generatedResult.slides.length > 0 && (
                    <div className="space-y-3 pt-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                        Carousel Slide Deck Breakdown ({generatedResult.slides.length} Slides)
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {generatedResult.slides.map((s) => (
                          <div
                            key={s.slide_number}
                            className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 space-y-1.5"
                          >
                            <Badge variant="indigo" className="text-[9px]">
                              Slide {s.slide_number}
                            </Badge>
                            <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                              {s.headline}
                            </h5>
                            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight">
                              {s.description}
                            </p>
                            <span className="text-[10px] font-mono text-slate-400 block pt-1 border-t border-slate-200 dark:border-slate-800">
                              🎨 {s.visual_note}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Hashtags Stack */}
                  {generatedResult.hashtags && generatedResult.hashtags.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                        <Hash className="h-3 w-3" />
                        Curated Hashtags
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {generatedResult.hashtags.map((h, i) => (
                          <span
                            key={i}
                            className="text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-medium font-mono"
                          >
                            {h}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-16 space-y-3">
                  <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center mx-auto">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Studio Ready for Input
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Choose your format, language, and topic on the left to generate customized high-performing social copy.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Schedule Modal Dialog */}
      <Modal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        title="Schedule Content on Calendar"
        description="Choose a date and time slot to plan this post on your social media marketing calendar."
      >
        <div className="space-y-4">
          <Input
            label="Scheduled Date"
            type="date"
            value={scheduleDate}
            onChange={(e) => setScheduleDate(e.target.value)}
          />

          <Input
            label="Scheduled Posting Time"
            type="time"
            value={scheduleTime}
            onChange={(e) => setScheduleTime(e.target.value)}
          />

          <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
            <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              <strong>Note on Auto-Publishing:</strong> NammaContent AI logs your planned schedule and creates reminders. To post directly to Instagram/Facebook feeds, connect your verified Meta Business Account in Settings.
            </span>
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" size="sm" onClick={() => setIsScheduleModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSchedulePost} className="gap-1.5">
              <Calendar className="h-4 w-4" />
              Confirm Schedule
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
