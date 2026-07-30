import type { Metadata } from "next";
import { Files } from "lucide-react";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = { title: "Documentos gerados" };

export default function DocumentsPage() {
  return (
    <ModulePlaceholder
      title="Documentos gerados"
      description="Consulte o histórico de PDFs emitidos e seus vínculos com as ordens."
      icon={Files}
      features={[
        "Histórico por tipo",
        "Busca por número da OS",
        "Data e horário de geração",
        "Download do arquivo armazenado",
      ]}
    />
  );
}
