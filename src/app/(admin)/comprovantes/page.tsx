import type { Metadata } from "next";
import { FileCheck2 } from "lucide-react";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = { title: "Comprovantes" };

export default function ProofsPage() {
  return (
    <ModulePlaceholder
      title="Comprovantes"
      description="Organize comprovantes de recebimento, conclusão, venda e entrega."
      icon={FileCheck2}
      features={[
        "Comprovante de equipamento recebido",
        "Comprovante de serviço concluído",
        "Comprovante de entrega",
        "Confirmação com assinatura",
      ]}
    />
  );
}
