"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, FileClock, Search } from "lucide-react";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { StatusBadge } from "@/components/service-orders/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  priorityConfig,
  SERVICE_ORDER_STATUSES,
  statusConfig,
} from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { ServiceOrderView } from "@/types/domain";
import { formatCurrency, formatDate } from "@/utils/formatters";

export function ServiceOrderDirectory({
  orders,
  initialSearch = "",
}: {
  orders: ServiceOrderView[];
  initialSearch?: string;
}) {
  const [search, setSearch] = useState(initialSearch);
  const [status, setStatus] = useState("ALL");
  const debouncedSearch = useDebouncedValue(search);
  const filtered = useMemo(() => {
    const query = debouncedSearch.trim().toLocaleLowerCase("pt-BR");
    return orders.filter((order) => {
      const matchesSearch =
        !query ||
        [
          order.number,
          order.customerName,
          order.customerDocument,
          order.equipmentLabel,
          order.equipmentSerialNumber,
        ]
          .filter(Boolean)
          .some((value) => value?.toLocaleLowerCase("pt-BR").includes(query));
      const matchesStatus = status === "ALL" || order.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [debouncedSearch, orders, status]);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_8px_30px_rgb(15_23_42/0.04)]">
      <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="relative w-full max-w-md">
          <label htmlFor="order-search" className="sr-only">
            Buscar ordem de serviço
          </label>
          <Search
            aria-hidden="true"
            className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
          />
          <Input
            id="order-search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar OS, cliente ou equipamento…"
            className="h-11 bg-slate-50 pl-9"
          />
        </div>
        <div>
          <label htmlFor="order-status-filter" className="sr-only">
            Filtrar por status
          </label>
          <select
            id="order-status-filter"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="h-11 w-full rounded-lg border border-input bg-white px-3 text-sm shadow-xs sm:w-52"
          >
            <option value="ALL">Todos os status</option>
            {SERVICE_ORDER_STATUSES.map((value) => (
              <option key={value} value={value}>
                {statusConfig[value].label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <p className="border-b border-slate-100 px-5 py-2 text-xs text-slate-400" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "ordem encontrada" : "ordens encontradas"}
      </p>

      {filtered.length === 0 ? (
        <div className="grid min-h-72 place-items-center px-6 text-center">
          <div>
            <FileClock
              aria-hidden="true"
              className="mx-auto size-9 text-slate-300"
            />
            <h2 className="mt-3 text-sm font-bold text-slate-700">
              Nenhuma ordem encontrada
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Ajuste a busca ou os filtros para continuar.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="hidden overflow-x-auto lg:block">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/70">
                  <TableHead>Ordem</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Equipamento</TableHead>
                  <TableHead>Entrada / previsão</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Prioridade</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="w-12">
                    <span className="sr-only">Abrir</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((order) => {
                  const priority =
                    priorityConfig[
                      order.priority as keyof typeof priorityConfig
                    ] ?? priorityConfig.NORMAL;

                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-bold text-blue-700">
                        {order.number}
                      </TableCell>
                      <TableCell>
                        <span className="block font-semibold text-slate-800">
                          {order.customerName}
                        </span>
                        <span className="block text-xs text-slate-400">
                          {order.customerDocument || "Sem documento"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="block text-sm text-slate-700">
                          {order.equipmentLabel}
                        </span>
                        <span className="block font-mono text-[11px] text-slate-400">
                          {order.equipmentSerialNumber || "Sem serial"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="block text-sm text-slate-600">
                          {formatDate(order.entryDate)}
                        </span>
                        <span className="block text-[11px] text-slate-400">
                          Prev. {formatDate(order.expectedDeliveryDate)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={order.status} />
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "text-xs font-bold",
                            priority.className,
                          )}
                        >
                          {priority.label}
                        </span>
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
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <div className="divide-y divide-slate-100 lg:hidden">
            {filtered.map((order) => (
              <Link
                key={order.id}
                href={`/ordens-servico/${order.id}`}
                className="block p-4 transition-colors hover:bg-slate-50"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-extrabold text-blue-700">
                      {order.number}
                    </p>
                    <p className="mt-1 truncate text-sm font-semibold text-slate-800">
                      {order.customerName}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-slate-400">
                      {order.equipmentLabel}
                    </p>
                  </div>
                  <StatusBadge status={order.status} compact />
                </div>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-slate-400">
                    {formatDate(order.entryDate)}
                  </span>
                  <span className="font-bold text-slate-700">
                    {formatCurrency(order.totalValue)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
