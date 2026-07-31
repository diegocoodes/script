import type { Metadata } from "next";
import { addBusinessDays, format } from "date-fns";
import { PageHeader } from "@/components/layout/page-header";
import { ServiceOrderForm } from "@/components/service-orders/service-order-form";
import { getCustomers } from "@/repositories/app-repository";

export const metadata: Metadata = { title: "Nova ordem de serviço" };
export const dynamic = "force-dynamic";

export default async function NewServiceOrderPage({
  searchParams,
}: {
  searchParams: Promise<{ cliente?: string | string[] }>;
}) {
  const customers = await getCustomers();
  const now = new Date();
  const customerParam = (await searchParams).cliente;
  const initialCustomerId = Array.isArray(customerParam)
    ? customerParam[0]
    : customerParam;

  return (
    <>
      <PageHeader
        eyebrow="Novo atendimento"
        title="Criar ordem de serviço"
        description="Siga as etapas para registrar o recebimento, os valores, os prazos e as assinaturas."
      />
      <ServiceOrderForm
        initialCustomers={customers}
        initialCustomerId={initialCustomerId}
        today={format(now, "yyyy-MM-dd")}
        entryTime={format(now, "HH:mm")}
        expectedDate={format(addBusinessDays(now, 3), "yyyy-MM-dd")}
      />
    </>
  );
}
