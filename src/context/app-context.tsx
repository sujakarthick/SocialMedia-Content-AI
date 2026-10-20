"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Profile,
  Organization,
  BrandProfile,
  ContentGeneration,
  SavedContent,
  ContentCalendarItem,
  UsageRecord,
  PlanTier,
  PLAN_CONFIGS,
} from "@/types/database";
import { getInitialState, saveState } from "@/lib/store";
import { useToast } from "@/components/ui/toast";

interface AppContextType {
  profile: Profile;
  organization: Organization;
  brands: BrandProfile[];
  activeBrand: BrandProfile | undefined;
  activeBrandId: string;
  savedContent: SavedContent[];
  calendarItems: ContentCalendarItem[];
  generations: ContentGeneration[];
  usage: UsageRecord;
  hasCompletedOnboarding: boolean;

  // Actions
  setActiveBrandId: (id: string) => void;
  createBrand: (brandData: Omit<BrandProfile, "id" | "organization_id" | "created_at" | "updated_at">) => { success: boolean; error?: string };
  updateBrand: (id: string, updates: Partial<BrandProfile>) => void;
  deleteBrand: (id: string) => { success: boolean; error?: string };
  
  saveContentItem: (item: Omit<SavedContent, "id" | "organization_id" | "user_id" | "created_at" | "updated_at">) => SavedContent;
  toggleFavorite: (id: string) => void;
  deleteSavedItem: (id: string) => void;

  addCalendarItem: (item: Omit<ContentCalendarItem, "id" | "organization_id" | "user_id" | "created_at" | "updated_at">) => ContentCalendarItem;
  updateCalendarStatus: (id: string, status: ContentCalendarItem["status"]) => void;
  deleteCalendarItem: (id: string) => void;

  recordGeneration: (gen: ContentGeneration) => boolean;
  canGenerate: () => { allowed: boolean; reason?: string };

  upgradePlan: (tier: PlanTier) => void;
  completeOnboarding: (brandData: {
    name: string;
    industry: string;
    description: string;
    targetAudience: string;
    languages: ("tamil" | "tanglish" | "english")[];
    tone: string;
    contactPhone?: string;
    whatsapp?: string;
    instagram?: string;
    marketingGoals?: string;
  }) => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [state, setState] = useState(() => getInitialState());
  const toast = useToast();

  useEffect(() => {
    setMounted(true);
    const initial = getInitialState();
    setState(initial);
  }, []);

  useEffect(() => {
    if (mounted) {
      saveState(state);
    }
  }, [state, mounted]);

  const activeBrand = state.brands.find((b) => b.id === state.activeBrandId) || state.brands[0];

  const setActiveBrandId = (id: string) => {
    setState((prev) => ({ ...prev, activeBrandId: id }));
  };

  const createBrand = (brandData: Omit<BrandProfile, "id" | "organization_id" | "created_at" | "updated_at">) => {
    const planConfig = PLAN_CONFIGS[state.organization.plan_tier];
    if (state.brands.length >= planConfig.maxBrands) {
      return {
        success: false,
        error: `Your current ${planConfig.name} plan allows up to ${planConfig.maxBrands} brand(s). Please upgrade to add more.`,
      };
    }

    const newBrand: BrandProfile = {
      ...brandData,
      id: "brand-" + Math.random().toString(36).substring(2, 9),
      organization_id: state.organization.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setState((prev) => ({
      ...prev,
      brands: [...prev.brands, newBrand],
      activeBrandId: prev.brands.length === 0 ? newBrand.id : prev.activeBrandId,
    }));

    toast.success(`Brand "${newBrand.name}" created successfully!`);
    return { success: true };
  };

  const updateBrand = (id: string, updates: Partial<BrandProfile>) => {
    setState((prev) => ({
      ...prev,
      brands: prev.brands.map((b) =>
        b.id === id ? { ...b, ...updates, updated_at: new Date().toISOString() } : b
      ),
    }));
    toast.success("Brand profile updated");
  };

  const deleteBrand = (id: string) => {
    if (state.brands.length <= 1) {
      return {
        success: false,
        error: "You must have at least one active brand profile.",
      };
    }

    const brandName = state.brands.find((b) => b.id === id)?.name;
    const remaining = state.brands.filter((b) => b.id !== id);

    setState((prev) => ({
      ...prev,
      brands: remaining,
      activeBrandId: prev.activeBrandId === id ? remaining[0].id : prev.activeBrandId,
    }));

    toast.info(`Brand "${brandName || ""}" removed`);
    return { success: true };
  };

  const canGenerate = (): { allowed: boolean; reason?: string } => {
    if (state.usage.credits_used >= state.usage.credits_limit) {
      return {
        allowed: false,
        reason: `Monthly AI generation credit limit (${state.usage.credits_limit}) reached. Please upgrade your subscription plan to continue.`,
      };
    }
    return { allowed: true };
  };

  const recordGeneration = (gen: ContentGeneration): boolean => {
    const quota = canGenerate();
    if (!quota.allowed) {
      toast.error(quota.reason || "Credit limit reached");
      return false;
    }

    setState((prev) => ({
      ...prev,
      generations: [gen, ...prev.generations],
      usage: {
        ...prev.usage,
        credits_used: prev.usage.credits_used + gen.credits_used,
        updated_at: new Date().toISOString(),
      },
    }));

    return true;
  };

  const saveContentItem = (
    item: Omit<SavedContent, "id" | "organization_id" | "user_id" | "created_at" | "updated_at">
  ): SavedContent => {
    const newItem: SavedContent = {
      ...item,
      id: "saved-" + Math.random().toString(36).substring(2, 9),
      organization_id: state.organization.id,
      user_id: state.profile.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setState((prev) => ({
      ...prev,
      savedContent: [newItem, ...prev.savedContent],
    }));

    toast.success("Saved to content library!");
    return newItem;
  };

  const toggleFavorite = (id: string) => {
    setState((prev) => ({
      ...prev,
      savedContent: prev.savedContent.map((item) =>
        item.id === id ? { ...item, is_favorite: !item.is_favorite } : item
      ),
    }));
  };

  const deleteSavedItem = (id: string) => {
    setState((prev) => ({
      ...prev,
      savedContent: prev.savedContent.filter((item) => item.id !== id),
    }));
    toast.info("Item removed from library");
  };

  const addCalendarItem = (
    item: Omit<ContentCalendarItem, "id" | "organization_id" | "user_id" | "created_at" | "updated_at">
  ): ContentCalendarItem => {
    const newCalItem: ContentCalendarItem = {
      ...item,
      id: "cal-" + Math.random().toString(36).substring(2, 9),
      organization_id: state.organization.id,
      user_id: state.profile.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setState((prev) => ({
      ...prev,
      calendarItems: [newCalItem, ...prev.calendarItems],
    }));

    toast.success(`Post scheduled for ${newCalItem.scheduled_date} at ${newCalItem.scheduled_time}`);
    return newCalItem;
  };

  const updateCalendarStatus = (id: string, status: ContentCalendarItem["status"]) => {
    setState((prev) => ({
      ...prev,
      calendarItems: prev.calendarItems.map((item) =>
        item.id === id ? { ...item, status, updated_at: new Date().toISOString() } : item
      ),
    }));
    toast.success(`Status updated to ${status}`);
  };

  const deleteCalendarItem = (id: string) => {
    setState((prev) => ({
      ...prev,
      calendarItems: prev.calendarItems.filter((item) => item.id !== id),
    }));
    toast.info("Calendar item deleted");
  };

  const upgradePlan = (tier: PlanTier) => {
    const planConfig = PLAN_CONFIGS[tier];
    setState((prev) => ({
      ...prev,
      organization: {
        ...prev.organization,
        plan_tier: tier,
        plan_status: "active",
        monthly_credits_limit: planConfig.creditsPerMonth,
        updated_at: new Date().toISOString(),
      },
      usage: {
        ...prev.usage,
        credits_limit: planConfig.creditsPerMonth,
        updated_at: new Date().toISOString(),
      },
    }));
    toast.success(`Subscription updated to ${planConfig.name} Plan!`);
  };

  const completeOnboarding = (brandData: {
    name: string;
    industry: string;
    description: string;
    targetAudience: string;
    languages: ("tamil" | "tanglish" | "english")[];
    tone: string;
    contactPhone?: string;
    whatsapp?: string;
    instagram?: string;
    marketingGoals?: string;
  }) => {
    const newBrand: BrandProfile = {
      id: "brand-" + Math.random().toString(36).substring(2, 9),
      organization_id: state.organization.id,
      name: brandData.name,
      industry: brandData.industry,
      description: brandData.description,
      target_audience: brandData.targetAudience,
      preferred_languages: brandData.languages,
      brand_tone: (brandData.tone as any) || "friendly_trendy",
      contact_phone: brandData.contactPhone,
      whatsapp_number: brandData.whatsapp,
      instagram_handle: brandData.instagram,
      marketing_goals: brandData.marketingGoals,
      is_default: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setState((prev) => ({
      ...prev,
      brands: [newBrand, ...prev.brands.filter((b) => b.id !== "brand-1")],
      activeBrandId: newBrand.id,
    }));

    if (typeof window !== "undefined") {
      localStorage.setItem("nammacontent_onboarding_done", "true");
    }
    toast.success("Welcome aboard! Your brand workspace is ready.");
  };

  const resetAllData = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("nammacontent_data_v1");
      localStorage.removeItem("nammacontent_onboarding_done");
    }
    setState(getInitialState());
    toast.info("Workspace restored to default demo state");
  };

  const hasCompletedOnboarding =
    typeof window !== "undefined"
      ? localStorage.getItem("nammacontent_onboarding_done") === "true" || state.brands.length > 0
      : true;

  return (
    <AppContext.Provider
      value={{
        profile: state.profile,
        organization: state.organization,
        brands: state.brands,
        activeBrand,
        activeBrandId: state.activeBrandId,
        savedContent: state.savedContent,
        calendarItems: state.calendarItems,
        generations: state.generations,
        usage: state.usage,
        hasCompletedOnboarding,
        setActiveBrandId,
        createBrand,
        updateBrand,
        deleteBrand,
        saveContentItem,
        toggleFavorite,
        deleteSavedItem,
        addCalendarItem,
        updateCalendarStatus,
        deleteCalendarItem,
        recordGeneration,
        canGenerate,
        upgradePlan,
        completeOnboarding,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
