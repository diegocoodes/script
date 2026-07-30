import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = { title: "Garantias" };

export default function WarrantiesPage() {
  return (
    <ModulePlaceholder
      title="Termos de garantia"
      description="Gerencie prazos, peças substituídas e cláusulas de garantia."
      icon={ShieldCheck}
      features={[
        "Prazo inicial e final",
        "Cláusulas configuráveis",
        "Assinaturas das partes",
        "PDF vinculado à ordem",
      ]}
    />
  );
}
