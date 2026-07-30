import type { Metadata } from "next";
import { EquipmentForm } from "@/components/equipment/equipment-form";
import { PageHeader } from "@/components/layout/page-header";
import { getCustomers } from "@/repositories/app-repository";

export const metadata: Metadata = { title: "Novo equipamento" };
export const dynamic = "force-dynamic";

export default async function NewEquipmentPage() {
  const customers = await getCustomers();

  return (
    <>
      <PageHeader
        eyebrow="Equipamentos"
        title="Cadastrar equipamento"
        description="Registre identificação, acessórios e estado físico antes de abrir a ordem."
      />
      <EquipmentForm customers={customers} />
    </>
  );
}
