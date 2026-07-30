"use client";

import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider delay={250}>
      {children}
      <Toaster richColors position="top-right" closeButton />
    </TooltipProvider>
  );
}
