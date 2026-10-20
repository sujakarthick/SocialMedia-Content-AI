# NammaContent AI — Production SaaS Platform

> **AI-Powered Social Media Marketing Copilot for Indian Retail Businesses, Creators, and Agencies with native support for தமிழ் (Tamil), Tanglish, and English.**

---

## 🌟 Overview & Target Audience

NammaContent AI solves the biggest problem faced by Indian small businesses and regional agencies: **generic AI tools produce stiff, robotic textbook translations that do not connect with regional social media audiences.**

NammaContent AI is purpose-built for:
- 🍛 **Restaurants, Biryani Messes & Bakeries**: Sunday specials, festival feasts, Swiggy/Zomato calls to action.
- 🥻 **Silk Sarees & Clothing Boutiques**: Aadi clearance sales, bridal collections, muhurtham drapes.
- 💇‍♀️ **Salons, Spas & Beauty Clinics**: Hydra facial combos, bridal glow packages.
- 📚 **Tuition Centres & Coaching Academies**: Board exam crash courses, admission announcements.
- 🏢 **Real Estate & Builders**: Project pre-launches, 2BHK/3BHK villa walkthroughs.
- 🚀 **Digital Marketing Agencies**: Managing multi-brand client accounts from a single dashboard.

---

## 🚀 Key Features

1. **AI Content Studio (12 Specialized Formats)**:
   - Instagram Captions (hooks, body, offer, hashtags)
   - Viral Reel Hooks (first 3-second scroll stoppers)
   - Short-form Video Scripts (camera visuals + Tamil/Tanglish spoken audio)
   - Carousel Post Outlines (slide-by-slide value decks)
   - Content Ideas & Pillars
   - Promotional Campaigns & Launches
   - Product / Menu Descriptions
   - High-Conversion Calls to Action (WhatsApp direct link triggers)
   - Localized Hashtag Stacks (#ChennaiFoodie, #TNagarEats, etc.)
   - Festival & Seasonal Campaigns (Pongal, Deepavali, Tamil New Year, Aadi sale)
   - Tamil Business Ads (கவர்ச்சிகரமான விளம்பர வரிகள்)
   - Tanglish Conversational Posts ("Vera level offer!", "Super taste!")

2. **Brand Workspace & Multi-Tenancy**:
   - Multiple brand profiles per organization based on subscription tier.
   - Brand tone calibration, target audience, and automated contact insertion.

3. **Interactive Marketing Calendar**:
   - Monthly & weekly views.
   - Status tracking (`draft`, `scheduled`, `published`, `failed`).
   - Clear distinction between planned reminders and verified API publishing.

4. **Subscriptions & Billing (Razorpay)**:
   - 4 Configurable Tiers: Free (₹0), Starter (₹399/mo), Pro (₹999/mo), Agency (₹2,999/mo).
   - Server-side usage quota enforcement.
   - Webhook signature verification (`/api/webhooks/razorpay`) with idempotency logs.
   - Integrated sandbox simulation mode for instant previewing.

5. **Analytics & Insights**:
   - Real database metrics tracking credit consumption and content formats.
   - Language breakdown (Tanglish vs Tamil vs English).
   - Authentic Instagram integration modal (no fabricated reach data).

6. **Privacy & Security Compliance**:
   - DPDP Act 2023 compliant data export (JSON download) and workspace reset.
   - Row Level Security (RLS) policies for cross-tenant isolation.
   - Zod schema validation on all server endpoints.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack, Server Actions)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4, White & Indigo design system
- **Icons**: Lucide React
- **Charts**: Recharts
- **Database**: Supabase PostgreSQL with Row Level Security
- **Auth**: Supabase Auth + Session Guard
- **Payments**: Razorpay Subscriptions & Webhooks
- **AI Engine**: Google Gemini API with fallback Intelligent Template Engine

---

## 📦 Getting Started

### 1. Prerequisites
- Node.js 18+ (tested on Node v24.14.1)
- npm or pnpm

### 2. Installation
```bash
git clone <repo-url> nammacontent-ai
cd nammacontent-ai
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Database Setup (Supabase)

1. Create a project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard.
3. Run the complete schema script: `supabase/migrations/20261020000000_nammacontent_schema.sql`.
4. (Optional) Run the seed script: `supabase/seed.sql` to populate sample Tamil businesses.
5. Copy your project URL, anon key, and service role key into `.env.local`.

---

## 💳 Razorpay Setup

1. Sign up at [razorpay.com](https://razorpay.com).
2. Generate your API keys (`Key ID` and `Key Secret`) from the Dashboard under **Settings → API Keys**.
3. Create a Webhook URL pointing to: `https://your-domain.com/api/webhooks/razorpay`.
4. Subscribe to the following webhook events:
   - `subscription.activated`
   - `subscription.charged`
   - `payment.captured`
   - `subscription.cancelled`
5. Copy the Webhook Secret into `RAZORPAY_WEBHOOK_SECRET`.

---

## 🤖 AI Provider Setup (Gemini)

1. Get a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Set `GEMINI_API_KEY=your_key` in `.env.local`.
3. If no key is set, the application operates in **Intelligent Mock Mode** with authentic Tamil and Tanglish content templates and displays a clear badge in the UI.

---

## 🚢 Deployment to Vercel

1. Push your repository to GitHub / GitLab.
2. Import the project into [Vercel](https://vercel.com).
3. Set the Environment Variables (`GEMINI_API_KEY`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`).
4. Click **Deploy**.
