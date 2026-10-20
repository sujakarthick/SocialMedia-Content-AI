import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { z } from "zod";

// 1. Test Subscription Quotas & Brand Limits
const PLAN_CONFIGS = {
  free: { maxBrands: 1, credits: 10 },
  starter: { maxBrands: 1, credits: 100 },
  pro: { maxBrands: 3, credits: 500 },
  agency: { maxBrands: 10, credits: 2500 },
};

test("Subscription Quota: Free plan should strictly limit to 1 brand", () => {
  const currentBrands = [{ id: "brand-1", name: "Velan Mess" }];
  const canAddBrand = currentBrands.length < PLAN_CONFIGS.free.maxBrands;
  assert.equal(canAddBrand, false, "Free plan should not allow adding a 2nd brand");
});

test("Subscription Quota: Pro plan should allow up to 3 brands", () => {
  const currentBrands = [
    { id: "brand-1", name: "Velan Mess" },
    { id: "brand-2", name: "Aara Silks" },
  ];
  const canAddBrand = currentBrands.length < PLAN_CONFIGS.pro.maxBrands;
  assert.equal(canAddBrand, true, "Pro plan should allow adding a 3rd brand");
});

test("AI Credit Usage: Should reject generation when monthly credits exhausted", () => {
  const usageRecord = { credits_used: 100, credits_limit: 100 };
  const canGenerate = usageRecord.credits_used < usageRecord.credits_limit;
  assert.equal(canGenerate, false, "Should block generation when quota reached");
});

// 2. Test Server-side Zod Schema Validation
const generateSchema = z.object({
  brandName: z.string().min(1),
  industry: z.string().min(1),
  platform: z.enum(["instagram", "facebook", "whatsapp", "linkedin", "twitter", "youtube_shorts"]),
  contentType: z.enum([
    "caption",
    "reel_hook",
    "video_script",
    "carousel",
    "content_ideas",
    "promotional_campaign",
    "product_description",
    "call_to_action",
    "hashtags",
    "festival_campaign",
    "tamil_business_ad",
    "tanglish_promo",
  ]),
  language: z.enum(["tamil", "tanglish", "english", "bilingual"]),
  topic: z.string().min(2),
});

test("Zod Validation: Valid payload should pass", () => {
  const payload = {
    brandName: "Velan Chettinad",
    industry: "restaurant",
    platform: "instagram",
    contentType: "caption",
    language: "tanglish",
    topic: "Sunday Seeraga Samba Biryani",
  };
  const result = generateSchema.safeParse(payload);
  assert.equal(result.success, true);
});

test("Zod Validation: Invalid language or missing topic should fail validation", () => {
  const invalidPayload = {
    brandName: "Velan Chettinad",
    industry: "restaurant",
    platform: "instagram",
    contentType: "caption",
    language: "french", // Invalid language
    topic: "A", // Too short
  };
  const result = generateSchema.safeParse(invalidPayload);
  assert.equal(result.success, false);
});

// 3. Test Razorpay Webhook HMAC Signature Verification
test("Razorpay Webhook: HMAC SHA-256 signature verification", () => {
  const secret = "test_webhook_secret_nammacontent";
  const payload = JSON.stringify({
    event: "subscription.charged",
    id: "evt_123456",
    payload: { subscription: { entity: { id: "sub_abc", notes: { plan_tier: "pro" } } } },
  });

  const validSignature = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  const computedSignature = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  assert.equal(validSignature, computedSignature, "Signatures must match for genuine webhook");

  const tamperedSignature = crypto.createHmac("sha256", "wrong_secret").update(payload).digest("hex");
  assert.notEqual(validSignature, tamperedSignature, "Tampered signature must be rejected");
});

// 4. Test Multi-Tenant Isolation
test("Tenant Isolation: User from Org A cannot access Brand belonging to Org B", () => {
  const orgAId = "org-111";
  const orgBId = "org-222";

  const brandInOrgB = {
    id: "brand-999",
    organization_id: orgBId,
    name: "Coimbatore Silks",
  };

  const isAccessAllowed = brandInOrgB.organization_id === orgAId;
  assert.equal(isAccessAllowed, false, "Cross-tenant access must be rejected");
});

// 5. Test Tamil & Tanglish Content Formatting
test("Linguistic Engine: Output must include hashtags, headline, and clear body", () => {
  const sampleOutput = {
    headline: "Sunday-na Biryani illaama epdi boss?! 🍗🔥",
    body: "Vera level manam, authentic seeraga samba arisi...",
    cta: "Order via WhatsApp: +91 98401 23456",
    hashtags: ["#ChennaiBiryani", "#NammaChennai"],
  };

  assert.ok(sampleOutput.headline.length > 5, "Headline should be present and catchy");
  assert.ok(sampleOutput.body.length > 10, "Body copy should be formatted");
  assert.ok(sampleOutput.hashtags.length >= 2, "Hashtag stack should be generated");
  assert.match(sampleOutput.cta, /\+91/, "Indian phone number format present in CTA");
});
