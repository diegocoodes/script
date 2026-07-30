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
          eyebrow="Pré-visualização A4"
          title={`Documento ${order.number}`}
          description="Confira as informações e escolha o formato de impressão ou download."
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
