"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  LoaderCircle,
  MonitorSmartphone,
  Save,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FieldError } from "@/components/forms/field-error";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EQUIPMENT_TYPES, equipmentTypeLabels } from "@/lib/constants";
import { equipmentSchema, type EquipmentInput } from "@/schemas/equipment";
import type { CustomerView } from "@/types/domain";

export function EquipmentForm({
  customers,
  defaultCustomerId,
  compact = false,
  onCreated,
  onCancel,
}: {
  customers: CustomerView[];
  defaultCustomerId?: string;
  compact?: boolean;
  onCreated?: (equipment: {
    id: string;
    customerId: string;
    brand: string;
    model: string;
    reportedDefect: string;
    notes: string | null;
  }) => void;
  onCancel?: () => void;
}) {
  const router = useRouter();
  const [showSecret, setShowSecret] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EquipmentInput>({
    resolver: zodResolver(equipmentSchema),
    defaultValues: {
      customerId: defaultCustomerId ?? "",
      type: "NOTEBOOK",
      brand: "",
      model: "",
      serialNumber: "",
      color: "",
      unlockSecret: "",
      deliveredAccessories: "",
      physicalCondition: "",
      reportedDefect: "",
      notes: "",
      photoUrl: "",
    },
  });

  async function submit(input: EquipmentInput) {
    setServerError(null);

    try {
      const response = await fetch("/api/equipment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const result = (await response.json()) as {
        id?: string;
        customerId?: string;
        brand?: string;
        model?: string;
        reportedDefect?: string;
        notes?: string | null;
        message?: string;
      };

      if (
        !response.ok ||
        !result.id ||
        !result.customerId ||
        !result.brand ||
        !result.model
      ) {
        throw new Error(
          result.message ?? "Não foi possível salvar o equipamento.",
        );
      }

      toast.success("Equipamento cadastrado com sucesso.");
      if (onCreated) {
        onCreated({
          id: result.id,
          customerId: result.customerId,
          brand: result.brand,
          model: result.model,
          reportedDefect: result.reportedDefect ?? input.reportedDefect,
          notes: result.notes ?? input.notes ?? null,
        });
      } else {
        router.push("/equipamentos");
        router.refresh();
      }
    } catch (error) {
      setServerError(
        error instanceof Error
          ? error.message
          : "Não foi possível salvar o equipamento.",
      );
    }
  }

  const content = (
    <form onSubmit={handleSubmit(submit)} noValidate className="space-y-6">
      {serverError && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
        >
          {serverError}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="equipment-customer">Cliente responsável *</Label>
          <select
            id="equipment-customer"
            className="mt-2 flex h-10 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-xs disabled:cursor-not-allowed disabled:opacity-50"
            aria-invalid={Boolean(errors.customerId)}
            {...register("customerId")}
          >
            <option value="">Selecione um cliente</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>
          <FieldError
            id="equipment-customer-error"
            message={errors.customerId?.message}
          />
        </div>

        <div>
          <Label htmlFor="equipment-type">Tipo de equipamento *</Label>
          <select
            id="equipment-type"
            className="mt-2 flex h-10 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-xs"
            aria-invalid={Boolean(errors.type)}
            {...register("type")}
          >
            {EQUIPMENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {equipmentTypeLabels[type]}
              </option>
            ))}
          </select>
          <FieldError id="equipment-type-error" message={errors.type?.message} />
        </div>

        <div>
          <Label htmlFor="equipment-color">Cor</Label>
          <Input
            id="equipment-color"
            placeholder="Ex.: Preto"
            className="mt-2"
            {...register("color")}
          />
        </div>

        <div>
          <Label htmlFor="equipment-brand">Marca *</Label>
          <Input
            id="equipment-brand"
            placeholder="Ex.: Dell"
            className="mt-2"
            aria-invalid={Boolean(errors.brand)}
            {...register("brand")}
          />
          <FieldError
            id="equipment-brand-error"
            message={errors.brand?.message}
          />
        </div>

        <div>
          <Label htmlFor="equipment-model">Modelo *</Label>
          <Input
            id="equipment-model"
            placeholder="Ex.: Inspiron 15"
            className="mt-2"
            aria-invalid={Boolean(errors.model)}
            {...register("model")}
          />
          <FieldError
            id="equipment-model-error"
            message={errors.model?.message}
          />
        </div>

        <div>
          <Label htmlFor="equipment-serial">Número de série</Label>
          <Input
            id="equipment-serial"
            placeholder="Etiqueta ou serial do fabricante"
            className="mt-2"
            {...register("serialNumber")}
          />
        </div>

        <div>
          <Label htmlFor="equipment-secret">Senha ou padrão de desbloqueio</Label>
          <div className="relative mt-2">
            <Input
              id="equipment-secret"
              type={showSecret ? "text" : "password"}
              autoComplete="off"
              className="pr-10"
              aria-describedby="equipment-secret-help"
              {...register("unlockSecret")}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="absolute right-1.5 top-1/2 -translate-y-1/2"
              onClick={() => setShowSecret((current) => !current)}
              aria-label={showSecret ? "Ocultar senha" : "Mostrar senha"}
            >
              {showSecret ? (
                <EyeOff aria-hidden="true" className="size-4" />
              ) : (
                <Eye aria-hidden="true" className="size-4" />
              )}
            </Button>
          </div>
          <p
            id="equipment-secret-help"
            className="mt-1.5 flex items-center gap-1.5 text-[11px] text-slate-500"
          >
            <ShieldCheck aria-hidden="true" className="size-3.5 text-emerald-600" />
            O conteúdo será criptografado e não aparece nas listagens.
          </p>
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="equipment-accessories">Acessórios entregues</Label>
          <Input
            id="equipment-accessories"
            placeholder="Ex.: fonte original, cabo USB e capa"
            className="mt-2"
            {...register("deliveredAccessories")}
          />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="equipment-condition">Estado físico do equipamento</Label>
          <Textarea
            id="equipment-condition"
            placeholder="Descreva riscos, trincas, amassados ou sinais de uso"
            className="mt-2"
            rows={3}
            {...register("physicalCondition")}
          />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="equipment-defect">Defeito relatado *</Label>
          <Textarea
            id="equipment-defect"
            placeholder="Registre o relato do cliente com detalhes"
            className="mt-2"
            rows={4}
            aria-invalid={Boolean(errors.reportedDefect)}
            {...register("reportedDefect")}
          />
          <FieldError
            id="equipment-defect-error"
            message={errors.reportedDefect?.message}
          />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="equipment-photo">URL da foto do equipamento</Label>
          <Input
            id="equipment-photo"
            type="url"
            placeholder="https://…"
            className="mt-2"
            aria-invalid={Boolean(errors.photoUrl)}
            {...register("photoUrl")}
          />
          <FieldError
            id="equipment-photo-error"
            message={errors.photoUrl?.message}
          />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="equipment-notes">Descrição do equipamento</Label>
          <Textarea
            id="equipment-notes"
            placeholder="Descreva características e outros detalhes importantes"
            className="mt-2"
            rows={3}
            {...register("notes")}
          />
        </div>
      </div>

      <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
        {compact ? (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        ) : (
          <Button
            type="button"
            variant="outline"
            render={<Link href="/equipamentos" />}
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Voltar
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="min-h-10 px-4"
        >
          {isSubmitting ? (
            <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
          ) : (
            <Save aria-hidden="true" className="size-4" />
          )}
          {isSubmitting ? "Salvando…" : "Salvar equipamento"}
        </Button>
      </div>
    </form>
  );

  if (compact) return content;

  return (
    <Card className="mx-auto max-w-4xl border-slate-200/80 shadow-[0_12px_40px_rgb(15_23_42/0.05)]">
      <CardHeader className="border-b border-slate-100">
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="grid size-9 place-items-center rounded-xl bg-blue-50 text-blue-600">
            <MonitorSmartphone aria-hidden="true" className="size-4" />
          </span>
          Identificação e recebimento
        </CardTitle>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  );
}
