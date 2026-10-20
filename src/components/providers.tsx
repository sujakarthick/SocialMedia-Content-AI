"use client";

import React from "react";
import { ToastProvider } from "@/components/ui/toast";
import { AppProvider } from "@/context/app-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <AppProvider>{children}</AppProvider>
    </ToastProvider>
  );
}
