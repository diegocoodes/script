import Link from "next/link";
import { ArrowRight, Inbox } from "lucide-react";
import { StatusBadge } from "@/components/service-orders/status-badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/utils/formatters";
import type { ServiceOrderView } from "@/types/domain";

export function RecentOrders({ orders }: { orders: ServiceOrderView[] }) {
  if (orders.length === 0) {
    return (
      <div className="grid min-h-64 place-items-center px-6 text-center">
        <div>
          <Inbox className="mx-auto size-8 text-slate-300" aria-hidden="true" />
          <p className="mt-3 text-sm font-semibold text-slate-700">
            Nenhuma ordem neste período
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Ajuste o filtro ou crie uma nova ordem de serviço.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="hidden lg:block">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/70">
              <TableHead>Ordem</TableHead>
              <TableHead>Cliente e equipamento</TableHead>
              <TableHead>Entrada</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead className="w-12">
                <span className="sr-only">Abrir</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-bold text-blue-700">
                  {order.number}
                </TableCell>
                <TableCell>
                  <span className="block font-semibold text-slate-800">
                    {order.customerName}
                  </span>
                  <span className="block text-xs text-slate-400">
                    {order.equipmentLabel}
                  </span>
                </TableCell>
                <TableCell className="text-slate-500">
                  {formatDate(order.entryDate)}
                </TableCell>
                <TableCell>
                  <StatusBadge status={order.status} />
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {formatCurrency(order.totalValue)}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Abrir ${order.number}`}
                    render={<Link href={`/ordens-servico/${order.id}`} />}
                  >
                    <ArrowRight aria-hidden="true" className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="divide-y divide-slate-100 lg:hidden">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/ordens-servico/${order.id}`}
            className="block p-4 transition-colors hover:bg-slate-50"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-blue-700">{order.number}</p>
                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {order.customerName}
                </p>
                <p className="mt-0.5 text-xs text-slate-400">
                  {order.equipmentLabel}
                </p>
              </div>
              <StatusBadge status={order.status} compact />
            </div>
            <div className="mt-3 flex justify-between text-xs">
              <span className="text-slate-400">{formatDate(order.entryDate)}</span>
              <span className="font-semibold text-slate-700">
                {formatCurrency(order.totalValue)}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
