"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, CheckCircle2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";
import { useToast } from "@/components/ui/toast";

export default function ContactPage() {
  const toast = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    businessType: "Restaurant / Mess",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error("Please fill in your name and email.");
      return;
    }
    setSubmitted(true);
    toast.success("Thank you! Our support team will get in touch via WhatsApp / Email.");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <PublicNavbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Get in Touch With Our Team
          </h1>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm">
            Have questions about custom plans, agency onboarding, or API access? We are here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto items-start">
          {/* Contact Details */}
          <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Chennai & Coimbatore Offices
            </h2>

            <div className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-200">
                    NammaContent AI HQ
                  </p>
                  <p>Anna Salai, Guindy, Chennai, Tamil Nadu 600032</p>
                  <p className="text-xs text-slate-400 mt-1">Branch: Gandhipuram, Coimbatore 641012</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-indigo-600 shrink-0" />
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-200">Email</p>
                  <p>support@nammacontent.ai / sales@nammacontent.ai</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-indigo-600 shrink-0" />
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-200">WhatsApp / Phone</p>
                  <p>+91 98401 23456 (Mon - Sat, 9:30 AM - 7:00 PM IST)</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
              ⚡ Typical response time: Under 2 hours during business hours.
            </div>
          </div>

          {/* Contact Form */}
          <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            {submitted ? (
              <div className="text-center py-10 space-y-4">
                <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Message Received!
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Vanakkam {formData.name}, we will connect with you on {formData.email} shortly.
                </p>
                <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
                  Send Another Inquiry
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Your Full Name"
                  required
                  placeholder="e.g. Ramesh Kannan"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />

                <Input
                  label="Work Email Address"
                  type="email"
                  required
                  placeholder="ramesh@mybusiness.in"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />

                <Input
                  label="Phone / WhatsApp Number"
                  placeholder="+91 98400 00000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Business Industry
                  </label>
                  <select
                    value={formData.businessType}
                    onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Restaurant / Mess">Restaurant / Mess / Bakery</option>
                    <option value="Clothing / Sarees">Clothing / Silk Boutique</option>
                    <option value="Salon / Beauty">Salon & Spa</option>
                    <option value="Tuition / Coaching">Tuition / Academy</option>
                    <option value="Real Estate">Real Estate / Construction</option>
                    <option value="Marketing Agency">Marketing Agency (Multi-Client)</option>
                    <option value="Creator / Freelancer">Creator / Freelancer</option>
                  </select>
                </div>

                <Textarea
                  label="How can we help?"
                  rows={3}
                  placeholder="Tell us about your brand or questions..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />

                <Button type="submit" className="w-full gap-2">
                  <Send className="h-4 w-4" />
                  Submit Inquiry
                </Button>
              </form>
            )}
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
