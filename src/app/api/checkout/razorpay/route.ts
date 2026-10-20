import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { PLAN_CONFIGS, PlanTier } from "@/types/database";

const checkoutSchema = z.object({
  planTier: z.enum(["starter", "pro", "agency"]),
  billingCycle: z.enum(["monthly", "annual"]).default("monthly"),
  organizationId: z.string().min(1),
  userEmail: z.string().email(),
  userName: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = checkoutSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid checkout request", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { planTier, billingCycle, organizationId, userEmail, userName } = result.data;
    const plan = PLAN_CONFIGS[planTier as PlanTier];
    const amountINR =
      billingCycle === "annual" ? plan.priceAnnualINR : plan.priceMonthlyINR;

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // If real Razorpay keys are configured, create live Razorpay subscription/order
    if (keyId && keySecret) {
      const basicAuth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
      
      const orderRes = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          Authorization: `Basic ${basicAuth}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amountINR * 100, // paise
          currency: "INR",
          receipt: `rcpt_${Date.now()}`,
          notes: {
            organization_id: organizationId,
            plan_tier: planTier,
            billing_cycle: billingCycle,
          },
        }),
      });

      if (orderRes.ok) {
        const orderData = await orderRes.json();
        return NextResponse.json({
          mode: "live",
          keyId,
          orderId: orderData.id,
          amount: orderData.amount,
          currency: orderData.currency,
          planName: plan.name,
          prefill: {
            name: userName,
            email: userEmail,
          },
        });
      }
    }

    // In local sandbox / testing mode: return simulated checkout session
    return NextResponse.json({
      mode: "test",
      simulated: true,
      message: "Running in sandbox simulation mode. In production, configure RAZORPAY_KEY_ID & RAZORPAY_KEY_SECRET.",
      planTier,
      billingCycle,
      amount: amountINR,
      currency: "INR",
      orderId: `order_mock_${Math.random().toString(36).substring(2, 10)}`,
      subscriptionId: `sub_mock_${Math.random().toString(36).substring(2, 10)}`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to initiate checkout", message: error.message },
      { status: 500 }
    );
  }
}
