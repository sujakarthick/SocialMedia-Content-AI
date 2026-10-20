import React from "react";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <PublicNavbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-500 mb-8">
          Last updated: October 20, 2026 &middot; Compliant with Digital Personal Data Protection (DPDP) Act 2023
        </p>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">1. Introduction</h2>
            <p>
              Welcome to NammaContent AI (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We respect your privacy and are committed to protecting your personal and business data. This Privacy Policy outlines how we collect, store, process, and safeguard information when you use our web platform and AI services.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">2. Data We Collect</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Account Information:</strong> Name, work email address, telephone/WhatsApp number, and account credentials.</li>
              <li><strong>Brand Profiles:</strong> Brand names, industry categories, product catalogs, target audience parameters, and marketing goals.</li>
              <li><strong>Generated Content Logs:</strong> Social media copy, reel scripts, carousel outlines, and calendar scheduling metadata.</li>
              <li><strong>Billing & Payment Metadata:</strong> Subscription status and transaction identifiers. We do not store card numbers or banking passwords; all payments are processed through Razorpay PCI-DSS certified systems.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">3. Purpose and Legal Basis for Processing</h2>
            <p>
              We process your data strictly to provide AI generation capabilities, manage brand workspace multi-tenancy, handle billing, and comply with applicable statutory laws in India. We do not sell your personal or business data to third-party ad networks.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">4. AI Models & Data Confidentiality</h2>
            <p>
              Inputs submitted to NammaContent AI are used strictly to generate content for your active session. We do not use your proprietary business names, discounts, or private campaign strategies to train public base foundation models.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">5. Data Retention & Your Rights</h2>
            <p>
              You have the right to review, update, export (in JSON format), or permanently delete your account and all associated brand profiles and drafts at any time through the Settings page.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">6. Grievance Officer</h2>
            <p>
              Under the Information Technology Act and DPDP Act 2023, you may contact our designated Grievance Officer at: <strong>privacy@nammacontent.ai</strong> (Attn: Karthik S., Chennai, India).
            </p>
          </section>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
