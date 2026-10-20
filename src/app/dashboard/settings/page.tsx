"use client";

import React, { useState } from "react";
import {
  Settings as SettingsIcon,
  User,
  Key,
  Shield,
  Download,
  Trash2,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/context/app-context";
import { useToast } from "@/components/ui/toast";
import { ContentLanguage } from "@/types/database";

export default function SettingsPage() {
  const { profile, organization, brands, savedContent, calendarItems, resetAllData } = useApp();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState<"profile" | "integrations" | "privacy">("profile");

  const [name, setName] = useState(profile.full_name);
  const [phone, setPhone] = useState(profile.phone || "+91 98401 23456");
  const [preferredLang, setPreferredLang] = useState<ContentLanguage>(profile.preferred_language);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile preferences saved successfully!");
  };

  const handleExportData = () => {
    const exportPayload = {
      exported_at: new Date().toISOString(),
      user: {
        name,
        phone,
        preferred_language: preferredLang,
      },
      organization,
      brands,
      saved_content: savedContent,
      calendar_items: calendarItems,
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `nammacontent_data_export_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    toast.success("Workspace data exported to JSON!");
  };

  const handleResetWorkspace = () => {
    if (confirm("Reset workspace to factory demo state? This will restore original Tamil Nadu demo business profiles.")) {
      resetAllData();
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Settings & Integrations
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your account profile, API credentials, team members, and data compliance.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
            activeTab === "profile"
              ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
          }`}
        >
          Profile & Preferences
        </button>

        <button
          onClick={() => setActiveTab("integrations")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
            activeTab === "integrations"
              ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
          }`}
        >
          API Keys & Credentials
        </button>

        <button
          onClick={() => setActiveTab("privacy")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
            activeTab === "privacy"
              ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
          }`}
        >
          Privacy, Export & Reset
        </button>
      </div>

      {/* Tab 1: Profile & Preferences */}
      {activeTab === "profile" && (
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4 text-indigo-600" />
              <span>Personal & Work Preferences</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <Input
                label="Full Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <Input
                label="Email Address"
                disabled
                value={organization.billing_email || "karthik@velanmedia.in"}
                helperText="Email changes require administrative verification."
              />

              <Input
                label="WhatsApp / Phone Contact"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Default Platform Language
                </label>
                <select
                  value={preferredLang}
                  onChange={(e) => setPreferredLang(e.target.value as ContentLanguage)}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="tanglish">Tanglish (Tamil in English alphabet)</option>
                  <option value="tamil">தமிழ் (Pure & Conversational Tamil)</option>
                  <option value="english">English (Polished Indian English)</option>
                </select>
              </div>

              <div className="pt-2">
                <Button type="submit" size="sm">
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Tab 2: API Keys & Credentials */}
      {activeTab === "integrations" && (
        <div className="space-y-6 max-w-3xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Key className="h-4 w-4 text-indigo-600" />
                <span>External Service Credentials (.env.local)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>
                To run external integrations with real cloud APIs in production, configure these variables in your root <code>.env.local</code> file or Vercel Environment Variables.
              </p>

              {/* Variable Checklist */}
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                      GEMINI_API_KEY
                    </span>
                    <Badge variant="indigo" className="text-[10px]">
                      LLM Provider
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Google Gemini 1.5/2.0 API key for live AI inference. (Falls back to Intelligent Mock Engine if unconfigured).
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                      NEXT_PUBLIC_SUPABASE_URL &amp; SUPABASE_SERVICE_ROLE_KEY
                    </span>
                    <Badge variant="indigo" className="text-[10px]">
                      Database &amp; Auth
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Supabase PostgreSQL database endpoint and admin service role key for RLS multi-tenant storage.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                      RAZORPAY_KEY_ID &amp; RAZORPAY_KEY_SECRET
                    </span>
                    <Badge variant="indigo" className="text-[10px]">
                      Payments
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Razorpay subscription keys for INR billing, webhook signature verification, and automated recurring debits.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab 3: Privacy, Data Export & Reset */}
      {activeTab === "privacy" && (
        <div className="space-y-6 max-w-3xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-600" />
                <span>Data Privacy Compliance (DPDP Act 2023)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs text-slate-600 dark:text-slate-300">
              <p>
                Under India&apos;s Digital Personal Data Protection Act, you maintain full control over your stored business data, brand voice profiles, generated marketing copy, and scheduled calendar entries.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportData}
                  className="gap-2"
                >
                  <Download className="h-4 w-4 text-indigo-600" />
                  <span>Download Complete Data Archive (JSON)</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetWorkspace}
                  className="gap-2 text-amber-600 hover:text-amber-700"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Restore Default Demo Data</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
