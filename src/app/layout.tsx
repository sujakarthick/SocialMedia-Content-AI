import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "NammaContent AI — Tamil, Tanglish & English Social Media Marketing Platform",
  description:
    "AI-powered social media marketing copilot for Indian retail shops, restaurants, boutiques, salons, and digital agencies. Generate viral Instagram captions, reel hooks, video scripts, and festival campaigns in Tamil, Tanglish, and English.",
  keywords: [
    "Tamil AI social media",
    "Tanglish Instagram captions",
    "Tamil marketing copilot",
    "Chennai small business marketing",
    "Indian social media AI",
    "Tamil reel hooks generator",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body className="min-h-full flex flex-col font-sans antialiased bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
