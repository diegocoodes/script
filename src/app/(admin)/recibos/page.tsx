import type { Metadata } from "next";
import { ReceiptText } from "lucide-react";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = { title: "Recibos" };

export default function ReceiptsPage() {
  return (
    <ModulePlaceholder
      title="Recibos de pagamento"
      description="Emita e acompanhe recibos vinculados às ordens de serviço."
      icon={ReceiptText}
      features={[
        "Valor numérico e por extenso",
        "Formas de pagamento",
        "Assinatura e carimbo",
        "Histórico por cliente e OS",
      ]}
    />
  );
}
