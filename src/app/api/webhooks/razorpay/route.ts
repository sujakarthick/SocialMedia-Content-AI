import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getServiceSupabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || "test_webhook_secret_nammacontent";

    // 1. Verify HMAC SHA-256 signature if signature provided
    if (signature) {
      const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(rawBody)
        .digest("hex");

      if (signature !== expectedSignature) {
        return NextResponse.json(
          { error: "Invalid webhook signature" },
          { status: 400 }
        );
      }
    }

    const event = JSON.parse(rawBody);
    const eventId = event.id || `evt_${Date.now()}`;
    const eventType = event.event || "unknown";

    // 2. Check for duplicate webhook event (idempotency)
    const supabase = getServiceSupabase();
    if (supabase) {
      const { data: existing } = await supabase
        .from("payment_events")
        .select("id")
        .eq("event_id", eventId)
        .single();

      if (existing) {
        return NextResponse.json({
          status: "ignored",
          message: "Event already processed",
        });
      }

      // Record event in payment_events table
      await supabase.from("payment_events").insert({
        event_id: eventId,
        event_type: eventType,
        payload: event,
        status: "processed",
      });

      // Handle subscription events
      if (eventType === "subscription.activated" || eventType === "subscription.charged") {
        const subData = event.payload?.subscription?.entity;
        const notes = subData?.notes || {};
        const orgId = notes.organization_id;
        const planTier = notes.plan_tier || "pro";

        if (orgId) {
          const creditsLimit =
            planTier === "agency" ? 2500 : planTier === "pro" ? 500 : 100;

          await supabase
            .from("organizations")
            .update({
              plan_tier: planTier,
              plan_status: "active",
              monthly_credits_limit: creditsLimit,
              razorpay_subscription_id: subData?.id,
            })
            .eq("id", orgId);
        }
      }
    }

    return NextResponse.json({
      status: "success",
      received: true,
      event: eventType,
      processed_at: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("Webhook processing error:", err);
    return NextResponse.json(
      { error: "Internal server error processing webhook", message: err.message },
      { status: 500 }
    );
  }
}
