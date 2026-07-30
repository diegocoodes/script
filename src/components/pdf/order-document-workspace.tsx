"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  FileCheck2,
  LoaderCircle,
  Printer,
} from "lucide-react";
import { toast } from "sonner";
import { ServiceOrderDocument } from "@/components/documents/service-order-document";
import { Button } from "@/components/ui/button";
import {
  downloadServiceOrderPdf,
  type PrintMode,
} from "@/services/pdf/service-order-pdf";
import type { CompanyView, ServiceOrderView } from "@/types/domain";

const modeLabels: Record<PrintMode, string> = {
  complete: "Documento completo",
  "two-copies": "Duas vias",
  customer: "Somente via do cliente",
  company: "Somente via da assistência",
};

export function OrderDocumentWorkspace({
  order,
  company,
  generatedAt,
}: {
  order: ServiceOrderView;
  company: CompanyView;
  generatedAt: string;
}) {
  const [mode, setMode] = useState<PrintMode>("complete");
  const [downloading, setDownloading] = useState(false);
  const copies =
    mode === "two-copies"
      ? ["Via do cliente", "Via da assistência"]
      : [
          mode === "customer"
            ? "Via do cliente"
            : mode === "company"
              ? "Via da assistência"
              : undefined,
        ];

  async function download() {
    setDownloading(true);
    try {
      const fileName = await downloadServiceOrderPdf(order, company, mode);
      toast.success("PDF gerado e baixado com sucesso.");
      void fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceOrderId: order.id,
          type: "SERVICE_ORDER",
          fileName,
        }),
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Não foi possível gerar o PDF.",
      );
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div>
      <div className="no-print mb-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
            <FileCheck2 aria-hidden="true" className="size-5" />
          </span>
          <div>
            <p className="text-sm font-bold text-slate-800">
              Documento pronto para conferência
            </p>
            <p className="text-xs text-slate-400">
              Revise os dados antes de imprimir ou baixar.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <label htmlFor="print-mode" className="sr-only">
            Formato da impressão
          </label>
          <select
            id="print-mode"
            value={mode}
            onChange={(event) => setMode(event.target.value as PrintMode)}
            className="h-10 rounded-lg border border-input bg-white px-3 text-sm font-medium shadow-xs"
          >
            {Object.entries(modeLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <Button
            variant="outline"
            className="min-h-10"
            onClick={() => window.print()}
          >
            <Printer aria-hidden="true" className="size-4" />
            Imprimir
          </Button>
          <Button
            className="min-h-10"
            onClick={download}
            disabled={downloading}
          >
            {downloading ? (
              <LoaderCircle
                aria-hidden="true"
                className="size-4 animate-spin"
              />
            ) : (
              <Download aria-hidden="true" className="size-4" />
            )}
            {downloading ? "Gerando PDF…" : "Baixar PDF"}
          </Button>
        </div>
      </div>

      <div className="no-print mb-5">
        <Button
          variant="ghost"
          render={<Link href={`/ordens-servico/${order.id}`} />}
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Voltar para a ordem
        </Button>
      </div>

      <div className="space-y-8 bg-slate-200/50 p-0 sm:rounded-2xl sm:p-5 lg:p-8">
        {copies.map((copyLabel, index) => (
          <div
            key={`${copyLabel ?? "complete"}-${index}`}
            className={index < copies.length - 1 ? "break-after-page" : undefined}
          >
            <ServiceOrderDocument
              order={order}
              company={company}
              generatedAt={generatedAt}
              copyLabel={copyLabel}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
