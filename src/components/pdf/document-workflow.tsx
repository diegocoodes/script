"use client";

import { useState } from "react";
import { ArrowRight, Download, LoaderCircle, ReceiptText, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { paymentMethodLabels } from "@/lib/constants";
import {
  downloadReceiptPdf,
  downloadWarrantyPdf,
} from "@/services/pdf/customer-document-pdf";
import type { CompanyView, ServiceOrderView } from "@/types/domain";

async function logDocument(
  orderId: string,
  type: "WARRANTY_TERM" | "PAYMENT_RECEIPT",
  fileName: string,
) {
  await fetch("/api/documents", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ serviceOrderId: orderId, type, fileName }),
  });
}

export function WarrantyWorkspace({
  order,
  company,
}: {
  order: ServiceOrderView;
  company: CompanyView;
}) {
  const router = useRouter();
  const [servicePerformed, setServicePerformed] = useState(
    order.performedService || order.requestedService,
  );
  const [warrantyDays, setWarrantyDays] = useState(90);
  const [loading, setLoading] = useState(false);

  async function generate() {
    if (!servicePerformed.trim() || warrantyDays < 1) {
      toast.error("Informe o serviço executado e o prazo da garantia.");
      return;
    }
    setLoading(true);
    try {
      const fileName = await downloadWarrantyPdf(order, company, {
        servicePerformed,
        warrantyDays,
      });
      await logDocument(order.id, "WARRANTY_TERM", fileName);
      toast.success("Termo de garantia gerado.");
      router.push(`/ordens-servico/${order.id}/recibo`);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Não foi possível gerar o termo de garantia.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="mx-auto max-w-3xl border-slate-200/80 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="size-5 text-violet-600" aria-hidden="true" />
          Dados do termo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <Label>Nome do cliente</Label>
          <Input value={order.customerName} disabled className="mt-2" />
        </div>
        <div>
          <Label>Equipamento</Label>
          <Input value={order.equipmentLabel} disabled className="mt-2" />
        </div>
        <div>
          <Label htmlFor="warranty-service">Serviço executado *</Label>
          <Textarea
            id="warranty-service"
            value={servicePerformed}
            onChange={(event) => setServicePerformed(event.target.value)}
            rows={4}
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="warranty-days">Prazo da garantia em dias *</Label>
          <Input
            id="warranty-days"
            type="number"
            min={1}
            value={warrantyDays}
            onChange={(event) => setWarrantyDays(Number(event.target.value))}
            className="mt-2"
          />
        </div>
        <Button onClick={generate} disabled={loading} className="w-full sm:w-auto">
          {loading ? <LoaderCircle className="size-4 animate-spin" /> : <Download className="size-4" />}
          {loading ? "Gerando…" : "Gerar termo e continuar"}
          {!loading && <ArrowRight className="size-4" />}
        </Button>
      </CardContent>
    </Card>
  );
}

export function ReceiptWorkspace({
  order,
  company,
}: {
  order: ServiceOrderView;
  company: CompanyView;
}) {
  const router = useRouter();
  const [receivedFrom, setReceivedFrom] = useState(order.customerName);
  const [amount, setAmount] = useState(order.paidValue || order.totalValue);
  const [reference, setReference] = useState(
    order.performedService || order.requestedService,
  );
  const [paymentMethod, setPaymentMethod] = useState(
    order.paymentMethod
      ? paymentMethodLabels[order.paymentMethod] ?? order.paymentMethod
      : "",
  );
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(false);

  async function generate() {
    if (!receivedFrom.trim() || !reference.trim() || amount <= 0 || !date) {
      toast.error("Preencha os dados obrigatórios do recibo.");
      return;
    }
    setLoading(true);
    try {
      const fileName = await downloadReceiptPdf(order, company, {
        receivedFrom,
        amount,
        reference,
        paymentMethod: paymentMethod || "Não informada",
        date,
      });
      await logDocument(order.id, "PAYMENT_RECEIPT", fileName);
      toast.success("Recibo gerado. Fluxo finalizado.");
      router.push("/inicio");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Não foi possível gerar o recibo.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="mx-auto max-w-3xl border-slate-200/80 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ReceiptText className="size-5 text-emerald-600" aria-hidden="true" />
          Dados do recibo
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="receipt-from">Recebimento de *</Label>
          <Input id="receipt-from" value={receivedFrom} onChange={(event) => setReceivedFrom(event.target.value)} className="mt-2" />
        </div>
        <div>
          <Label htmlFor="receipt-amount">Quantia de R$ *</Label>
          <Input id="receipt-amount" type="number" min={0.01} step="0.01" value={amount} onChange={(event) => setAmount(Number(event.target.value))} className="mt-2" />
        </div>
        <div>
          <Label htmlFor="receipt-method">Forma de pagamento</Label>
          <Input id="receipt-method" value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)} placeholder="Ex.: PIX" className="mt-2" />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="receipt-reference">Referente a *</Label>
          <Textarea id="receipt-reference" value={reference} onChange={(event) => setReference(event.target.value)} rows={4} className="mt-2" />
        </div>
        <div>
          <Label htmlFor="receipt-date">Data *</Label>
          <Input id="receipt-date" type="date" value={date} onChange={(event) => setDate(event.target.value)} className="mt-2" />
        </div>
        <div className="flex items-end sm:justify-end">
          <Button onClick={generate} disabled={loading} className="w-full sm:w-auto">
            {loading ? <LoaderCircle className="size-4 animate-spin" /> : <Download className="size-4" />}
            {loading ? "Gerando…" : "Gerar recibo"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
