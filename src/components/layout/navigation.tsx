"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileCheck2,
  FileClock,
  FilePlus2,
  Files,
  Gauge,
  MessageCircleMore,
  MonitorSmartphone,
  ReceiptText,
  Settings2,
  ShieldCheck,
  UsersRound,
  Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { label: "Dashboard", href: "/dashboard", icon: Gauge },
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
  { label: "Recibos", href: "/recibos", icon: ReceiptText },
  { label: "Garantias", href: "/garantias", icon: ShieldCheck },
  { label: "Comprovantes", href: "/comprovantes", icon: FileCheck2 },
  { label: "Tabela de serviços", href: "/servicos", icon: Wrench },
  { label: "Mensagens", href: "/mensagens", icon: MessageCircleMore },
  { label: "Documentos gerados", href: "/documentos", icon: Files },
  { label: "Configurações", href: "/configuracoes", icon: Settings2 },
] as const;

export function Navigation({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Navegação principal" className="space-y-1">
      {navigation.map((item) => {
        const active =
          item.href === "/dashboard"
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
