"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Layers,
  Globe2,
  Share2,
  Zap,
  TrendingUp,
  MessageCircle,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";
import { PLAN_CONFIGS, PlanTier } from "@/types/database";
import { formatCurrencyINR } from "@/lib/utils";

export default function HomePage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [demoLang, setDemoLang] = useState<"tanglish" | "tamil" | "english">("tanglish");
  const [demoIndustry, setDemoIndustry] = useState<"restaurant" | "clothing" | "salon">("restaurant");
  const [copied, setCopied] = useState(false);

  const demoSamples = {
    restaurant: {
      tanglish: {
        title: "Sunday Special Seeraga Samba Biryani 🍗🔥",
        body: "Sunday-na Biryani illaama epdi boss?! Vera level manam, authentic seeraga samba arisi, tender mutton chunks marinated in Karaikudi spices! Inaikku Velan Chettinad-la Sunday Special Biryani ready aayiruchu. ✨ Pre-order 2 Mutton Biryani and get Crispy Chicken 65 absolutely FREE! ✨ Call us or tap link in bio to order now! 🛵",
        hashtags: "#ChennaiBiryani #NammaChennai #ChettinadFood #TNagarEats #SundaySpecial",
      },
      tamil: {
        title: "பாரம்பரிய சுவையில் நாவில் கரையும் பிரியாணி! 🌾✨",
        body: "உண்மையான சீரக சம்பா அரிசி மற்றும் நாட்டுப்புற மசாலா மணத்துடன் கூடிய ஆட்டுக்கறி பிரியாணி! உங்கள் ஞாயிற்றுக்கிழமை குடும்ப விருந்தை சுவை நிறைந்ததாக மாற்ற வேலன் செட்டிநாடு மெஸ் உங்களை அன்புடன் அழைக்கிறது. 2 பிரியாணி வாங்கினால் சுவையான சிக்கன் 65 இலவசம்! இன்றே முன்பதிவு செய்யுங்கள்.",
        hashtags: "#செட்டிநாடுஉணவு #சென்னைபிரியாணி #பாரம்பரியசுவை #ஞாயிறுவிருந்து #உணவுபிரியர்கள்",
      },
      english: {
        title: "Weekend Cravings? Savor Authentic Chettinad Biryani! 🍲",
        body: "Crafted with aromatic Seeraga Samba rice, slow-cooked tender meat, and heirloom spices from Karaikudi. Treat your family to an unforgettable Sunday feast at Velan Chettinad. Order 2 Mutton Biryanis today and enjoy a complimentary portion of Crispy Chicken 65! Tap link in bio to order.",
        hashtags: "#ChettinadFeast #ChennaiFoodies #SundayVibes #BiryaniLovers #SpecialOffer",
      },
    },
    clothing: {
      tanglish: {
        title: "New Muhurtham Silk Collection Just Dropped! 🌸✨",
        body: "Brides-to-be, look over here! Aara Silks-la inaikku fresh pastel bridal sarees arrival aayiruchu. 100% pure Kanchipuram zari work with modern aesthetic drapes. Wedding shopping plan pandreengala? Indha weekend showroom-ku vaanga, personalized drape trial book pannunga!",
        hashtags: "#KanchiSilk #BridalSaree #CoimbatoreFashion #TanglishVibes #WeddingShopping",
      },
      tamil: {
        title: "மணப்பெண்களின் கனவுகளை நனவாக்கும் பட்டுச் சேலைகள்! 🥻🪔",
        body: "தூய காஞ்சிபுரம் பட்டு நூலிழைகளில் நெய்யப்பட்ட பொன் ஜரிகை புடவைகள். ஆரா சில்க்ஸ் வழங்கும் பிரத்யேக திருமண சீசன் புது வரவுகள் இப்போது கோயம்புத்தூர் ஷோரூமில் விற்பனைக்கு தயாராக உள்ளன. உங்கள் சிறப்பு நாளை மறக்க முடியாததாக மாற்ற இன்றே வருகை தாருங்கள்!",
        hashtags: "#காஞ்சிபுரம்பட்டு #மணப்பெண் #கோயம்புத்தூர்பேஷன் #பாரம்பரியபுடவை #திருமணசீசன்",
      },
      english: {
        title: "Elegance Handwoven in Every Thread — Pure Kanchipuram 👑",
        body: "Step into timeless grace with Aara Designer Silks. Discover our newly unveiled Bridal Pastel Collection, intricately handwoven with certified silk mark authenticity. Book a 1-on-1 private bridal styling appointment today.",
        hashtags: "#KanchipuramSarees #BridalElegance #SouthIndianBride #HandcraftedLuxury #IndianTextiles",
      },
    },
    salon: {
      tanglish: {
        title: "Ready for that Festival Glow-Up? ✨💇‍♀️",
        body: "Skin dull-ah irukka? Don't worry! Namma Glow Salon-la special Hydra-Facial & Hair Spa combo flat 30% OFF this week! Instant glow, zero downtime. Office mudichutu oru relaxing pamper session eduthukonga. Limited appointment slots only, book pannunga!",
        hashtags: "#GlowUpChennai #HydraFacial #SalonOffers #TanglishBeauty #ChennaiSalons",
      },
      tamil: {
        title: "பளபளக்கும் சரும அழகுடன் பண்டிகையை கொண்டாடுங்கள்! 🌸🧖‍♀️",
        body: "உங்கள் முகப்பொலிவை மீட்டெடுக்க எங்கள் நிபுணர்கள் வழங்கும் இயற்கை மூலிகை ஃபேஷியல் மற்றும் ஹேர் ஸ்பா சிகிச்சை. இந்த வாரம் பிரத்யேகமாக 30% தள்ளுபடி சலுகை! முன்பதிவு செய்து உங்கள் புத்துணர்ச்சி தருணங்களை அனுபவியுங்கள்.",
        hashtags: "#அழகுநிலையம் #இயற்கைபராமரிப்பு #முகப்பொலிவு #சிறப்புதள்ளுபடி #தமிழ்நாடுஅழகு",
      },
      english: {
        title: "Recharge Your Radiance with Signature Hydra Glow 💆‍♀️",
        body: "Tired of pollution-stressed skin? Experience our rejuvenating Hydra-Facial and Keratin Hair Care therapy at 30% savings this week. Step into our relaxing lounge and step out looking runway-ready. Reserve your slot now.",
        hashtags: "#SelfCareRoutine #HydraFacialIndia #SalonWellness #BridalGlow #LuxurySpa",
      },
    },
  };

  const currentSample = demoSamples[demoIndustry][demoLang];

  const handleCopy = () => {
    navigator.clipboard.writeText(`${currentSample.title}\n\n${currentSample.body}\n\n${currentSample.hashtags}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/70 via-white to-transparent dark:from-indigo-950/20 dark:via-slate-950 dark:to-transparent pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Announcement pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-6 shadow-xs animate-fade-in">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Namma Tamil, Tanglish & English Social Media Copilot</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight max-w-4xl mx-auto">
            Supercharge Your Social Media Marketing in{" "}
            <span className="text-indigo-600 dark:text-indigo-400 underline decoration-indigo-300 dark:decoration-indigo-700 decoration-wavy decoration-2">
              தமிழ், Tanglish & English
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            The first commercial AI marketing platform purpose-built for Indian retail shops, restaurants, boutiques, salons, coaching institutes, and marketing agencies.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard/studio">
              <Button size="lg" className="w-full sm:w-auto shadow-lg shadow-indigo-500/25 gap-2 text-base">
                Try AI Studio Free
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/#demo">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-base">
                Explore Live Demo
              </Button>
            </Link>
          </div>

          <div className="mt-6 flex items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>10 Free AI Generations</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>No Credit Card Required</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>Culturally Authentic Phrasing</span>
            </div>
          </div>
        </div>

        {/* Live Interactive Playground / Demo */}
        <div id="demo" className="max-w-4xl mx-auto px-4 mt-16 sm:px-6">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-indigo-600" />
                  Interactive Generation Preview
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  See how NammaContent crafts genuine local marketing copy
                </p>
              </div>

              {/* Language Selector */}
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button
                  onClick={() => setDemoLang("tanglish")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    demoLang === "tanglish"
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
                  }`}
                >
                  Tanglish
                </button>
                <button
                  onClick={() => setDemoLang("tamil")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    demoLang === "tamil"
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
                  }`}
                >
                  தமிழ் (Tamil)
                </button>
                <button
                  onClick={() => setDemoLang("english")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    demoLang === "english"
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
                  }`}
                >
                  English
                </button>
              </div>
            </div>

            {/* Industry Selector Tabs */}
            <div className="flex gap-2 pt-4 pb-4">
              <button
                onClick={() => setDemoIndustry("restaurant")}
                className={`px-3 py-1 text-xs rounded-full border transition-all cursor-pointer ${
                  demoIndustry === "restaurant"
                    ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold"
                    : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                }`}
              >
                🍛 Chettinad Restaurant
              </button>
              <button
                onClick={() => setDemoIndustry("clothing")}
                className={`px-3 py-1 text-xs rounded-full border transition-all cursor-pointer ${
                  demoIndustry === "clothing"
                    ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold"
                    : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                }`}
              >
                🥻 Silk Boutique
              </button>
              <button
                onClick={() => setDemoIndustry("salon")}
                className={`px-3 py-1 text-xs rounded-full border transition-all cursor-pointer ${
                  demoIndustry === "salon"
                    ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold"
                    : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                }`}
              >
                💇‍♀️ Glow Unisex Salon
              </button>
            </div>

            {/* Output preview card */}
            <div className="rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 p-5 relative">
              <button
                onClick={handleCopy}
                className="absolute top-4 right-4 p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 text-xs flex items-center gap-1 cursor-pointer shadow-xs"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>

              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 pr-16">
                {currentSample.title}
              </h4>
              <p className="mt-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {currentSample.body}
              </p>
              <p className="mt-4 text-xs font-mono text-indigo-600 dark:text-indigo-400 break-words">
                {currentSample.hashtags}
              </p>
            </div>

            <div className="mt-5 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <Globe2 className="h-4 w-4 text-indigo-500" />
                Language Engine: Native Tamil, Tanglish & Indian English
              </span>
              <Link href="/dashboard/studio" className="font-semibold text-indigo-600 hover:underline">
                Open full AI Studio →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Solution Statement */}
      <section className="py-16 bg-white dark:bg-slate-900 border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Why Generic AI Fails Indian Small Businesses
            </h2>
            <p className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Standard AI sounds like a robotic textbook. We speak your customer’s dialect.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
              <div className="h-10 w-10 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center font-bold mb-4">
                ✕
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Robotic Literal Translation
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Tools like ChatGPT often produce unnatural, stiff translations of English idioms that sound bizarre to Tamil-speaking shoppers and Instagram followers.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
              <div className="h-10 w-10 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center font-bold mb-4">
                ✕
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Ignores Indian Retail Calendars
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Global tools don’t understand Aadi clearance sales, Pongal thirunaal feasts, Deepavali sweet boxes, or Sunday afternoon biryani pre-orders.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800">
              <div className="h-10 w-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold mb-4">
                ✓
              </div>
              <h3 className="text-base font-bold text-indigo-950 dark:text-indigo-200">
                The NammaContent Advantage
              </h3>
              <p className="mt-2 text-sm text-indigo-900/80 dark:text-indigo-300 leading-relaxed">
                Context-aware AI tuned for South Indian colloquial humor, festival campaigns, WhatsApp broadcasts, and high-converting Instagram reels hooks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 12 Content Formats Showcase */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="indigo">All-In-One AI Content Suite</Badge>
          <h2 className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white">
            12 Specialized Marketing Formats for Maximum Engagement
          </h2>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-300">
            From viral Instagram reel hooks to festival WhatsApp promotions, generate ready-to-post content in clicks.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Instagram Captions", desc: "Attention-grabbing captions with hashtags and call to action." },
            { title: "Reel Hooks", desc: "First 3-second visual and audio hooks that stop the scroll." },
            { title: "Short-Form Video Scripts", desc: "Scene-by-scene camera notes and spoken dialogue in Tamil/Tanglish." },
            { title: "Carousel Outlines", desc: "Slide-by-slide value decks for educational & product showcases." },
            { title: "Festival Marketing", desc: "Special campaigns for Pongal, Deepavali, Tamil New Year & Aadi sales." },
            { title: "Tamil Business Ads", desc: "Culturally resonant, persuasive traditional advertisement copy." },
            { title: "Tanglish Conversational", desc: "Casual, modern Chennai/Tamil slang that clicks with youth." },
            { title: "Product Descriptions", desc: "Highlight ingredients, craftsmanship, and benefits clearly." },
            { title: "Hashtag Stacks", desc: "Localized viral and high-intent niche hashtags for discoverability." },
            { title: "Offers & CTAs", desc: "Compelling limited-time urgency triggers and WhatsApp order links." },
            { title: "Content Calendar Ideas", desc: "Monthly theme pillars to keep your social channels active." },
            { title: "WhatsApp Broadcasts", desc: "Direct-to-customer friendly updates and announcement templates." },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs hover:border-indigo-400 dark:hover:border-indigo-600 transition-colors"
            >
              <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs mb-3">
                {idx + 1}
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {item.title}
              </h4>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-slate-100/60 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Seamless Workflow
            </h2>
            <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
              From Idea to Published Post in 3 Steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-4xl font-extrabold text-indigo-200 dark:text-indigo-900">01</span>
              <h3 className="mt-3 text-lg font-bold text-slate-900 dark:text-slate-100">
                Select Brand & Topic
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Choose your business profile. Enter your product, dish, or special discount offer.
              </p>
            </div>

            <div className="relative p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-4xl font-extrabold text-indigo-200 dark:text-indigo-900">02</span>
              <h3 className="mt-3 text-lg font-bold text-slate-900 dark:text-slate-100">
                Choose Format & Language
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Pick between Tamil, Tanglish, or English, select tone and post format, and hit Generate.
              </p>
            </div>

            <div className="relative p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-4xl font-extrabold text-indigo-200 dark:text-indigo-900">03</span>
              <h3 className="mt-3 text-lg font-bold text-slate-900 dark:text-slate-100">
                Schedule & Share
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Edit right in the browser, copy to clipboard, save to your library, or plan on your marketing calendar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge variant="indigo">Affordable Pricing</Badge>
          <h2 className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white">
            Transparent Plans for Every Business Size
          </h2>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-300">
            Start free, then upgrade as your social media presence expands. Billed in Indian Rupees (INR).
          </p>

          {/* Monthly / Annual Toggle */}
          <div className="mt-6 inline-flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                billingCycle === "monthly"
                  ? "bg-white dark:bg-slate-900 text-indigo-600 shadow-xs"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
                billingCycle === "annual"
                  ? "bg-white dark:bg-slate-900 text-indigo-600 shadow-xs"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              <span>Annual Billing</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-bold">
                Save 17%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(["free", "starter", "pro", "agency"] as PlanTier[]).map((tierKey) => {
            const plan = PLAN_CONFIGS[tierKey];
            const price =
              billingCycle === "annual" ? Math.round(plan.priceAnnualINR / 12) : plan.priceMonthlyINR;

            return (
              <div
                key={tierKey}
                className={`relative flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-slate-900 border transition-all duration-200 ${
                  plan.popular
                    ? "border-indigo-600 shadow-xl ring-2 ring-indigo-600/20"
                    : "border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-indigo-600 text-white text-[11px] font-bold uppercase tracking-wider shadow-sm">
                    Most Popular
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {plan.name}
                  </h3>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                      {formatCurrencyINR(price)}
                    </span>
                    <span className="text-xs text-slate-500 ml-1.5">/month</span>
                  </div>
                  {billingCycle === "annual" && plan.priceAnnualINR > 0 && (
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
                      Billed {formatCurrencyINR(plan.priceAnnualINR)} annually
                    </p>
                  )}

                  <ul className="mt-6 space-y-3 border-t border-slate-100 dark:border-slate-800 pt-6">
                    {plan.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-4">
                  <Link href="/dashboard/billing">
                    <Button
                      variant={plan.popular ? "primary" : "outline"}
                      className="w-full justify-center"
                    >
                      {tierKey === "free" ? "Get Started" : `Subscribe to ${plan.name}`}
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section id="faq" className="py-20 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Answers to Common Questions
            </h2>
            <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
              Frequently Asked Questions
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "What is Tanglish, and why is it important for social media?",
                a: "Tanglish is Tamil words written using the English alphabet (e.g., 'Vera level offer inaikku Velan Mess-la!'). Over 70% of Tamil Nadu Instagram and WhatsApp users naturally consume content in Tanglish because it feels personal, energetic, and immediate.",
              },
              {
                q: "Can I manage multiple client accounts with one login?",
                a: "Yes! Our Pro plan supports up to 3 separate brand workspaces, and the Agency plan supports up to 10+ client brands with independent tones, products, and contact numbers.",
              },
              {
                q: "Does NammaContent automatically publish posts to Instagram?",
                a: "NammaContent prepares and schedules all your posts on the marketing calendar. Because Instagram and Facebook require official Meta Graph API business account authorization, we provide one-click copy, formatted drafts, and scheduled reminder alerts so you maintain full control over what goes live.",
              },
              {
                q: "How does billing work? What payment methods are supported?",
                a: "We process payments securely via Razorpay. We support UPI (Google Pay, PhonePe, Paytm), Indian debit and credit cards, and net banking.",
              },
              {
                q: "Is my business data and customer information secure?",
                a: "Absolutely. We enforce Row Level Security (RLS) on Supabase PostgreSQL, validate all inputs server-side, and comply with India's Digital Personal Data Protection (DPDP) Act 2023.",
              },
            ].map((faq, idx) => (
              <details
                key={idx}
                className="group p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60"
              >
                <summary className="font-semibold text-sm sm:text-base text-slate-900 dark:text-slate-100 cursor-pointer list-none flex items-center justify-between">
                  <span>{faq.q}</span>
                  <span className="text-indigo-600 font-bold text-lg group-open:rotate-45 transition-transform">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed pt-2 border-t border-slate-200/50 dark:border-slate-800/50">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="py-16 bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to give your brand an authentic Tamil voice?
          </h2>
          <p className="mt-4 text-base sm:text-lg text-indigo-100 max-w-2xl mx-auto">
            Join hundreds of local restaurants, fashion shops, and creators elevating their social media presence today.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link href="/dashboard/studio">
              <Button size="lg" className="bg-white text-indigo-700 hover:bg-indigo-50 shadow-lg text-base">
                Get Started Free Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
