"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ExternalLink, MonitorSmartphone, Search } from "lucide-react";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
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
import { equipmentTypeLabels } from "@/lib/constants";
import type { EquipmentView } from "@/types/domain";

export function EquipmentDirectory({
  equipment,
}: {
  equipment: EquipmentView[];
}) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search);
  const filtered = useMemo(() => {
    const query = debouncedSearch.trim().toLocaleLowerCase("pt-BR");
    if (!query) return equipment;
    return equipment.filter((item) =>
      [
        item.customerName,
        item.brand,
        item.model,
        item.serialNumber,
        equipmentTypeLabels[item.type],
      ]
        .filter(Boolean)
        .some((value) => value?.toLocaleLowerCase("pt-BR").includes(query)),
    );
  }, [debouncedSearch, equipment]);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_8px_30px_rgb(15_23_42/0.04)]">
      <div className="border-b border-slate-100 p-4 sm:p-5">
        <div className="relative max-w-md">
          <label htmlFor="equipment-search" className="sr-only">
            Buscar equipamento
          </label>
          <Search
            aria-hidden="true"
            className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
          />
          <Input
            id="equipment-search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por cliente, modelo ou serial…"
            className="h-11 bg-slate-50 pl-9"
          />
        </div>
        <p className="mt-2 text-xs text-slate-400" aria-live="polite">
          {filtered.length}{" "}
          {filtered.length === 1
            ? "equipamento encontrado"
            : "equipamentos encontrados"}
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="grid min-h-72 place-items-center px-6 text-center">
          <div>
            <MonitorSmartphone
              aria-hidden="true"
              className="mx-auto size-9 text-slate-300"
            />
            <h2 className="mt-3 text-sm font-bold text-slate-700">
              Nenhum equipamento encontrado
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Tente outro termo ou faça um novo cadastro.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="hidden overflow-x-auto md:block">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/70">
                  <TableHead>Equipamento</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Número de série</TableHead>
                  <TableHead>Defeito relatado</TableHead>
                  <TableHead className="text-center">Ordens</TableHead>
                  <TableHead className="w-16">
                    <span className="sr-only">Ações</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <span className="block font-semibold text-slate-800">
                        {item.brand} {item.model}
                      </span>
                      <span className="block text-xs text-slate-400">
                        {equipmentTypeLabels[item.type] ?? item.type}
                        {item.color ? ` · ${item.color}` : ""}
                      </span>
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {item.customerName}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-slate-500">
                      {item.serialNumber || "—"}
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-slate-500">
                      {item.reportedDefect}
                    </TableCell>
                    <TableCell className="text-center tabular-nums">
                      {item.orderCount}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Ver ordens de ${item.brand} ${item.model}`}
                        render={
                          <Link
                            href={`/ordens-servico?q=${encodeURIComponent(
                              `${item.brand} ${item.model}`,
                            )}`}
                          />
                        }
                      >
                        <ExternalLink aria-hidden="true" className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="divide-y divide-slate-100 md:hidden">
            {filtered.map((item) => (
              <article key={item.id} className="p-4">
                <div className="flex items-start gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600">
                    <MonitorSmartphone
                      aria-hidden="true"
                      className="size-5"
                    />
                  </span>
                  <div className="min-w-0">
                    <h2 className="truncate text-sm font-bold text-slate-800">
                      {item.brand} {item.model}
                    </h2>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {equipmentTypeLabels[item.type]} · {item.customerName}
                    </p>
                    <p className="mt-3 line-clamp-2 text-xs leading-5 text-slate-600">
                      {item.reportedDefect}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
