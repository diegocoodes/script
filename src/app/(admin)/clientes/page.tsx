import type { Metadata } from "next";
import Link from "next/link";
import { UserPlus } from "lucide-react";
import { CustomerDirectory } from "@/components/customers/customer-directory";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { getCompany, getCustomers } from "@/repositories/app-repository";
import type { PreferredDocument } from "@/components/customers/customer-document-actions";

export const metadata: Metadata = { title: "Clientes" };
export const dynamic = "force-dynamic";

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ documento?: string }>;
}) {
  const [{ documento }, customers, company] = await Promise.all([
    searchParams,
    getCustomers(),
    getCompany(),
  ]);
  const preferredDocument = ["ordem", "garantia", "recibo"].includes(
    documento ?? "",
  )
    ? (documento as PreferredDocument)
    : undefined;

  return (
    <>
      <PageHeader
        eyebrow="Relacionamento"
        title="Clientes"
        description="Consulte dados de contato e acompanhe o histórico de equipamentos e ordens."
        actions={
          <Button
            size="lg"
            className="h-11 px-4"
            nativeButton={false}
            render={<Link href="/clientes/novo" />}
          >
            <UserPlus aria-hidden="true" className="size-4" />
            Novo cliente
          </Button>
        }
      />
      <CustomerDirectory
        customers={customers}
        company={company}
        preferredDocument={preferredDocument}
      />
    </>
  );
}
