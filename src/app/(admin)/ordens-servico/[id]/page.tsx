import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CalendarClock,
  CircleDollarSign,
  FileText,
  Laptop,
  MessageCircle,
  UserRound,
  Wrench,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { OrderStatusControl } from "@/components/service-orders/order-status-control";
import { StatusBadge } from "@/components/service-orders/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  equipmentTypeLabels,
  paymentMethodLabels,
  priorityConfig,
} from "@/lib/constants";
import { getOrderById } from "@/repositories/app-repository";
import { cn } from "@/lib/utils";
import {
  formatCurrency,
  formatDate,
  formatWhatsappUrl,
} from "@/utils/formatters";

export const metadata: Metadata = { title: "Detalhes da ordem" };
export const dynamic = "force-dynamic";

function Detail({
  label,
  value,
  className,
}: {
  label: string;
  value: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </dt>
      <dd className="mt-1 text-sm leading-6 text-slate-700">{value || "—"}</dd>
    </div>
  );
}

export default async function ServiceOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) notFound();

  const priority =
    priorityConfig[order.priority as keyof typeof priorityConfig] ??
    priorityConfig.NORMAL;
  const message = `Olá, ${order.customerName}! Segue uma atualização da sua ordem ${order.number}, referente ao equipamento ${order.equipmentLabel}. O status atual é: ${order.status}.`;

  return (
    <>
      <PageHeader
        eyebrow="Ordem de serviço"
        title={order.number}
        description={`Aberta em ${formatDate(order.entryDate, true)} · Atualizada em ${formatDate(order.updatedAt, true)}`}
        actions={
          <>
            <OrderStatusControl
              orderId={order.id}
              currentStatus={order.status}
            />
            {order.customerWhatsapp && (
              <Button
                variant="outline"
                size="lg"
                className="h-11"
                render={
                  <a
                    href={formatWhatsappUrl(order.customerWhatsapp, message)}
                    target="_blank"
                    rel="noreferrer"
                  />
                }
              >
                <MessageCircle
                  aria-hidden="true"
                  className="size-4 text-emerald-600"
                />
                WhatsApp
              </Button>
            )}
            <Button
              size="lg"
              className="h-11"
              render={
                <Link href={`/ordens-servico/${order.id}/documento`} />
              }
            >
              <FileText aria-hidden="true" className="size-4" />
              Gerar PDF da ordem
            </Button>
          </>
        }
      />

      <div className="mb-5 flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_8px_30px_rgb(15_23_42/0.04)]">
        <StatusBadge status={order.status} />
        <span className="h-5 w-px bg-slate-200" aria-hidden="true" />
        <span className={cn("text-xs font-bold", priority.className)}>
          Prioridade {priority.label.toLocaleLowerCase("pt-BR")}
        </span>
        {order.expectedDeliveryDate && (
          <>
            <span className="h-5 w-px bg-slate-200" aria-hidden="true" />
            <span className="flex items-center gap-1.5 text-xs text-slate-500">
              <CalendarClock aria-hidden="true" className="size-3.5" />
              Previsão: {formatDate(order.expectedDeliveryDate)}
            </span>
          </>
        )}
      </div>

      <div>
        <div className="space-y-5">
          <div className="grid gap-5 lg:grid-cols-2">
            <Card className="gap-0 border-slate-200/80 py-0 shadow-[0_8px_30px_rgb(15_23_42/0.04)]">
              <CardHeader className="border-b border-slate-100 px-5 py-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  <UserRound
                    aria-hidden="true"
                    className="size-4 text-blue-600"
                  />
                  Cliente
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <dl className="grid gap-4 sm:grid-cols-2">
                  <Detail
                    label="Nome"
                    value={order.customerName}
                    className="sm:col-span-2"
                  />
                  <Detail
                    label="CPF ou CNPJ"
                    value={order.customerDocument}
                  />
                  <Detail
                    label="Telefone"
                    value={order.customerPhone || order.customerWhatsapp}
                  />
                </dl>
              </CardContent>
            </Card>

            <Card className="gap-0 border-slate-200/80 py-0 shadow-[0_8px_30px_rgb(15_23_42/0.04)]">
              <CardHeader className="border-b border-slate-100 px-5 py-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Laptop
                    aria-hidden="true"
                    className="size-4 text-blue-600"
                  />
                  Equipamento
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <dl className="grid gap-4 sm:grid-cols-2">
                  <Detail
                    label="Tipo"
                    value={
                      equipmentTypeLabels[order.equipmentType] ??
                      order.equipmentType
                    }
                  />
                  <Detail label="Marca e modelo" value={order.equipmentLabel} />
                  <Detail
                    label="Número de série"
                    value={order.equipmentSerialNumber}
                  />
                  <Detail label="Cor" value={order.equipmentColor} />
                  <Detail
                    label="Acessórios entregues"
                    value={order.deliveredAccessories}
                    className="sm:col-span-2"
                  />
                  <Detail
                    label="Estado físico"
                    value={order.physicalCondition}
                    className="sm:col-span-2"
                  />
                  <Detail
                    label="Descrição do equipamento"
                    value={order.equipmentDescription}
                    className="sm:col-span-2"
                  />
                </dl>
              </CardContent>
            </Card>
          </div>

          <Card className="gap-0 border-slate-200/80 py-0 shadow-[0_8px_30px_rgb(15_23_42/0.04)]">
            <CardHeader className="border-b border-slate-100 px-5 py-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <Wrench
                  aria-hidden="true"
                  className="size-4 text-blue-600"
                />
                Diagnóstico e serviço
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <dl className="grid gap-5 lg:grid-cols-2">
                <Detail
                  label="Defeito relatado"
                  value={order.reportedDefect}
                />
                <Detail
                  label="Serviço solicitado"
                  value={order.requestedService}
                />
                <Detail
                  label="Diagnóstico técnico"
                  value={order.technicalDiagnosis}
                />
                <Detail
                  label="Serviço realizado"
                  value={order.performedService}
                />
                <Detail
                  label="Peças utilizadas"
                  value={order.partsUsed}
                  className="lg:col-span-2"
                />
                <Detail
                  label="Observações para o cliente"
                  value={order.customerNotes}
                  className="lg:col-span-2"
                />
              </dl>
            </CardContent>
          </Card>

          <Card className="gap-0 border-slate-200/80 py-0 shadow-[0_8px_30px_rgb(15_23_42/0.04)]">
            <CardHeader className="border-b border-slate-100 px-5 py-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <CircleDollarSign
                  aria-hidden="true"
                  className="size-4 text-blue-600"
                />
                Informações financeiras
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <Detail
                  label="Serviços"
                  value={formatCurrency(order.serviceValue)}
                />
                <Detail
                  label="Peças"
                  value={formatCurrency(order.partsValue)}
                />
                <Detail
                  label="Desconto"
                  value={formatCurrency(order.discount)}
                />
                <Detail
                  label="Acréscimo"
                  value={formatCurrency(order.surcharge)}
                />
              </dl>
              <Separator className="my-5" />
              <div className="grid gap-3 rounded-xl bg-slate-950 p-4 text-white sm:grid-cols-3">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400">
                    Total
                  </p>
                  <p className="mt-1 text-lg font-extrabold">
                    {formatCurrency(order.totalValue)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400">
                    Pago
                  </p>
                  <p className="mt-1 text-lg font-extrabold text-emerald-400">
                    {formatCurrency(order.paidValue)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400">
                    Pendente
                  </p>
                  <p className="mt-1 text-lg font-extrabold text-amber-300">
                    {formatCurrency(order.pendingValue)}
                  </p>
                </div>
              </div>
              {order.paymentMethod && (
                <p className="mt-3 text-xs text-slate-500">
                  Forma de pagamento:{" "}
                  <strong className="text-slate-700">
                    {paymentMethodLabels[order.paymentMethod] ??
                      order.paymentMethod}
                  </strong>
                </p>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </>
  );
}
