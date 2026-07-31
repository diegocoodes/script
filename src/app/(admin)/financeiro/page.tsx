import type { Metadata } from "next";
import Link from "next/link";
import {
  BanknoteArrowDown,
  BanknoteArrowUp,
  CircleDollarSign,
  Clock3,
  ShoppingCart,
} from "lucide-react";
import { MetricCard } from "@/components/dashboard/metric-card";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { purchaseCategoryLabels } from "@/lib/constants";
import { getFinancialData } from "@/repositories/finance-repository";
import { formatCurrency, formatDate } from "@/utils/formatters";

export const metadata: Metadata = { title: "Financeiro" };
export const dynamic = "force-dynamic";

export default async function FinancialPage() {
  const data = await getFinancialData();

  return (
    <>
      <PageHeader
        eyebrow="Controle financeiro"
        title="Financeiro"
        description="Acompanhe automaticamente os valores recebidos dos clientes, as compras da empresa e o saldo atual."
        actions={
          <Button
            size="lg"
            className="min-h-11"
            nativeButton={false}
            render={<Link href="/compras" />}
          >
            <ShoppingCart aria-hidden="true" className="size-4" />
            Registrar compra
          </Button>
        }
      />

      <section aria-label="Resumo financeiro" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Ganhos recebidos"
          value={formatCurrency(data.totalRevenue)}
          hint={`${data.revenueCount} ordens com pagamento registrado`}
          icon={BanknoteArrowUp}
          tone="emerald"
        />
        <MetricCard
          label="Total gasto"
          value={formatCurrency(data.totalExpenses)}
          hint={`${data.purchaseCount} compras lançadas`}
          icon={BanknoteArrowDown}
          tone="red"
        />
        <MetricCard
          label="Saldo atual"
          value={formatCurrency(data.balance)}
          hint="Ganhos recebidos menos gastos"
          icon={CircleDollarSign}
          tone={data.balance >= 0 ? "blue" : "red"}
        />
        <MetricCard
          label="Ainda a receber"
          value={formatCurrency(data.outstandingValue)}
          hint="Valores pendentes nas ordens ativas"
          icon={Clock3}
          tone="violet"
        />
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card className="gap-0 rounded-2xl border-slate-200/80 py-0 shadow-[0_10px_36px_rgb(15_23_42/0.05)]">
          <CardHeader className="border-b border-slate-100 px-4 py-5 sm:px-6">
            <CardTitle className="text-lg font-extrabold text-slate-900">
              Ganhos de clientes
            </CardTitle>
            <p className="text-sm text-slate-500">
              O valor pago em cada ordem entra aqui automaticamente.
            </p>
          </CardHeader>
          <CardContent className="p-0">
            {data.recentRevenues.length === 0 ? (
              <p className="px-6 py-12 text-center text-sm text-slate-500">
                Nenhum pagamento de cliente registrado.
              </p>
            ) : (
              <>
                <div className="hidden overflow-x-auto sm:block">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50/70">
                        <TableHead>Ordem e cliente</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead className="text-right">Recebido</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.recentRevenues.map((revenue) => (
                        <TableRow key={revenue.id}>
                          <TableCell>
                            <Link
                              href={`/ordens-servico/${revenue.id}`}
                              className="font-bold text-blue-700 hover:underline"
                            >
                              {revenue.number}
                            </Link>
                            <span className="block text-xs text-slate-500">
                              {revenue.customerName}
                            </span>
                          </TableCell>
                          <TableCell className="text-slate-600">
                            {formatDate(revenue.entryDate)}
                          </TableCell>
                          <TableCell className="text-right font-bold tabular-nums text-emerald-700">
                            {formatCurrency(revenue.paidValue)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="divide-y divide-slate-100 sm:hidden">
                  {data.recentRevenues.map((revenue) => (
                    <article key={revenue.id} className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <Link
                            href={`/ordens-servico/${revenue.id}`}
                            className="font-bold text-blue-700"
                          >
                            {revenue.number}
                          </Link>
                          <p className="mt-1 text-xs text-slate-500">
                            {revenue.customerName} · {formatDate(revenue.entryDate)}
                          </p>
                        </div>
                        <strong className="shrink-0 text-sm tabular-nums text-emerald-700">
                          {formatCurrency(revenue.paidValue)}
                        </strong>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="gap-0 rounded-2xl border-slate-200/80 py-0 shadow-[0_10px_36px_rgb(15_23_42/0.05)]">
          <CardHeader className="border-b border-slate-100 px-4 py-5 sm:px-6">
            <CardTitle className="text-lg font-extrabold text-slate-900">
              Gastos recentes
            </CardTitle>
            <p className="text-sm text-slate-500">
              Compras registradas para a operação da empresa.
            </p>
          </CardHeader>
          <CardContent className="p-0">
            {data.recentPurchases.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <p className="text-sm text-slate-500">Nenhum gasto registrado.</p>
                <Button
                  variant="outline"
                  className="mt-4 min-h-11"
                  nativeButton={false}
                  render={<Link href="/compras" />}
                >
                  Registrar primeira compra
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {data.recentPurchases.map((purchase) => (
                  <article key={purchase.id} className="flex items-start justify-between gap-4 p-4 sm:px-6">
                    <div>
                      <h2 className="font-bold text-slate-800">
                        {purchase.description}
                      </h2>
                      <p className="mt-1 text-xs text-slate-500">
                        {purchaseCategoryLabels[purchase.category] ?? purchase.category}
                        {" · "}
                        {formatDate(purchase.purchasedAt)}
                      </p>
                    </div>
                    <strong className="shrink-0 text-sm tabular-nums text-red-600">
                      {formatCurrency(purchase.totalValue)}
                    </strong>
                  </article>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
