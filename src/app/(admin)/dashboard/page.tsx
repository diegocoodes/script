import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, FilePlus2 } from "lucide-react";
import { DashboardFilters } from "@/components/dashboard/dashboard-filters";
import { MetricCard } from "@/components/dashboard/metric-card";
import { RecentOrders } from "@/components/dashboard/recent-orders";
import { ServiceChart } from "@/components/dashboard/service-chart";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { dashboardMetricIcons } from "@/lib/constants";
import { getDashboardData } from "@/repositories/app-repository";
import { formatCurrency } from "@/utils/formatters";

export const metadata: Metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{
    period?: string;
    from?: string;
    to?: string;
  }>;
}) {
  const filters = await searchParams;
  const activePeriod = filters.period ?? "7days";
  const data = await getDashboardData(filters);
  const maxPopular = Math.max(
    ...data.popularServices.map((service) => service.total),
    1,
  );

  return (
    <>
      <PageHeader
        eyebrow="Visão geral"
        title="Olá, Deyvid. Aqui está sua operação."
        description="Acompanhe os atendimentos, valores e prioridades da assistência em um só lugar."
        actions={
          <Button
            size="lg"
            className="h-11 px-4 shadow-lg shadow-blue-600/20"
            render={<Link href="/ordens-servico/nova" />}
          >
            <FilePlus2 aria-hidden="true" className="size-4" />
            Nova ordem de serviço
          </Button>
        }
      />

      <div className="mb-5 overflow-x-auto pb-1">
        <DashboardFilters
          activePeriod={activePeriod}
          from={filters.from}
          to={filters.to}
        />
      </div>

      <section aria-label="Indicadores do período" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <MetricCard
          label="Ordens abertas"
          value={data.openOrders}
          hint="Demandam acompanhamento"
          icon={dashboardMetricIcons.open}
          tone="blue"
        />
        <MetricCard
          label="Em análise"
          value={data.inAnalysis}
          hint="Aguardam diagnóstico"
          icon={dashboardMetricIcons.analysis}
          tone="sky"
        />
        <MetricCard
          label="Em manutenção"
          value={data.inMaintenance}
          hint="Serviços em execução"
          icon={dashboardMetricIcons.maintenance}
          tone="violet"
        />
        <MetricCard
          label="Prontos"
          value={data.readyForPickup}
          hint="Aguardam retirada"
          icon={dashboardMetricIcons.ready}
          tone="red"
        />
        <MetricCard
          label="Concluídos"
          value={data.completed}
          hint="No período selecionado"
          icon={dashboardMetricIcons.completed}
          tone="emerald"
        />
        <MetricCard
          label="Recebido"
          value={formatCurrency(data.receivedThisMonth)}
          hint="Pagamentos no período"
          icon={dashboardMetricIcons.received}
          tone="slate"
        />
      </section>

      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(310px,0.7fr)]">
        <Card className="gap-0 border-slate-200/80 py-0 shadow-[0_8px_30px_rgb(15_23_42/0.04)]">
          <CardHeader className="flex-row items-center justify-between border-b border-slate-100 px-5 py-4">
            <div>
              <CardTitle className="text-base">Fluxo de atendimentos</CardTitle>
              <p className="mt-1 text-xs text-slate-400">
                Entradas e conclusões nos últimos dias
              </p>
            </div>
            <div className="hidden items-center gap-4 text-[11px] text-slate-500 sm:flex">
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-blue-600" /> Entradas
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-emerald-500" /> Concluídas
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-5">
            <ServiceChart data={data.weeklyFlow} />
          </CardContent>
        </Card>

        <Card className="gap-0 border-slate-200/80 py-0 shadow-[0_8px_30px_rgb(15_23_42/0.04)]">
          <CardHeader className="border-b border-slate-100 px-5 py-4">
            <CardTitle className="text-base">Serviços mais utilizados</CardTitle>
            <p className="mt-1 text-xs text-slate-400">
              Distribuição no período
            </p>
          </CardHeader>
          <CardContent className="space-y-5 p-5">
            {data.popularServices.map((service) => (
              <div key={service.name}>
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">
                    {service.name}
                  </span>
                  <span className="tabular-nums text-slate-400">
                    {service.total}
                  </span>
                </div>
                <Progress value={(service.total / maxPopular) * 100} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-5 gap-0 overflow-hidden border-slate-200/80 py-0 shadow-[0_8px_30px_rgb(15_23_42/0.04)]">
        <CardHeader className="flex-row items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <CardTitle className="text-base">Últimas ordens de serviço</CardTitle>
            <p className="mt-1 text-xs text-slate-400">
              Atendimentos atualizados recentemente
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            render={<Link href="/ordens-servico" />}
          >
            Ver todas
            <ArrowUpRight aria-hidden="true" className="size-3.5" />
          </Button>
        </CardHeader>
        <RecentOrders orders={data.recentOrders} />
      </Card>
    </>
  );
}
