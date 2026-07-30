import type { Metadata } from "next";
import Link from "next/link";
import { FilePlus2 } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { ServiceOrderDirectory } from "@/components/service-orders/service-order-directory";
import { Button } from "@/components/ui/button";
import { getOrders } from "@/repositories/app-repository";

export const metadata: Metadata = { title: "Ordens de serviço" };
export const dynamic = "force-dynamic";

export default async function ServiceOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const orders = await getOrders();

  return (
    <>
      <PageHeader
        eyebrow="Atendimentos"
        title="Ordens de serviço"
        description="Acompanhe o ciclo completo de cada equipamento, do recebimento à entrega."
        actions={
          <Button
            size="lg"
            className="h-11 px-4"
            render={<Link href="/ordens-servico/nova" />}
          >
            <FilePlus2 aria-hidden="true" className="size-4" />
            Nova ordem
          </Button>
        }
      />
      <ServiceOrderDirectory orders={orders} initialSearch={q ?? ""} />
    </>
  );
}
