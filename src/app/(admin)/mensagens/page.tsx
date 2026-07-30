import type { Metadata } from "next";
import { MessageCircleMore } from "lucide-react";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = { title: "Mensagens" };

export default function MessagesPage() {
  return (
    <ModulePlaceholder
      title="Mensagens para WhatsApp"
      description="Personalize mensagens automáticas com dados do cliente, equipamento e ordem."
      icon={MessageCircleMore}
      features={[
        "Equipamento recebido",
        "Orçamento disponível",
        "Serviço concluído",
        "Pronto para retirada",
      ]}
    />
  );
}
