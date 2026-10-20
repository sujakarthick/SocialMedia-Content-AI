import React from "react";
import Link from "next/link";
import { Sparkles, MapPin, Mail, Phone } from "lucide-react";

export function PublicFooter() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="font-bold text-lg text-slate-900 dark:text-white">
                NammaContent <span className="text-indigo-600">AI</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              The premier AI social media marketing copilot for Indian retail shops, restaurants, creators, and digital agencies. Generate authentic Tamil, Tanglish, and English content in seconds.
            </p>
            <div className="pt-2 text-xs space-y-1 text-slate-500">
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                <span>Chennai & Coimbatore, Tamil Nadu, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                <span>hello@nammacontent.ai</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                <span>+91 98401 23456</span>
              </div>
            </div>
          </div>

          {/* Solutions by Industry */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-4">
              Industries
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/#features" className="hover:text-indigo-600 transition-colors">
                  Restaurants & Messes
                </Link>
              </li>
              <li>
                <Link href="/#features" className="hover:text-indigo-600 transition-colors">
                  Silk & Clothing Boutiques
                </Link>
              </li>
              <li>
                <Link href="/#features" className="hover:text-indigo-600 transition-colors">
                  Salons & Beauty Spas
                </Link>
              </li>
              <li>
                <Link href="/#features" className="hover:text-indigo-600 transition-colors">
                  Bakeries & Sweet Stalls
                </Link>
              </li>
              <li>
                <Link href="/#features" className="hover:text-indigo-600 transition-colors">
                  Tuition Centres & Academies
                </Link>
              </li>
              <li>
                <Link href="/#features" className="hover:text-indigo-600 transition-colors">
                  Real Estate & Builders
                </Link>
              </li>
            </ul>
          </div>

          {/* Product & Resources */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/#features" className="hover:text-indigo-600 transition-colors">
                  AI Content Studio
                </Link>
              </li>
              <li>
                <Link href="/#features" className="hover:text-indigo-600 transition-colors">
                  Tamil & Tanglish Engine
                </Link>
              </li>
              <li>
                <Link href="/#features" className="hover:text-indigo-600 transition-colors">
                  Multi-Brand Workspace
                </Link>
              </li>
              <li>
                <Link href="/#features" className="hover:text-indigo-600 transition-colors">
                  Marketing Calendar
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-indigo-600 transition-colors">
                  Pricing Plans (INR)
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-indigo-600 transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-4">
              Legal & Support
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/privacy" className="hover:text-indigo-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-indigo-600 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-indigo-600 transition-colors">
                  Contact & Support
                </Link>
              </li>
              <li>
                <span className="inline-block px-2.5 py-1 text-xs font-medium rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  DPDP Act 2023 Compliant
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© 2026 NammaContent AI. All rights reserved. Made with ❤️ for Indian Creators & Businesses.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:underline">
              Privacy
            </Link>
            <Link href="/terms" className="hover:underline">
              Terms
            </Link>
            <Link href="/contact" className="hover:underline">
              Help Desk
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
