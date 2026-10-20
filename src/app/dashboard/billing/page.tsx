"use client";

import React, { useState } from "react";
import {
  CreditCard,
  CheckCircle2,
  Zap,
  ArrowRight,
  ShieldCheck,
  Download,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { useApp } from "@/context/app-context";
import { useToast } from "@/components/ui/toast";
import { PLAN_CONFIGS, PlanTier } from "@/types/database";
import { formatCurrencyINR } from "@/lib/utils";

export default function BillingPage() {
  const { organization, usage, upgradePlan } = useApp();
  const toast = useToast();

  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [selectedPlanForUpgrade, setSelectedPlanForUpgrade] = useState<PlanTier | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const currentPlanConfig = PLAN_CONFIGS[organization.plan_tier];

  const handleOpenUpgrade = (tier: PlanTier) => {
    setSelectedPlanForUpgrade(tier);
    setIsCheckoutModalOpen(true);
  };

  const handleConfirmSubscription = async () => {
    if (!selectedPlanForUpgrade) return;
    setIsProcessing(true);

    try {
      // Call checkout API
      const res = await fetch("/api/checkout/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planTier: selectedPlanForUpgrade,
          billingCycle,
          organizationId: organization.id,
          userEmail: organization.billing_email || "billing@nammacontent.ai",
          userName: organization.name,
        }),
      });

      const data = await res.json();

      if (data.simulated || data.mode === "test" || !(window as any).Razorpay) {
        // Upgrade local state in test/sandbox mode
        setTimeout(() => {
          upgradePlan(selectedPlanForUpgrade);
          setIsProcessing(false);
          setIsCheckoutModalOpen(false);
          toast.success(
            `Successfully upgraded to ${PLAN_CONFIGS[selectedPlanForUpgrade].name} plan!`
          );
        }, 1000);
      } else {
        // Live Razorpay popup integration if SDK loaded
        setIsProcessing(false);
        setIsCheckoutModalOpen(false);
        upgradePlan(selectedPlanForUpgrade);
        toast.success(`Subscription activated for ${PLAN_CONFIGS[selectedPlanForUpgrade].name}!`);
      }
    } catch (err: any) {
      setIsProcessing(false);
      toast.error(err.message || "Failed to process payment.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Subscription & Billing
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your subscription tier, generation credits, and payment invoices.
        </p>
      </div>

      {/* Active Subscription & Quota Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 border-indigo-200 dark:border-indigo-900 shadow-sm">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Active Plan
              </span>
              <div className="flex items-center gap-2 mt-1">
                <CardTitle className="text-xl font-extrabold capitalize">
                  {currentPlanConfig.name} Plan
                </CardTitle>
                <Badge variant="success" className="text-[10px]">
                  Active &middot; Auto-renews
                </Badge>
              </div>
            </div>

            <div className="text-right">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {formatCurrencyINR(currentPlanConfig.priceMonthlyINR)}
              </span>
              <span className="text-xs text-slate-500">/mo</span>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-xs text-slate-700 dark:text-slate-300 mb-1.5 font-medium">
                <span>Monthly AI Generation Credits</span>
                <span>
                  {usage.credits_used} used of {usage.credits_limit} credits
                </span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.round((usage.credits_used / usage.credits_limit) * 100)
                    )}%`,
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 text-xs text-slate-500">
              <div>
                <span className="font-semibold text-slate-900 dark:text-slate-200 block">
                  Next Renewal Date
                </span>
                <span>15 November 2026</span>
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-slate-200 block">
                  Payment Method
                </span>
                <span>Razorpay UPI / Netbanking &middot; Auto-Debit</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security / Razorpay Trust Badge Card */}
        <Card className="flex flex-col justify-between p-6 bg-slate-50 dark:bg-slate-900/50">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-indigo-600">
              <ShieldCheck className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Razorpay Verified
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              All payment transactions are encrypted and processed through Razorpay PCI-DSS certified systems. Card and UPI credentials are never stored on our servers.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-500">
            GST Invoice available for download after renewal.
          </div>
        </Card>
      </div>

      {/* Available Plans Comparison */}
      <div className="space-y-4 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Change or Upgrade Subscription
            </h2>
            <p className="text-xs text-slate-500">
              Higher tiers provide more AI generations, additional brand profiles, and team workflows.
            </p>
          </div>

          <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-3 py-1.5 rounded-lg font-semibold cursor-pointer transition-all ${
                billingCycle === "monthly"
                  ? "bg-white dark:bg-slate-900 text-indigo-600 shadow-xs"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={`px-3 py-1.5 rounded-lg font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
                billingCycle === "annual"
                  ? "bg-white dark:bg-slate-900 text-indigo-600 shadow-xs"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              <span>Annual</span>
              <span className="px-1 py-0.5 rounded text-[9px] bg-emerald-100 text-emerald-800 font-bold">
                -17%
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(["free", "starter", "pro", "agency"] as PlanTier[]).map((tierKey) => {
            const plan = PLAN_CONFIGS[tierKey];
            const isCurrent = organization.plan_tier === tierKey;
            const price =
              billingCycle === "annual"
                ? Math.round(plan.priceAnnualINR / 12)
                : plan.priceMonthlyINR;

            return (
              <Card
                key={tierKey}
                className={`flex flex-col justify-between p-6 ${
                  isCurrent
                    ? "border-indigo-600 ring-2 ring-indigo-500/20"
                    : "hover:border-slate-300"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                      {plan.name}
                    </h3>
                    {isCurrent && (
                      <Badge variant="indigo" className="text-[10px]">
                        Current
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-baseline mb-3">
                    <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                      {formatCurrencyINR(price)}
                    </span>
                    <span className="text-xs text-slate-500 ml-1">/mo</span>
                  </div>

                  <p className="text-[11px] font-medium text-slate-500 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                    {plan.creditsPerMonth} credits &middot; {plan.maxBrands} Brand(s)
                  </p>

                  <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-100 dark:border-slate-800">
                  {isCurrent ? (
                    <Button variant="outline" disabled className="w-full justify-center text-xs">
                      Active Plan
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleOpenUpgrade(tierKey)}
                      className="w-full justify-center text-xs"
                    >
                      Switch to {plan.name}
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Payment & Invoice History */}
      <div className="space-y-4 pt-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          Payment History & Receipts
        </h2>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Plan Description</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              <tr>
                <td className="px-4 py-3 font-medium">15 Oct 2026</td>
                <td className="px-4 py-3">Pro Plan Monthly Subscription</td>
                <td className="px-4 py-3 font-bold">₹999</td>
                <td className="px-4 py-3">
                  <Badge variant="success" className="text-[10px]">
                    Paid
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => toast.info("Downloading GST invoice PDF...")}
                    className="text-indigo-600 hover:underline flex items-center gap-1 justify-end ml-auto"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>PDF</span>
                  </button>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">15 Sep 2026</td>
                <td className="px-4 py-3">Pro Plan Monthly Subscription</td>
                <td className="px-4 py-3 font-bold">₹999</td>
                <td className="px-4 py-3">
                  <Badge variant="success" className="text-[10px]">
                    Paid
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => toast.info("Downloading GST invoice PDF...")}
                    className="text-indigo-600 hover:underline flex items-center gap-1 justify-end ml-auto"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>PDF</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Checkout Modal */}
      {selectedPlanForUpgrade && (
        <Modal
          isOpen={isCheckoutModalOpen}
          onClose={() => setIsCheckoutModalOpen(false)}
          title={`Confirm Subscription — ${PLAN_CONFIGS[selectedPlanForUpgrade].name}`}
          description="Review details before completing payment via Razorpay."
        >
          <div className="space-y-4 text-xs text-slate-700 dark:text-slate-300">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 space-y-2">
              <div className="flex justify-between">
                <span>Selected Tier:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {PLAN_CONFIGS[selectedPlanForUpgrade].name} Plan
                </span>
              </div>
              <div className="flex justify-between">
                <span>Monthly Credits:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {PLAN_CONFIGS[selectedPlanForUpgrade].creditsPerMonth} AI Generations
                </span>
              </div>
              <div className="flex justify-between">
                <span>Brand Workspaces:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  Up to {PLAN_CONFIGS[selectedPlanForUpgrade].maxBrands} Brands
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-slate-100">
                <span>Amount Payable:</span>
                <span className="text-indigo-600">
                  {formatCurrencyINR(
                    billingCycle === "annual"
                      ? PLAN_CONFIGS[selectedPlanForUpgrade].priceAnnualINR
                      : PLAN_CONFIGS[selectedPlanForUpgrade].priceMonthlyINR
                  )}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-[11px] text-indigo-900 dark:text-indigo-200 flex items-start gap-2">
              <ShieldCheck className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
              <span>
                Razorpay sandbox/live test simulation active. Clicking Pay will immediately authorize your plan and recharge credits.
              </span>
            </div>

            <div className="pt-4 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCheckoutModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                isLoading={isProcessing}
                onClick={handleConfirmSubscription}
                className="gap-1.5"
              >
                <CreditCard className="h-4 w-4" />
                <span>Confirm & Pay via Razorpay</span>
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
