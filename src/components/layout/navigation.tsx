"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileClock,
  FilePlus2,
  House,
  MonitorSmartphone,
  UsersRound,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { label: "Início", href: "/inicio", icon: House },
  {
    label: "Nova ordem de serviço",
    href: "/ordens-servico/nova",
    icon: FilePlus2,
    featured: true,
  },
  {
    label: "Ordens de serviço",
    href: "/ordens-servico",
    icon: FileClock,
  },
  { label: "Clientes", href: "/clientes", icon: UsersRound },
  { label: "Equipamentos", href: "/equipamentos", icon: MonitorSmartphone },
] as const;

export function Navigation({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Navegação principal" className="space-y-1">
      {navigation.map((item) => {
        const active =
          item.href === "/inicio"
            ? pathname === item.href
            : pathname.startsWith(item.href);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "group flex min-h-11 items-center gap-3 rounded-xl px-3 text-[13px] font-medium transition-colors",
              active
                ? "bg-blue-600 text-white shadow-md shadow-blue-950/30"
                : "text-slate-400 hover:bg-white/[0.06] hover:text-white",
              "featured" in item &&
                item.featured &&
                !active &&
                "mb-3 border border-blue-400/20 bg-blue-500/10 text-blue-200",
            )}
          >
            <Icon
              aria-hidden="true"
              className={cn(
                "size-[18px] shrink-0",
                active
                  ? "text-white"
                  : "text-slate-500 group-hover:text-blue-300",
              )}
            />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
