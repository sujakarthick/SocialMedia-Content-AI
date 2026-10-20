# Supabase Database & Auth Setup Guide

## 1. Overview
NammaContent AI uses Supabase PostgreSQL as its multi-tenant relational database with strict Row Level Security (RLS) policies.

## 2. Step-by-Step Setup

1. **Create Supabase Account**: Visit [https://supabase.com](https://supabase.com) and create a new project. Choose South Asia (Mumbai, `ap-south-1`) for lowest latency in India.
2. **Execute Database Migrations**:
   - Go to the **SQL Editor** tab in your Supabase dashboard.
   - Paste and run the entire contents of `supabase/migrations/20261020000000_nammacontent_schema.sql`.
   - Verify that all 11 tables are created:
     - `profiles`
     - `organizations`
     - `organization_members`
     - `brand_profiles`
     - `content_generations`
     - `saved_content`
     - `content_calendar_items`
     - `subscriptions`
     - `usage_records`
     - `payment_events`
     - `audit_logs`
3. **Execute Seed Data (Optional)**:
   - In SQL Editor, run `supabase/seed.sql` to populate sample restaurants, silk boutiques, generations, and calendar posts.
4. **Retrieve API Credentials**:
   - Navigate to **Project Settings → API**.
   - Copy `Project URL` → set as `NEXT_PUBLIC_SUPABASE_URL`.
   - Copy `anon` `public` key → set as `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
   - Copy `service_role` `secret` key → set as `SUPABASE_SERVICE_ROLE_KEY`.

## 3. Row Level Security Verification
The schema includes security definer functions (`is_org_member`) ensuring that:
- Users can never query or manipulate records belonging to another organization.
- Organization owners and admins can invite and manage members.
- The service role has exclusive access to `payment_events`.
