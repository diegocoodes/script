"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { BrandMark } from "@/components/layout/brand-mark";
import { Navigation } from "@/components/layout/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function MobileNavigation() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="outline"
            size="icon-lg"
            className="md:hidden"
            aria-label="Abrir menu principal"
          />
        }
      >
        <Menu aria-hidden="true" className="size-5" />
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-[288px] border-slate-800 bg-[#020817] p-4 text-white"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Menu principal</SheetTitle>
          <SheetDescription>
            Acesse as áreas administrativas da Deyvid Infotech.
          </SheetDescription>
        </SheetHeader>
        <BrandMark className="px-2 pb-7 pt-2" />
        <Navigation onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
