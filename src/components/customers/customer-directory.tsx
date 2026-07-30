"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ExternalLink, MessageCircle, Search, UsersRound } from "lucide-react";
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
import type { CustomerView } from "@/types/domain";
import { formatWhatsappUrl } from "@/utils/formatters";

export function CustomerDirectory({
  customers,
}: {
  customers: CustomerView[];
}) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search);
  const filteredCustomers = useMemo(() => {
    const query = debouncedSearch.trim().toLocaleLowerCase("pt-BR");
    if (!query) return customers;
    return customers.filter((customer) =>
      [customer.name, customer.document, customer.phone, customer.whatsapp]
        .filter(Boolean)
        .some((value) => value?.toLocaleLowerCase("pt-BR").includes(query)),
    );
  }, [customers, debouncedSearch]);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_8px_30px_rgb(15_23_42/0.04)]">
      <div className="border-b border-slate-100 p-4 sm:p-5">
        <div className="relative max-w-md">
          <label htmlFor="customer-search" className="sr-only">
            Buscar por nome, CPF, CNPJ ou telefone
          </label>
          <Search
            aria-hidden="true"
            className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
          />
          <Input
            id="customer-search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por nome, CPF ou telefone…"
            className="h-11 bg-slate-50 pl-9"
          />
        </div>
        <p className="mt-2 text-xs text-slate-400" aria-live="polite">
          {filteredCustomers.length}{" "}
          {filteredCustomers.length === 1
            ? "cliente encontrado"
            : "clientes encontrados"}
        </p>
      </div>

      {filteredCustomers.length === 0 ? (
        <div className="grid min-h-72 place-items-center px-6 text-center">
          <div>
            <UsersRound
              aria-hidden="true"
              className="mx-auto size-9 text-slate-300"
            />
            <h2 className="mt-3 text-sm font-bold text-slate-700">
              Nenhum cliente encontrado
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Tente outro termo ou cadastre um novo cliente.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="hidden overflow-x-auto md:block">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/70">
                  <TableHead>Cliente</TableHead>
                  <TableHead>Documento</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead className="text-center">Equipamentos</TableHead>
                  <TableHead className="text-center">Ordens</TableHead>
                  <TableHead className="w-28 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <span className="block font-semibold text-slate-800">
                        {customer.name}
                      </span>
                      <span className="block text-xs text-slate-400">
                        {[customer.city, customer.state]
                          .filter(Boolean)
                          .join(" · ") || "Local não informado"}
                      </span>
                    </TableCell>
                    <TableCell className="text-slate-500">
                      {customer.document || "—"}
                    </TableCell>
                    <TableCell>
                      <span className="block text-sm text-slate-700">
                        {customer.whatsapp || customer.phone || "—"}
                      </span>
                      <span className="block text-xs text-slate-400">
                        {customer.email || "E-mail não informado"}
                      </span>
                    </TableCell>
                    <TableCell className="text-center tabular-nums">
                      {customer.equipmentCount}
                    </TableCell>
                    <TableCell className="text-center tabular-nums">
                      {customer.orderCount}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        {customer.whatsapp && (
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Conversar com ${customer.name} no WhatsApp`}
                            render={
                              <a
                                href={formatWhatsappUrl(
                                  customer.whatsapp,
                                  `Olá, ${customer.name}! Aqui é da Deyvid Infotech.`,
                                )}
                                target="_blank"
                                rel="noreferrer"
                              />
                            }
                          >
                            <MessageCircle
                              aria-hidden="true"
                              className="size-4 text-emerald-600"
                            />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Ver ordens de ${customer.name}`}
                          render={
                            <Link
                              href={`/ordens-servico?q=${encodeURIComponent(
                                customer.name,
                              )}`}
                            />
                          }
                        >
                          <ExternalLink aria-hidden="true" className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="divide-y divide-slate-100 md:hidden">
            {filteredCustomers.map((customer) => (
              <article key={customer.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-bold text-slate-800">
                      {customer.name}
                    </h2>
                    <p className="mt-1 text-xs text-slate-400">
                      {customer.document || "Documento não informado"}
                    </p>
                  </div>
                  {customer.whatsapp && (
                    <Button
                      variant="outline"
                      size="icon-lg"
                      aria-label={`Conversar com ${customer.name} no WhatsApp`}
                      render={
                        <a
                          href={formatWhatsappUrl(
                            customer.whatsapp,
                            `Olá, ${customer.name}! Aqui é da Deyvid Infotech.`,
                          )}
                          target="_blank"
                          rel="noreferrer"
                        />
                      }
                    >
                      <MessageCircle
                        aria-hidden="true"
                        className="size-4 text-emerald-600"
                      />
                    </Button>
                  )}
                </div>
                <p className="mt-3 text-sm text-slate-600">
                  {customer.whatsapp || customer.phone || "Sem telefone"}
                </p>
                <div className="mt-3 flex gap-4 text-xs text-slate-500">
                  <span>{customer.equipmentCount} equipamentos</span>
                  <span>{customer.orderCount} ordens</span>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
