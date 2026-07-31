import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { OrderDocumentWorkspace } from "@/components/pdf/order-document-workspace";
import {
  getCompany,
  getOrderById,
} from "@/repositories/app-repository";

export const metadata: Metadata = { title: "Documento da ordem" };
export const dynamic = "force-dynamic";

export default async function ServiceOrderDocumentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [order, company] = await Promise.all([
    getOrderById(id),
    getCompany(),
  ]);
  if (!order) notFound();

  return (
    <>
      <div className="no-print">
        <PageHeader
          eyebrow="Etapa 1 de 3 · PDF em uma página"
          title={`Documento ${order.number}`}
          description="Gere a ordem de serviço e continue para o termo de garantia."
        />
      </div>
      <OrderDocumentWorkspace
        order={order}
        company={company}
        generatedAt={new Date().toISOString()}
      />
    </>
  );
}
