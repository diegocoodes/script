"use client";

import { useState } from "react";
import { Download, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { downloadDeliveryReceiptPdf } from "@/services/pdf/customer-document-pdf";
import type { CompanyView } from "@/types/domain";
import { maskDocument } from "@/utils/formatters";

const initialData = {
  customerName: "",
  document: "",
  equipment: "",
  brandModel: "",
  serialNumber: "",
  performedService: "",
  deliveryDate: new Date().toISOString().slice(0, 10),
};

export function DeliveryReceiptForm({ company }: { company: CompanyView }) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);

  function update(field: keyof typeof data, value: string) {
    setData((current) => ({ ...current, [field]: value }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (
      !data.customerName.trim() ||
      !data.document.trim() ||
      !data.equipment.trim() ||
      !data.brandModel.trim() ||
      !data.performedService.trim() ||
      !data.deliveryDate
    ) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }

    setLoading(true);
    try {
      await downloadDeliveryReceiptPdf(company, data);
      toast.success("Comprovante de entrega gerado em uma página.");
      setData(initialData);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Não foi possível gerar o comprovante.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="mx-auto max-w-4xl border-slate-200/80 shadow-sm">
      <CardHeader>
        <CardTitle>Dados da entrega</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="delivery-name">Nome *</Label>
            <Input id="delivery-name" value={data.customerName} onChange={(event) => update("customerName", event.target.value)} className="mt-2" autoFocus />
          </div>
          <div>
            <Label htmlFor="delivery-document">RG / CPF *</Label>
            <Input id="delivery-document" value={data.document} onChange={(event) => update("document", maskDocument(event.target.value))} className="mt-2" />
          </div>
          <div>
            <Label htmlFor="delivery-equipment">Equipamento *</Label>
            <Input id="delivery-equipment" value={data.equipment} onChange={(event) => update("equipment", event.target.value)} placeholder="Ex.: Notebook" className="mt-2" />
          </div>
          <div>
            <Label htmlFor="delivery-brand-model">Marca / modelo *</Label>
            <Input id="delivery-brand-model" value={data.brandModel} onChange={(event) => update("brandModel", event.target.value)} className="mt-2" />
          </div>
          <div>
            <Label htmlFor="delivery-serial">Número de série</Label>
            <Input id="delivery-serial" value={data.serialNumber} onChange={(event) => update("serialNumber", event.target.value)} className="mt-2" />
          </div>
          <div>
            <Label htmlFor="delivery-date">Data da entrega *</Label>
            <Input id="delivery-date" type="date" value={data.deliveryDate} onChange={(event) => update("deliveryDate", event.target.value)} className="mt-2" />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="delivery-service">Serviço realizado *</Label>
            <Textarea id="delivery-service" value={data.performedService} onChange={(event) => update("performedService", event.target.value)} rows={4} className="mt-2" />
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 sm:col-span-2">
            As assinaturas do cliente e do responsável técnico serão feitas à mão após a impressão.
          </div>
          <div className="sm:col-span-2 sm:text-right">
            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading ? <LoaderCircle className="size-4 animate-spin" /> : <Download className="size-4" />}
              {loading ? "Gerando PDF…" : "Gerar comprovante de entrega"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
