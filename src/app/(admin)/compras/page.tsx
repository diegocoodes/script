import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, WalletCards } from "lucide-react";
import { BusinessPurchaseForm } from "@/components/finance/business-purchase-form";
import { BusinessPurchaseList } from "@/components/finance/business-purchase-list";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { getBusinessPurchases } from "@/repositories/finance-repository";

export const metadata: Metadata = { title: "Compras e gastos" };
export const dynamic = "force-dynamic";

function getTodayInSaoPaulo() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value]),
  );
  return `${values.year}-${values.month}-${values.day}`;
}

export default async function PurchasesPage() {
  const purchases = await getBusinessPurchases();

  return (
    <>
      <PageHeader
        eyebrow="Saídas da empresa"
        title="Compras e gastos"
        description="Registre o que foi comprado e o valor total gasto. Cada lançamento atualiza o financeiro automaticamente."
        actions={
          <Button
            variant="outline"
            className="min-h-11"
            nativeButton={false}
            render={<Link href="/financeiro" />}
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Ver financeiro
            <WalletCards aria-hidden="true" className="size-4" />
          </Button>
        }
      />

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(340px,0.8fr)_minmax(0,1.2fr)]">
        <BusinessPurchaseForm defaultDate={getTodayInSaoPaulo()} />
        <BusinessPurchaseList purchases={purchases} />
      </div>
    </>
  );
}
