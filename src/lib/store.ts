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

const STATIC_NOW = "2026-10-20T10:00:00.000Z";

const DEFAULT_PROFILE: Profile = {
  id: "user-default-101",
  full_name: "Karthik Subramanian",
  avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
  phone: "+91 98401 23456",
  preferred_language: "tanglish",
  role: "admin",
  created_at: STATIC_NOW,
  updated_at: STATIC_NOW,
};

const DEFAULT_ORG: Organization = {
  id: "org-default-201",
  name: "Velan & Co Media",
  slug: "velan-media",
  billing_email: "karthik@velanmedia.in",
  plan_tier: "pro",
  plan_status: "active",
  monthly_credits_limit: 500,
  created_at: STATIC_NOW,
  updated_at: STATIC_NOW,
};

const DEFAULT_BRANDS: BrandProfile[] = [
  {
    id: "brand-1",
    organization_id: "org-default-201",
    name: "Velan Chettinad Mess & Biryani",
    industry: "restaurant",
    description: "Authentic spicy Chettinad cuisine, seeraga samba mutton biryani, and traditional filter coffee made with farm-fresh cow milk.",
    products_services: "Seeraga Samba Mutton Biryani, Nattu Kozhi Varuval, Chettinad Crab Roast, Vazhaipoo Vadai, Filter Coffee",
    target_audience: "Foodies, families, weekend lunch crowd, office delivery customers in Chennai",
    preferred_languages: ["tanglish", "tamil", "english"],
    brand_tone: "friendly_trendy",
    contact_phone: "+91 98401 23456",
    whatsapp_number: "+91 98401 23456",
    location_address: "No. 42, Venkatanarayana Road, T. Nagar, Chennai 600017",
    instagram_handle: "@velanchettinadmess",
    marketing_goals: "Drive weekend footfall, promote Sunday Biryani pre-orders, and increase Swiggy/Zomato delivery orders",
    is_default: true,
    created_at: STATIC_NOW,
    updated_at: STATIC_NOW,
  },
  {
    id: "brand-2",
    organization_id: "org-default-201",
    name: "Aara Designer Silks & Sarees",
    industry: "clothing",
    description: "Handwoven pure Kanchipuram silk sarees, contemporary pastel bridal drapes, and bespoke blouse stitching.",
    products_services: "Bridal Kanchipuram Sarees, Soft Silk Sarees, Ready-to-wear Drapes, Handcrafted Blouses",
    target_audience: "Brides-to-be, festival shoppers, South Indian diaspora, mothers & daughters",
    preferred_languages: ["tamil", "tanglish", "english"],
    brand_tone: "premium_luxury",
    contact_phone: "+91 94432 98765",
    whatsapp_number: "+91 94432 98765",
    location_address: "12, Crosscut Road, Gandhipuram, Coimbatore 641012",
    instagram_handle: "@aaradesignersilks",
    marketing_goals: "Promote wedding season collection, announce festival discounts, and book in-store bridal appointments",
    is_default: false,
    created_at: STATIC_NOW,
    updated_at: STATIC_NOW,
  },
];

const DEFAULT_SAVED_ITEMS: SavedContent[] = [
  {
    id: "saved-1",
    organization_id: "org-default-201",
    user_id: "user-default-101",
    brand_id: "brand-1",
    title: "Sunday Biryani Feast Special",
    content: "Sunday-na Biryani illaama epdi boss?! 🍗🔥 Vera level manam, authentic seeraga samba arisi, tender mutton chunks marinated in traditional Karaikudi spices! Inaikku Velan Chettinad-la Sunday Special Biryani ready aayiruchu. ✨ Pre-order 2 Mutton Biryani and get Crispy Chicken 65 absolutely FREE! ✨ Call us at +91 98401 23456 or tap link in bio! #ChennaiBiryani #NammaChennai #ChettinadFood",
    format: "caption",
    platform: "instagram",
    language: "tanglish",
    tags: ["SundaySpecial", "Biryani", "Offer"],
    is_favorite: true,
    created_at: "2026-10-18T10:00:00.000Z",
    updated_at: STATIC_NOW,
  },
  {
    id: "saved-2",
    organization_id: "org-default-201",
    user_id: "user-default-101",
    brand_id: "brand-2",
    title: "Bridal Kanchipuram Silk Launch",
    content: "மணப்பெண்களின் கனவுகளை நனவாக்கும் புது வரவு! 🌸✨ ஆரா சில்க்ஸின் பிரத்யேக காஞ்சிபுரம் பட்டுப் புடவைகள் இப்போது கோயம்புத்தூர் ஷோரூமில். தங்க ஜரிகை வேலைப்பாடுகள் மற்றும் மெல்லிய பேஸ்டல் வண்ணங்களில் உங்கள் திருமண நாளை என்றும் மறக்க முடியாததாக மாற்றுங்கள்! வாட்ஸ்அப்பில் புக் செய்ய: +91 94432 98765 #KanchipuramSilk #BridalSaree #CoimbatoreFashion",
    format: "tamil_business_ad",
    platform: "instagram",
    language: "tamil",
    tags: ["BridalSaree", "TamilAd", "Wedding"],
    is_favorite: true,
    created_at: "2026-10-16T10:00:00.000Z",
    updated_at: STATIC_NOW,
  },
];

const DEFAULT_CALENDAR_ITEMS: ContentCalendarItem[] = [
  {
    id: "cal-1",
    organization_id: "org-default-201",
    user_id: "user-default-101",
    brand_id: "brand-1",
    title: "Weekend Biryani Rush Post",
    body: "Sunday-na Biryani illaama epdi boss?! Pre-order 2 Mutton Biryani get Chicken 65 Free! Order now via link in bio.",
    scheduled_date: "2026-10-22",
    scheduled_time: "11:30",
    platform: "instagram",
    status: "scheduled",
    created_at: STATIC_NOW,
    updated_at: STATIC_NOW,
  },
  {
    id: "cal-2",
    organization_id: "org-default-201",
    user_id: "user-default-101",
    brand_id: "brand-2",
    title: "Muhurtham Saree Reel Showcase",
    body: "3 Must-have bridal saree colors for this wedding season! Check reel audio for Tanglish commentary.",
    scheduled_date: "2026-10-24",
    scheduled_time: "18:00",
    platform: "instagram",
    status: "draft",
    created_at: STATIC_NOW,
    updated_at: STATIC_NOW,
  },
];

const DEFAULT_USAGE: UsageRecord = {
  id: "usage-1",
  organization_id: "org-default-201",
  period_month: "2026-10",
  credits_used: 42,
  credits_limit: 500,
  created_at: STATIC_NOW,
  updated_at: STATIC_NOW,
};

// Local storage key prefix
const STORAGE_KEY = "nammacontent_data_v1";

interface StoreState {
  profile: Profile;
  organization: Organization;
  brands: BrandProfile[];
  activeBrandId: string;
  savedContent: SavedContent[];
  calendarItems: ContentCalendarItem[];
  generations: ContentGeneration[];
  usage: UsageRecord;
}

export function getInitialState(): StoreState {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
  }

  return {
    profile: DEFAULT_PROFILE,
    organization: DEFAULT_ORG,
    brands: DEFAULT_BRANDS,
    activeBrandId: DEFAULT_BRANDS[0].id,
    savedContent: DEFAULT_SAVED_ITEMS,
    calendarItems: DEFAULT_CALENDAR_ITEMS,
    generations: [],
    usage: DEFAULT_USAGE,
  };
}

export function saveState(state: StoreState): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error("Failed to save state to localStorage", e);
    }
  }
}
