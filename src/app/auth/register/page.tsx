"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function RegisterPage() {
  const router = useRouter();
  const toast = useToast();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Account created! Let's set up your brand profile.");
      router.push("/onboarding");
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-slate-50 dark:bg-slate-950">
      <div className="absolute top-5 right-5">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="font-extrabold text-2xl text-slate-900 dark:text-white tracking-tight">
              NammaContent <span className="text-indigo-600">AI</span>
            </span>
          </Link>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Create your Free Account
          </h2>
          <p className="text-xs text-slate-500">
            Get 10 free AI generations. No credit card required.
          </p>
        </div>

        <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
          <form onSubmit={handleRegister} className="space-y-4">
            <Input
              label="Your Full Name"
              required
              placeholder="e.g. Anandha Kumar"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            <Input
              label="Business / Work Email"
              type="email"
              required
              placeholder="anand@velanmess.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              label="Create Password"
              type="password"
              required
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="space-y-2 pt-2 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span>Instant access to Tamil & Tanglish Studio</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span>Social Media Content Calendar included</span>
              </div>
            </div>

            <Button type="submit" isLoading={loading} className="w-full justify-center gap-2 mt-2">
              Continue to Brand Setup
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-semibold text-indigo-600 hover:underline">
              Sign in
            </Link>
          </div>
        </div>

        <div className="text-center text-xs text-slate-400">
          <Link href="/" className="hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
