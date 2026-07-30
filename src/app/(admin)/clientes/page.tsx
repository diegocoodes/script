import type { Metadata } from "next";
import Link from "next/link";
import { UserPlus } from "lucide-react";
import { CustomerDirectory } from "@/components/customers/customer-directory";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { getCustomers } from "@/repositories/app-repository";

export const metadata: Metadata = { title: "Clientes" };
export const dynamic = "force-dynamic";

export default async function CustomersPage() {
  const customers = await getCustomers();

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
            render={<Link href="/clientes/novo" />}
          >
            <UserPlus aria-hidden="true" className="size-4" />
            Novo cliente
          </Button>
        }
      />
      <CustomerDirectory customers={customers} />
    </>
  );
}
