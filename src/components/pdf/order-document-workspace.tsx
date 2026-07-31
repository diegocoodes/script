"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Download, FileCheck2, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ServiceOrderDocument } from "@/components/documents/service-order-document";
import { Button } from "@/components/ui/button";
import { downloadServiceOrderPdf } from "@/services/pdf/service-order-pdf";
import type { CompanyView, ServiceOrderView } from "@/types/domain";

export function OrderDocumentWorkspace({
  order,
  company,
  generatedAt,
}: {
  order: ServiceOrderView;
  company: CompanyView;
  generatedAt: string;
}) {
  const router = useRouter();
  const [downloading, setDownloading] = useState(false);

  async function download() {
    setDownloading(true);
    try {
      const fileName = await downloadServiceOrderPdf(order, company);
      toast.success("PDF gerado e baixado com sucesso.");
      await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceOrderId: order.id,
          type: "SERVICE_ORDER",
          fileName,
        }),
      });
      router.push(`/ordens-servico/${order.id}/garantia`);
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
              O arquivo será gerado em uma única página para impressão.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
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
            {downloading ? "Gerando PDF…" : "Gerar PDF e continuar"}
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

      <div className="bg-slate-200/50 p-0 sm:rounded-2xl sm:p-5 lg:p-8">
        <ServiceOrderDocument
          order={order}
          company={company}
          generatedAt={generatedAt}
        />
      </div>
    </div>
  );
}
