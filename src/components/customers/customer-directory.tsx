"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ExternalLink,
  LoaderCircle,
  MessageCircle,
  Search,
  Trash2,
  UsersRound,
} from "lucide-react";
import { toast } from "sonner";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import {
  CustomerDocumentActions,
  type PreferredDocument,
} from "@/components/customers/customer-document-actions";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { CompanyView, CustomerView } from "@/types/domain";
import { formatWhatsappUrl } from "@/utils/formatters";

export function CustomerDirectory({
  customers,
  company,
  preferredDocument,
}: {
  customers: CustomerView[];
  company: CompanyView;
  preferredDocument?: PreferredDocument;
}) {
  const [customerItems, setCustomerItems] = useState(customers);
  const [search, setSearch] = useState("");
  const [customerToDelete, setCustomerToDelete] =
    useState<CustomerView | null>(null);
  const [deleting, setDeleting] = useState(false);
  const debouncedSearch = useDebouncedValue(search);
  const filteredCustomers = useMemo(() => {
    const query = debouncedSearch.trim().toLocaleLowerCase("pt-BR");
    if (!query) return customerItems;
    return customerItems.filter((customer) =>
      [customer.name, customer.document, customer.phone, customer.whatsapp]
        .filter(Boolean)
        .some((value) => value?.toLocaleLowerCase("pt-BR").includes(query)),
    );
  }, [customerItems, debouncedSearch]);

  async function deleteCustomer() {
    if (!customerToDelete) return;
    setDeleting(true);
    try {
      const response = await fetch(`/api/customers/${customerToDelete.id}`, {
        method: "DELETE",
      });
      const result = (await response.json()) as { message?: string };
      if (!response.ok) {
        throw new Error(result.message ?? "Não foi possível excluir o cliente.");
      }

      setCustomerItems((items) =>
        items.filter((customer) => customer.id !== customerToDelete.id),
      );
      toast.success("Cliente excluído com sucesso.");
      setCustomerToDelete(null);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Não foi possível excluir o cliente.",
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
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
        {preferredDocument && (
          <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
            Escolha o cliente e use o botão destacado para baixar o PDF solicitado.
          </div>
        )}
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
                  <TableHead className="min-w-40 text-right">Baixar PDFs</TableHead>
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
                      <CustomerDocumentActions
                        customer={customer}
                        company={company}
                        preferred={preferredDocument}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        {customer.whatsapp && (
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            nativeButton={false}
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
                          nativeButton={false}
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
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Excluir ${customer.name}`}
                          onClick={() => setCustomerToDelete(customer)}
                        >
                          <Trash2
                            aria-hidden="true"
                            className="size-4 text-red-600"
                          />
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
                      className="size-11"
                      nativeButton={false}
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
                <div className="mt-4 border-t border-slate-100 pt-4">
                  <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Baixar PDFs
                  </p>
                  <CustomerDocumentActions
                    customer={customer}
                    company={company}
                    preferred={preferredDocument}
                    mobile
                  />
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    className="min-h-11"
                    nativeButton={false}
                    render={
                      <Link
                        href={`/ordens-servico?q=${encodeURIComponent(
                          customer.name,
                        )}`}
                      />
                    }
                  >
                    <ExternalLink aria-hidden="true" className="size-4" />
                    Ver ordens
                  </Button>
                  <Button
                    variant="destructive"
                    className="min-h-11"
                    onClick={() => setCustomerToDelete(customer)}
                  >
                    <Trash2 aria-hidden="true" className="size-4" />
                    Excluir
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
      </div>

      <AlertDialog
        open={Boolean(customerToDelete)}
        onOpenChange={(open) => {
          if (!open && !deleting) setCustomerToDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir cliente?</AlertDialogTitle>
            <AlertDialogDescription>
              {customerToDelete
                ? `O cliente ${customerToDelete.name} e todos os equipamentos, ordens e documentos vinculados serão apagados.`
                : "Os dados vinculados a este cliente serão apagados."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting} className="min-h-11">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={deleting}
              onClick={deleteCustomer}
              className="min-h-11"
            >
              {deleting ? (
                <LoaderCircle
                  aria-hidden="true"
                  className="size-4 animate-spin"
                />
              ) : (
                <Trash2 aria-hidden="true" className="size-4" />
              )}
              {deleting ? "Excluindo…" : "Excluir definitivamente"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
