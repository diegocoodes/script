import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { ReceiptWorkspace } from "@/components/pdf/document-workflow";
import { getCompany, getOrderById } from "@/repositories/app-repository";

export const metadata: Metadata = { title: "Recibo" };
export const dynamic = "force-dynamic";

export default async function ReceiptDocumentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [order, company] = await Promise.all([getOrderById(id), getCompany()]);
  if (!order) notFound();

  return (
    <>
      <PageHeader
        eyebrow={`Etapa 3 de 3 · ${order.number}`}
        title="Recibo"
        description="Preencha os dados do pagamento e gere o PDF final."
      />
      <ReceiptWorkspace order={order} company={company} />
    </>
  );
}
