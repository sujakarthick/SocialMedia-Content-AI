export type PlanTier = "free" | "starter" | "pro" | "agency";

export type ContentLanguage = "tamil" | "tanglish" | "english" | "bilingual";

export type SocialPlatform =
  | "instagram"
  | "facebook"
  | "whatsapp"
  | "linkedin"
  | "twitter"
  | "youtube_shorts";

export type ContentFormat =
  | "caption"
  | "reel_hook"
  | "video_script"
  | "carousel"
  | "content_ideas"
  | "promotional_campaign"
  | "product_description"
  | "call_to_action"
  | "hashtags"
  | "festival_campaign"
  | "tamil_business_ad"
  | "tanglish_promo";

export type BrandTone =
  | "friendly_trendy"
  | "traditional_respectful"
  | "punchy_local"
  | "premium_luxury"
  | "urgent_promotional"
  | "informative_educational";

export type CalendarStatus = "draft" | "scheduled" | "published" | "failed";

export interface Profile {
  id: string;
  full_name: string;
  avatar_url?: string;
  phone?: string;
  preferred_language: ContentLanguage;
  role: "user" | "admin" | "superadmin";
  created_at: string;
  updated_at: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  billing_email?: string;
  plan_tier: PlanTier;
  plan_status: "active" | "trialing" | "past_due" | "canceled";
  monthly_credits_limit: number;
  razorpay_customer_id?: string;
  razorpay_subscription_id?: string;
  current_period_end?: string;
  created_at: string;
  updated_at: string;
}

export interface BrandProfile {
  id: string;
  organization_id: string;
  name: string;
  logo_url?: string;
  industry: string;
  description?: string;
  products_services?: string;
  target_audience?: string;
  preferred_languages: ContentLanguage[];
  brand_tone: BrandTone;
  contact_phone?: string;
  whatsapp_number?: string;
  location_address?: string;
  instagram_handle?: string;
  website_url?: string;
  marketing_goals?: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface GeneratedContentOutput {
  headline: string;
  body: string;
  cta: string;
  hashtags: string[];
  visual_cue?: string;
  slides?: Array<{ slide_number: number; headline: string; description: string; visual_note: string }>;
  script_scenes?: Array<{ scene_number: number; visual: string; dialogue_or_voiceover: string }>;
}

export interface ContentGeneration {
  id: string;
  organization_id: string;
  user_id: string;
  brand_id?: string;
  platform: SocialPlatform;
  content_type: ContentFormat;
  language: ContentLanguage;
  prompt_inputs: {
    topic: string;
    offer?: string;
    target_audience?: string;
    tone?: string;
    length?: "short" | "medium" | "long";
    festival?: string;
  };
  output_content: GeneratedContentOutput;
  model_used: string;
  credits_used: number;
  is_mock: boolean;
  created_at: string;
}

export interface SavedContent {
  id: string;
  organization_id: string;
  user_id: string;
  brand_id?: string;
  generation_id?: string;
  title: string;
  content: string;
  format: ContentFormat;
  platform: SocialPlatform;
  language: ContentLanguage;
  tags: string[];
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContentCalendarItem {
  id: string;
  organization_id: string;
  user_id: string;
  brand_id?: string;
  saved_content_id?: string;
  title: string;
  body: string;
  scheduled_date: string; // YYYY-MM-DD
  scheduled_time: string; // HH:MM
  platform: SocialPlatform;
  status: CalendarStatus;
  reminder_sent?: boolean;
  failure_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface UsageRecord {
  id: string;
  organization_id: string;
  period_month: string; // YYYY-MM
  credits_used: number;
  credits_limit: number;
  created_at: string;
  updated_at: string;
}

export interface PlanConfig {
  id: PlanTier;
  name: string;
  priceMonthlyINR: number;
  priceAnnualINR: number;
  creditsPerMonth: number;
  maxBrands: number;
  features: string[];
  popular?: boolean;
}

export const PLAN_CONFIGS: Record<PlanTier, PlanConfig> = {
  free: {
    id: "free",
    name: "Free",
    priceMonthlyINR: 0,
    priceAnnualINR: 0,
    creditsPerMonth: 10,
    maxBrands: 1,
    features: [
      "10 AI Generations / month",
      "1 Brand Profile",
      "Tamil, Tanglish & English support",
      "Standard Instagram Captions & Hashtags",
      "Basic Content Editor",
    ],
  },
  starter: {
    id: "starter",
    name: "Starter",
    priceMonthlyINR: 399,
    priceAnnualINR: 3990,
    creditsPerMonth: 100,
    maxBrands: 1,
    popular: true,
    features: [
      "100 AI Generations / month",
      "1 Brand Profile",
      "All 12 Social Media Formats",
      "Reel Hooks & Video Scripts",
      "Saved Content Library",
      "Interactive Content Calendar",
      "WhatsApp & Direct Share Ready",
    ],
  },
  pro: {
    id: "pro",
    name: "Pro",
    priceMonthlyINR: 999,
    priceAnnualINR: 9990,
    creditsPerMonth: 500,
    maxBrands: 3,
    features: [
      "500 AI Generations / month",
      "Up to 3 Brand Profiles",
      "Festival & Seasonal Campaign Generator",
      "Carousel Outlines & Slides",
      "Advanced Calendar & Reminders",
      "Full Usage Analytics & Insights",
      "Priority AI Generation Speed",
    ],
  },
  agency: {
    id: "agency",
    name: "Agency",
    priceMonthlyINR: 2999,
    priceAnnualINR: 29990,
    creditsPerMonth: 2500,
    maxBrands: 10,
    features: [
      "2,500 AI Generations / month",
      "Up to 10 Client Brand Profiles",
      "Team Member Workflows",
      "Centralised Client Dashboard",
      "Custom Brand Voice Calibration",
      "Dedicated Account Support",
      "CSV & Bulk Content Export",
    ],
  },
};
