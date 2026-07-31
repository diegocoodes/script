import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { WarrantyWorkspace } from "@/components/pdf/document-workflow";
import { getCompany, getOrderById } from "@/repositories/app-repository";

export const metadata: Metadata = { title: "Termo de garantia" };
export const dynamic = "force-dynamic";

export default async function WarrantyDocumentPage({
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
        eyebrow={`Etapa 2 de 3 · ${order.number}`}
        title="Termo de garantia"
        description="Confira os dados, gere o PDF de uma página e continue para o recibo."
      />
      <WarrantyWorkspace order={order} company={company} />
    </>
  );
}
