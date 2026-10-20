-- NammaContent AI - Production Database Schema Migration
-- Compatible with Supabase PostgreSQL 15+

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Function to handle updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. Profiles (User details)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    phone TEXT,
    preferred_language TEXT DEFAULT 'tanglish' CHECK (preferred_language IN ('tamil', 'tanglish', 'english')),
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'superadmin')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Organizations (Tenant container)
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    billing_email TEXT,
    plan_tier TEXT DEFAULT 'free' CHECK (plan_tier IN ('free', 'starter', 'pro', 'agency')),
    plan_status TEXT DEFAULT 'active' CHECK (plan_status IN ('active', 'trialing', 'past_due', 'canceled')),
    monthly_credits_limit INT DEFAULT 10,
    razorpay_customer_id TEXT,
    razorpay_subscription_id TEXT,
    current_period_end TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Organization Members (RBAC)
CREATE TABLE IF NOT EXISTS public.organization_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (organization_id, user_id)
);

-- 4. Brand Profiles (Businesses managed under an organization)
CREATE TABLE IF NOT EXISTS public.brand_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    logo_url TEXT,
    industry TEXT NOT NULL, -- restaurant, clothing, salon, bakery, tuition, real_estate, etc.
    description TEXT,
    products_services TEXT,
    target_audience TEXT,
    preferred_languages TEXT[] DEFAULT ARRAY['tanglish', 'tamil', 'english'],
    brand_tone TEXT DEFAULT 'friendly_trendy', -- friendly_trendy, traditional_respectful, punchy_local, premium_luxury
    contact_phone TEXT,
    whatsapp_number TEXT,
    location_address TEXT,
    instagram_handle TEXT,
    website_url TEXT,
    marketing_goals TEXT,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Content Generations (Log of AI queries & generated outputs)
CREATE TABLE IF NOT EXISTS public.content_generations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    brand_id UUID REFERENCES public.brand_profiles(id) ON DELETE SET NULL,
    platform TEXT NOT NULL, -- instagram, facebook, whatsapp, linkedin, twitter, youtube_shorts
    content_type TEXT NOT NULL, -- caption, reel_hook, video_script, carousel, ad, festival, etc.
    language TEXT NOT NULL CHECK (language IN ('tamil', 'tanglish', 'english', 'bilingual')),
    prompt_inputs JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_content JSONB NOT NULL DEFAULT '{}'::jsonb,
    model_used TEXT NOT NULL,
    credits_used INT DEFAULT 1,
    is_mock BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Saved Content (Saved posts library)
CREATE TABLE IF NOT EXISTS public.saved_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    brand_id UUID REFERENCES public.brand_profiles(id) ON DELETE SET NULL,
    generation_id UUID REFERENCES public.content_generations(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    format TEXT NOT NULL,
    platform TEXT NOT NULL,
    language TEXT NOT NULL,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    is_favorite BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Content Calendar Items (Scheduled marketing content)
CREATE TABLE IF NOT EXISTS public.content_calendar_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    brand_id UUID REFERENCES public.brand_profiles(id) ON DELETE SET NULL,
    saved_content_id UUID REFERENCES public.saved_content(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,
    platform TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'failed')),
    reminder_sent BOOLEAN DEFAULT false,
    failure_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Subscriptions
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    razorpay_subscription_id TEXT UNIQUE,
    razorpay_plan_id TEXT,
    plan_tier TEXT NOT NULL CHECK (plan_tier IN ('free', 'starter', 'pro', 'agency')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'authenticated', 'pending', 'halted', 'cancelled', 'completed')),
    monthly_credit_allowance INT NOT NULL DEFAULT 10,
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Usage Records (Monthly credit enforcement)
CREATE TABLE IF NOT EXISTS public.usage_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    period_month TEXT NOT NULL, -- Format: 'YYYY-MM'
    credits_used INT NOT NULL DEFAULT 0,
    credits_limit INT NOT NULL DEFAULT 10,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (organization_id, period_month)
);

-- 10. Payment Events (Webhook idempotency and transaction logs)
CREATE TABLE IF NOT EXISTS public.payment_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id TEXT UNIQUE NOT NULL,
    event_type TEXT NOT NULL,
    payload JSONB NOT NULL,
    status TEXT NOT NULL DEFAULT 'processed' CHECK (status IN ('processed', 'failed', 'ignored')),
    processed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Audit Logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    details JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_org_members_user ON public.organization_members(user_id);
CREATE INDEX IF NOT EXISTS idx_org_members_org ON public.organization_members(organization_id);
CREATE INDEX IF NOT EXISTS idx_brand_profiles_org ON public.brand_profiles(organization_id);
CREATE INDEX IF NOT EXISTS idx_content_gen_org ON public.content_generations(organization_id);
CREATE INDEX IF NOT EXISTS idx_saved_content_org ON public.saved_content(organization_id);
CREATE INDEX IF NOT EXISTS idx_calendar_items_org_date ON public.content_calendar_items(organization_id, scheduled_date);
CREATE INDEX IF NOT EXISTS idx_usage_org_month ON public.usage_records(organization_id, period_month);

-- Triggers for updated_at
CREATE OR REPLACE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER trg_orgs_updated_at BEFORE UPDATE ON public.organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER trg_brand_profiles_updated_at BEFORE UPDATE ON public.brand_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER trg_saved_content_updated_at BEFORE UPDATE ON public.saved_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER trg_calendar_items_updated_at BEFORE UPDATE ON public.content_calendar_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER trg_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_calendar_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function: Check if auth user is member of organization
CREATE OR REPLACE FUNCTION public.is_org_member(org_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.organization_members
        WHERE organization_id = org_id AND user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: Users can view and edit their own profile
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Organizations: Only members can view/update
CREATE POLICY "Org members can view organization" ON public.organizations FOR SELECT USING (public.is_org_member(id));
CREATE POLICY "Org owners/admins can update organization" ON public.organizations FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM public.organization_members
        WHERE organization_id = id AND user_id = auth.uid() AND role IN ('owner', 'admin')
    )
);

-- Organization Members: Members can view team; admins can manage
CREATE POLICY "Org members can view members" ON public.organization_members FOR SELECT USING (public.is_org_member(organization_id));
CREATE POLICY "Org admins can manage members" ON public.organization_members FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.organization_members
        WHERE organization_id = organization_members.organization_id AND user_id = auth.uid() AND role IN ('owner', 'admin')
    )
);

-- Brand Profiles: Org members can access
CREATE POLICY "Org members can access brand profiles" ON public.brand_profiles FOR ALL USING (public.is_org_member(organization_id));

-- Content Generations: Org members can access
CREATE POLICY "Org members can access content generations" ON public.content_generations FOR ALL USING (public.is_org_member(organization_id));

-- Saved Content: Org members can access
CREATE POLICY "Org members can access saved content" ON public.saved_content FOR ALL USING (public.is_org_member(organization_id));

-- Calendar Items: Org members can access
CREATE POLICY "Org members can access calendar items" ON public.content_calendar_items FOR ALL USING (public.is_org_member(organization_id));

-- Subscriptions: Org members can view
CREATE POLICY "Org members can view subscriptions" ON public.subscriptions FOR SELECT USING (public.is_org_member(organization_id));

-- Usage Records: Org members can view
CREATE POLICY "Org members can view usage records" ON public.usage_records FOR SELECT USING (public.is_org_member(organization_id));

-- Payment Events: Only service role
CREATE POLICY "Service role manages payment events" ON public.payment_events FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Audit Logs: Org admins can view
CREATE POLICY "Org admins can view audit logs" ON public.audit_logs FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.organization_members
        WHERE organization_id = audit_logs.organization_id AND user_id = auth.uid() AND role IN ('owner', 'admin')
    )
);
