"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, ArrowLeft, CheckCircle2, Building, Target, Globe, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useApp } from "@/context/app-context";
import { useToast } from "@/components/ui/toast";

export default function OnboardingPage() {
  const router = useRouter();
  const toast = useToast();
  const { completeOnboarding } = useApp();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    industry: "restaurant",
    description: "",
    targetAudience: "Local families and foodies in Chennai",
    languages: ["tanglish", "tamil", "english"] as ("tamil" | "tanglish" | "english")[],
    tone: "friendly_trendy",
    contactPhone: "+91 98401 23456",
    whatsapp: "+91 98401 23456",
    instagram: "@mybrand",
    marketingGoals: "Increase weekend footfall and Instagram engagement",
  });

  const industries = [
    { id: "restaurant", label: "Restaurant & Mess", icon: "🍛" },
    { id: "clothing", label: "Silk & Clothing Boutique", icon: "🥻" },
    { id: "salon", label: "Salon, Spa & Beauty", icon: "💇‍♀️" },
    { id: "bakery", label: "Bakery & Sweets", icon: "🎂" },
    { id: "tuition", label: "Tuition & Coaching Academy", icon: "📚" },
    { id: "real_estate", label: "Real Estate & Builders", icon: "🏢" },
    { id: "retail", label: "Jewellery & Retail Store", icon: "💎" },
    { id: "agency", label: "Digital Marketing Agency", icon: "🚀" },
  ];

  const tones = [
    { id: "friendly_trendy", name: "Friendly & Trendy (Vera Level)", desc: "Warm, conversational, high energy with local Tamil & Tanglish phrases" },
    { id: "traditional_respectful", name: "Traditional & Respectful (மரியாதையான)", desc: "Formal, respectful, culturally deep Tamil and polite phrasing" },
    { id: "premium_luxury", name: "Premium & Luxury", desc: "Sophisticated, elegant, emphasizing quality and exclusivity" },
    { id: "urgent_promotional", name: "Urgent & Promotional (அதிரடி தள்ளுபடி)", desc: "High conversion, discount driven, bold calls to action" },
  ];

  const handleToggleLang = (lang: "tamil" | "tanglish" | "english") => {
    if (formData.languages.includes(lang)) {
      if (formData.languages.length > 1) {
        setFormData({ ...formData, languages: formData.languages.filter((l) => l !== lang) });
      } else {
        toast.info("Please keep at least one preferred language.");
      }
    } else {
      setFormData({ ...formData, languages: [...formData.languages, lang] });
    }
  };

  const handleNext = () => {
    if (step === 1 && !formData.name.trim()) {
      toast.error("Please enter your business or brand name.");
      return;
    }
    if (step < 4) {
      setStep(step + 1);
    } else {
      // Complete
      completeOnboarding(formData);
      router.push("/dashboard/studio");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Brand Onboarding Wizard</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Set Up Your First Brand Profile
          </h1>
          <p className="text-sm text-slate-500">
            NammaContent AI uses this context to generate culturally authentic, high-converting copy.
          </p>

          {/* Stepper Indicator */}
          <div className="flex items-center justify-center gap-2 pt-4">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all duration-300 ${
                  s === step
                    ? "w-10 bg-indigo-600"
                    : s < step
                    ? "w-6 bg-indigo-300 dark:bg-indigo-800"
                    : "w-6 bg-slate-200 dark:bg-slate-800"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Card Body */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 shadow-xl">
          {/* Step 1: Business Name & Industry */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <Building className="h-5 w-5 text-indigo-600" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Step 1: Business Name & Category
                </h3>
              </div>

              <Input
                label="Brand or Business Name"
                required
                placeholder="e.g. Senthil Chettinad Mess / Priya Silk House"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                helperText="This will be featured in your headlines, promotional tags, and signatures."
              />

              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Select Industry Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {industries.map((ind) => (
                    <button
                      key={ind.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, industry: ind.id })}
                      className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                        formData.industry === ind.id
                          ? "border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/60 ring-2 ring-indigo-500/20"
                          : "border-slate-200 dark:border-slate-800 hover:border-slate-300"
                      }`}
                    >
                      <span className="text-2xl mb-2">{ind.icon}</span>
                      <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                        {ind.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <Textarea
                label="Short Business Summary"
                rows={2}
                placeholder="e.g. Famous for authentic Thalappakatti-style seeraga samba mutton biryani in Madurai."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          )}

          {/* Step 2: Target Audience & Goals */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <Target className="h-5 w-5 text-indigo-600" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Step 2: Target Audience & Goals
                </h3>
              </div>

              <Input
                label="Who are your primary customers?"
                placeholder="e.g. Working professionals, local families, college students in Chennai"
                value={formData.targetAudience}
                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
              />

              <Input
                label="Main Marketing Objective"
                placeholder="e.g. Get more WhatsApp inquiries, drive Sunday footfall, sell online"
                value={formData.marketingGoals}
                onChange={(e) => setFormData({ ...formData, marketingGoals: e.target.value })}
              />
            </div>
          )}

          {/* Step 3: Preferred Languages & Tone */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <Globe className="h-5 w-5 text-indigo-600" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Step 3: Preferred Languages & Brand Tone
                </h3>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Preferred Social Media Languages
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "tanglish", label: "Tanglish", desc: "Tamil in English script" },
                    { id: "tamil", label: "தமிழ் (Tamil)", desc: "Pure/Conversational Tamil" },
                    { id: "english", label: "English", desc: "Polished Indian English" },
                  ].map((l) => {
                    const isSelected = formData.languages.includes(l.id as any);
                    return (
                      <button
                        key={l.id}
                        type="button"
                        onClick={() => handleToggleLang(l.id as any)}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                          isSelected
                            ? "border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/60 ring-2 ring-indigo-500/20"
                            : "border-slate-200 dark:border-slate-800"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                            {l.label}
                          </span>
                          {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-indigo-600" />}
                        </div>
                        <span className="text-[10px] text-slate-500 block mt-1">{l.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Brand Voice & Tone
                </label>
                <div className="space-y-2.5">
                  {tones.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, tone: t.id })}
                      className={`w-full p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                        formData.tone === t.id
                          ? "border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/60 ring-2 ring-indigo-500/20"
                          : "border-slate-200 dark:border-slate-800 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {t.name}
                        </span>
                        {formData.tone === t.id && (
                          <CheckCircle2 className="h-4 w-4 text-indigo-600 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Contact & Social Handles */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <Phone className="h-5 w-5 text-indigo-600" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Step 4: Contact & Social Links
                </h3>
              </div>

              <Input
                label="WhatsApp Order Number"
                placeholder="+91 98401 23456"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                helperText="Will be inserted into WhatsApp CTAs and post footers automatically."
              />

              <Input
                label="Instagram Handle"
                placeholder="@myrestaurant_tn"
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
              />

              <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-900 dark:text-indigo-200 flex items-start gap-2.5">
                <Sparkles className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                <span>
                  All set! NammaContent will use <strong>{formData.name || "your brand"}</strong> as your active workspace so every post is tailored with your exact tone, language, and contact details.
                </span>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="mt-8 pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            {step > 1 ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setStep(step - 1)}
                className="gap-1.5"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>
            ) : (
              <div />
            )}

            <Button size="sm" onClick={handleNext} className="gap-1.5">
              {step === 4 ? "Launch AI Studio" : "Next Step"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
