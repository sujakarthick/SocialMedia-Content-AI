"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle2, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";
import { PLAN_CONFIGS, PlanTier } from "@/types/database";
import { formatCurrencyINR } from "@/lib/utils";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <PublicNavbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="indigo">Simple, Predictable Pricing</Badge>
          <h1 className="mt-4 text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Plans Built for Tamil Nadu & Indian Businesses
          </h1>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-400">
            From single retail shops to full-service marketing agencies. Scale up or down anytime.
          </p>

          <div className="mt-8 inline-flex items-center p-1 rounded-xl bg-slate-200/80 dark:bg-slate-800 border border-slate-300 dark:border-slate-700">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                billingCycle === "monthly"
                  ? "bg-white dark:bg-slate-900 text-indigo-600 shadow-xs"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                billingCycle === "annual"
                  ? "bg-white dark:bg-slate-900 text-indigo-600 shadow-xs"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              <span>Annual Billing</span>
              <span className="px-1.5 py-0.5 rounded text-xs bg-emerald-100 text-emerald-800 font-bold">
                Save 17%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {(["free", "starter", "pro", "agency"] as PlanTier[]).map((tierKey) => {
            const plan = PLAN_CONFIGS[tierKey];
            const price =
              billingCycle === "annual"
                ? Math.round(plan.priceAnnualINR / 12)
                : plan.priceMonthlyINR;

            return (
              <div
                key={tierKey}
                className={`relative flex flex-col justify-between p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border ${
                  plan.popular
                    ? "border-indigo-600 shadow-2xl ring-2 ring-indigo-600/20"
                    : "border-slate-200 dark:border-slate-800 shadow-xs"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider shadow-sm">
                    Recommended
                  </div>
                )}

                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    {plan.name}
                  </h3>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-4xl font-extrabold text-slate-900 dark:text-white">
                      {formatCurrencyINR(price)}
                    </span>
                    <span className="text-sm text-slate-500 ml-1.5">/month</span>
                  </div>

                  <p className="mt-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {plan.creditsPerMonth} AI Generations &middot; Up to {plan.maxBrands} Brand(s)
                  </p>

                  <ul className="mt-6 space-y-3 border-t border-slate-100 dark:border-slate-800 pt-6">
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feature}</span>
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
                      {tierKey === "free" ? "Start Free" : `Choose ${plan.name}`}
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
