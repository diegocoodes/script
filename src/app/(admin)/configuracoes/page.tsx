import type { Metadata } from "next";
import { Settings2 } from "lucide-react";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = { title: "Configurações" };

export default function SettingsPage() {
  return (
    <ModulePlaceholder
      title="Configurações"
      description="Centralize identidade da empresa, numeração, mensagens e textos jurídicos."
      icon={Settings2}
      features={[
        "Dados e identidade da empresa",
        "Assinatura e carimbo",
        "Cores principais",
        "Garantia e textos jurídicos",
      ]}
    />
  );
}
