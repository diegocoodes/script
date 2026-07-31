import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { DeliveryReceiptForm } from "@/components/pdf/delivery-receipt-form";
import { getCompany } from "@/repositories/app-repository";

export const metadata: Metadata = { title: "Comprovante de entrega" };
export const dynamic = "force-dynamic";

export default async function NewDeliveryReceiptPage() {
  const company = await getCompany();

  return (
    <>
      <PageHeader
        eyebrow="Documento independente"
        title="Comprovante de entrega"
        description="Preencha os dados da entrega e gere um PDF de uma única página."
      />
      <DeliveryReceiptForm company={company} />
    </>
  );
}
