"use client";

import { useState } from "react";
import { FileCheck2, FileText, LoaderCircle, ReceiptText, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { downloadCustomerDocumentPdf } from "@/services/pdf/customer-document-pdf";
import { downloadServiceOrderPdf } from "@/services/pdf/service-order-pdf";
import type { CompanyView, CustomerView, ServiceOrderView } from "@/types/domain";

export type PreferredDocument = "ordem" | "garantia" | "recibo" | "entrega";

const documents = [
  { key: "ordem", label: "Ordem de serviço", shortLabel: "OS", icon: FileText, type: "SERVICE_ORDER" },
  { key: "garantia", label: "Termo de garantia", shortLabel: "Garantia", icon: ShieldCheck, type: "WARRANTY_TERM" },
  { key: "recibo", label: "Recibo", shortLabel: "Recibo", icon: ReceiptText, type: "PAYMENT_RECEIPT" },
  { key: "entrega", label: "Comprovante de entrega", shortLabel: "Entrega", icon: FileCheck2, type: "DELIVERY_RECEIPT" },
] as const;

export function CustomerDocumentActions({
  customer,
  company,
  preferred,
  mobile = false,
}: {
  customer: CustomerView;
  company: CompanyView;
  preferred?: PreferredDocument;
  mobile?: boolean;
}) {
  const [downloading, setDownloading] = useState<string | null>(null);

  async function download(document: (typeof documents)[number]) {
    if (!customer.latestOrderId) {
      toast.error("Cadastre uma ordem de serviço para este cliente primeiro.");
      return;
    }

    setDownloading(document.key);
    try {
      const response = await fetch(`/api/service-orders/${customer.latestOrderId}`);
      const order = (await response.json()) as ServiceOrderView & { message?: string };
      if (!response.ok || !order.id) {
        throw new Error(order.message ?? "Não foi possível carregar a ordem.");
      }

      const fileName =
        document.type === "SERVICE_ORDER"
          ? await downloadServiceOrderPdf(order, company, "customer")
          : await downloadCustomerDocumentPdf(document.type, order, company);

      toast.success(`${document.label} baixado com sucesso.`);
      void fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceOrderId: order.id,
          type: document.type,
          fileName,
        }),
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível gerar o PDF.");
    } finally {
      setDownloading(null);
    }
  }

  return (
    <div className={mobile ? "grid grid-cols-2 gap-2" : "flex justify-end gap-1"}>
      {documents.map((document) => {
        const Icon = document.icon;
        const active = preferred === document.key;
        const loading = downloading === document.key;
        return (
          <Button
            key={document.key}
            type="button"
            variant={active ? "secondary" : "outline"}
            size={mobile ? "default" : "icon-sm"}
            className={active ? "border-blue-200 bg-blue-50 text-blue-700" : undefined}
            aria-label={`Baixar ${document.label} de ${customer.name}`}
            title={
              customer.latestOrderId
                ? `${document.label} · ${customer.latestOrderNumber}`
                : "Crie uma ordem de serviço primeiro"
            }
            disabled={!customer.latestOrderId || downloading !== null}
            onClick={() => download(document)}
          >
            {loading ? (
              <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
            ) : (
              <Icon aria-hidden="true" className="size-4" />
            )}
            {mobile && document.shortLabel}
          </Button>
        );
      })}
    </div>
  );
}
