import React from "react";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <PublicNavbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
          Terms & Conditions of Service
        </h1>
        <p className="text-xs text-slate-500 mb-8">
          Effective Date: October 20, 2026 &middot; Commercial SaaS Agreement
        </p>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">1. Acceptance of Terms</h2>
            <p>
              By accessing or subscribing to NammaContent AI, you agree to be bound by these commercial Terms of Service. If you are entering into this agreement on behalf of an agency or company, you represent that you have the authority to bind such entity.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">2. Description of Services & AI Disclaimers</h2>
            <p>
              NammaContent AI provides generative marketing tools for Tamil, Tanglish, and English copywriting, multi-brand workspace management, and calendar planning. Generative AI tools provide creative suggestions; users remain solely responsible for reviewing final copy, ensuring factual truthfulness in pricing/offers, and verifying compliance with consumer protection standards.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">3. Subscription, Quotas & Payments</h2>
            <p>
              Paid plans (Starter, Pro, Agency) are billed recurringly via Razorpay on a monthly or annual basis. Each tier includes a specified monthly credit allowance and brand allocation. Quotas reset automatically at the beginning of each billing cycle. You may cancel your subscription at any time; your access will remain active until the end of your prepaid period.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">4. Intellectual Property & Ownership of Content</h2>
            <p>
              You retain 100% full commercial ownership of all copy, captions, scripts, and promotional texts generated through your account. You may publish, edit, monetize, and distribute generated outputs without royalty obligations to NammaContent AI.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">5. Acceptable Use Policy</h2>
            <p>
              You agree not to use NammaContent AI to generate misleading or deceptive advertisements, hate speech, unlawful defamatory remarks, spam campaigns, or content that violates intellectual property or trademark laws in India or abroad.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">6. Governing Law & Jurisdiction</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of India, and any disputes shall be subject to the exclusive jurisdiction of the competent courts in Chennai, Tamil Nadu.
            </p>
          </section>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
