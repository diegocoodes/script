import type { Metadata } from "next";
import Link from "next/link";
import { MonitorUp } from "lucide-react";
import { EquipmentDirectory } from "@/components/equipment/equipment-directory";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { getEquipment } from "@/repositories/app-repository";

export const metadata: Metadata = { title: "Equipamentos" };
export const dynamic = "force-dynamic";

export default async function EquipmentPage() {
  const equipment = await getEquipment();

  return (
    <>
      <PageHeader
        eyebrow="Patrimônio recebido"
        title="Equipamentos"
        description="Consulte equipamentos, responsáveis, condições de entrada e histórico de atendimentos."
        actions={
          <Button
            size="lg"
            className="h-11 px-4"
            render={<Link href="/equipamentos/novo" />}
          >
            <MonitorUp aria-hidden="true" className="size-4" />
            Novo equipamento
          </Button>
        }
      />
      <EquipmentDirectory equipment={equipment} />
    </>
  );
}
