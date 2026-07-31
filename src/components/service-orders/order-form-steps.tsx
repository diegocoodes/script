"use client";

import { Plus } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import { FieldError } from "@/components/forms/field-error";
import { SignaturePad } from "@/components/forms/signature-pad";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  PAYMENT_METHODS,
  paymentMethodLabels,
  priorityConfig,
  SERVICE_ORDER_PRIORITIES,
  SERVICE_ORDER_STATUSES,
  statusConfig,
} from "@/lib/constants";
import type { ServiceOrderInput } from "@/schemas/service-order";
import type { CustomerView } from "@/types/domain";
import { formatCurrency } from "@/utils/formatters";

type Form = UseFormReturn<ServiceOrderInput>;

export function CustomerStep({
  form,
  customers,
  onAdd,
}: {
  form: Form;
  customers: CustomerView[];
  onAdd: () => void;
}) {
  const error = form.formState.errors.customerId?.message;

  return (
    <div className="space-y-5">
      <div>
        <Label htmlFor="order-customer">Cliente *</Label>
        <select
          id="order-customer"
          className="mt-2 flex h-11 w-full rounded-lg border border-input bg-white px-3 text-sm shadow-xs"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "order-customer-error" : undefined}
          {...form.register("customerId", {
            onChange: () => {
              form.setValue("equipmentName", "");
              form.setValue("equipmentDescription", "");
            },
          })}
        >
          <option value="">Selecione o cliente responsável</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
              {customer.document ? ` · ${customer.document}` : ""}
            </option>
          ))}
        </select>
        <FieldError id="order-customer-error" message={error} />
      </div>
      <div className="rounded-xl border border-dashed border-blue-200 bg-blue-50/60 p-4">
        <p className="text-sm font-semibold text-blue-950">
          Cliente novo na assistência?
        </p>
        <p className="mt-1 text-xs leading-5 text-blue-700/70">
          Cadastre os dados sem perder o preenchimento da ordem.
        </p>
        <Button type="button" variant="outline" className="mt-3 bg-white" onClick={onAdd}>
          <Plus aria-hidden="true" className="size-4" />
          Cadastrar novo cliente
        </Button>
      </div>
    </div>
  );
}

export function EquipmentStep({ form }: { form: Form }) {
  const errors = form.formState.errors;

  return (
    <div className="space-y-5">
      <div>
        <Label htmlFor="order-equipment-name">Nome do equipamento *</Label>
        <Input
          id="order-equipment-name"
          className="mt-2"
          placeholder="Ex.: Notebook Dell Inspiron 15"
          autoFocus
          aria-invalid={Boolean(errors.equipmentName)}
          aria-describedby={
            errors.equipmentName ? "order-equipment-name-error" : undefined
          }
          {...form.register("equipmentName")}
        />
        <FieldError
          id="order-equipment-name-error"
          message={errors.equipmentName?.message}
        />
      </div>
      <div>
        <Label htmlFor="order-equipment-description">
          Descrição do equipamento *
        </Label>
        <Textarea
          id="order-equipment-description"
          rows={4}
          className="mt-2"
          placeholder="Descreva cor, marca, modelo, acessórios e detalhes importantes"
          aria-invalid={Boolean(errors.equipmentDescription)}
          aria-describedby={
            errors.equipmentDescription
              ? "order-equipment-description-error"
              : undefined
          }
          {...form.register("equipmentDescription")}
        />
        <FieldError
          id="order-equipment-description-error"
          message={errors.equipmentDescription?.message}
        />
        <p className="mt-1.5 text-xs leading-5 text-slate-500">
          O equipamento será cadastrado automaticamente ao salvar a ordem de
          serviço.
        </p>
      </div>
    </div>
  );
}

export function ProblemStep({ form }: { form: Form }) {
  const errors = form.formState.errors;

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <Label htmlFor="order-defect">Defeito relatado *</Label>
        <Textarea
          id="order-defect"
          rows={3}
          className="mt-2"
          placeholder="Relato apresentado pelo cliente"
          aria-invalid={Boolean(errors.reportedDefect)}
          {...form.register("reportedDefect")}
        />
        <FieldError
          id="order-defect-error"
          message={errors.reportedDefect?.message}
        />
      </div>
      <div className="sm:col-span-2">
        <Label htmlFor="order-requested-service">Serviço solicitado *</Label>
        <Textarea
          id="order-requested-service"
          rows={3}
          className="mt-2"
          placeholder="Diagnóstico, reparo ou procedimento solicitado"
          aria-invalid={Boolean(errors.requestedService)}
          {...form.register("requestedService")}
        />
        <FieldError
          id="order-requested-service-error"
          message={errors.requestedService?.message}
        />
      </div>
      <div>
        <Label htmlFor="order-diagnosis">Diagnóstico técnico</Label>
        <Textarea
          id="order-diagnosis"
          rows={4}
          className="mt-2"
          placeholder="Pode ser preenchido ou atualizado depois"
          {...form.register("technicalDiagnosis")}
        />
      </div>
      <div>
        <Label htmlFor="order-performed-service">Serviço realizado</Label>
        <Textarea
          id="order-performed-service"
          rows={4}
          className="mt-2"
          placeholder="Procedimentos executados"
          {...form.register("performedService")}
        />
      </div>
      <div className="sm:col-span-2">
        <Label htmlFor="order-parts">Peças utilizadas</Label>
        <Input
          id="order-parts"
          className="mt-2"
          placeholder="Peças, quantidades e referências"
          {...form.register("partsUsed")}
        />
      </div>
      <div>
        <Label htmlFor="order-internal-notes">Observações internas</Label>
        <Textarea
          id="order-internal-notes"
          rows={3}
          className="mt-2"
          placeholder="Visível apenas para a equipe"
          {...form.register("internalNotes")}
        />
      </div>
      <div>
        <Label htmlFor="order-customer-notes">Observações para o cliente</Label>
        <Textarea
          id="order-customer-notes"
          rows={3}
          className="mt-2"
          placeholder="Será exibido no documento"
          {...form.register("customerNotes")}
        />
      </div>
    </div>
  );
}

export function ValuesStep({ form }: { form: Form }) {
  const values = form.watch([
    "serviceValue",
    "partsValue",
    "discount",
    "surcharge",
    "paidValue",
  ]);
  const [serviceValue, partsValue, discount, surcharge, paidValue] = values.map(
    (value) => Number(value) || 0,
  );
  const total = Math.max(serviceValue + partsValue - discount + surcharge, 0);
  const pending = Math.max(total - paidValue, 0);

  const moneyInput = {
    type: "number",
    inputMode: "decimal" as const,
    min: 0,
    step: "0.01",
    className: "mt-2",
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="order-service-value">Valor do serviço</Label>
          <Input
            id="order-service-value"
            {...moneyInput}
            {...form.register("serviceValue", { valueAsNumber: true })}
          />
        </div>
        <div>
          <Label htmlFor="order-parts-value">Valor das peças</Label>
          <Input
            id="order-parts-value"
            {...moneyInput}
            {...form.register("partsValue", { valueAsNumber: true })}
          />
        </div>
        <div>
          <Label htmlFor="order-discount">Desconto</Label>
          <Input
            id="order-discount"
            {...moneyInput}
            {...form.register("discount", { valueAsNumber: true })}
          />
        </div>
        <div>
          <Label htmlFor="order-surcharge">Acréscimo</Label>
          <Input
            id="order-surcharge"
            {...moneyInput}
            {...form.register("surcharge", { valueAsNumber: true })}
          />
        </div>
        <div>
          <Label htmlFor="order-paid-value">Valor pago</Label>
          <Input
            id="order-paid-value"
            {...moneyInput}
            {...form.register("paidValue", { valueAsNumber: true })}
          />
        </div>
        <div>
          <Label htmlFor="order-payment-method">Forma de pagamento</Label>
          <select
            id="order-payment-method"
            className="mt-2 flex h-10 w-full rounded-lg border border-input bg-white px-3 text-sm shadow-xs"
            {...form.register("paymentMethod")}
          >
            <option value="">Selecione se houver pagamento</option>
            {PAYMENT_METHODS.map((method) => (
              <option key={method} value={method}>
                {paymentMethodLabels[method]}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid gap-3 rounded-2xl bg-[#07152b] p-5 text-white sm:grid-cols-3">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-slate-400">
            Valor total
          </p>
          <p className="mt-1 text-xl font-extrabold">{formatCurrency(total)}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wider text-slate-400">
            Valor pago
          </p>
          <p className="mt-1 text-xl font-extrabold text-emerald-400">
            {formatCurrency(paidValue)}
          </p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wider text-slate-400">
            Valor pendente
          </p>
          <p className="mt-1 text-xl font-extrabold text-amber-300">
            {formatCurrency(pending)}
          </p>
        </div>
      </div>
    </div>
  );
}

export function ScheduleStep({ form }: { form: Form }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <div>
        <Label htmlFor="order-entry-date">Data de entrada *</Label>
        <Input
          id="order-entry-date"
          type="date"
          className="mt-2"
          {...form.register("entryDate")}
        />
        <FieldError
          id="order-entry-date-error"
          message={form.formState.errors.entryDate?.message}
        />
      </div>
      <div>
        <Label htmlFor="order-expected-date">Previsão de entrega</Label>
        <Input
          id="order-expected-date"
          type="date"
          className="mt-2"
          {...form.register("expectedDeliveryDate")}
        />
      </div>
      <div>
        <Label htmlFor="order-completed-date">Data de conclusão</Label>
        <Input
          id="order-completed-date"
          type="date"
          className="mt-2"
          {...form.register("completedAt")}
        />
      </div>
      <div>
        <Label htmlFor="order-pickup-date">Data de retirada</Label>
        <Input
          id="order-pickup-date"
          type="date"
          className="mt-2"
          {...form.register("pickedUpAt")}
        />
      </div>
      <div>
        <Label htmlFor="order-technician">Técnico responsável</Label>
        <Input
          id="order-technician"
          className="mt-2"
          placeholder="Nome do técnico"
          {...form.register("technicianName")}
        />
      </div>
      <div>
        <Label htmlFor="order-priority">Prioridade</Label>
        <select
          id="order-priority"
          className="mt-2 flex h-10 w-full rounded-lg border border-input bg-white px-3 text-sm shadow-xs"
          {...form.register("priority")}
        >
          {SERVICE_ORDER_PRIORITIES.map((priority) => (
            <option key={priority} value={priority}>
              {priorityConfig[priority].label}
            </option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-2">
        <Label htmlFor="order-status">Status inicial</Label>
        <select
          id="order-status"
          className="mt-2 flex h-10 w-full rounded-lg border border-input bg-white px-3 text-sm shadow-xs"
          {...form.register("status")}
        >
          {SERVICE_ORDER_STATUSES.map((status) => (
            <option key={status} value={status}>
              {statusConfig[status].label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export function SignaturesStep({ form }: { form: Form }) {
  return (
    <div>
      <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-900">
        As assinaturas são opcionais na abertura e podem ser coletadas depois.
        Ao assinar, o cliente confirma os dados e acessórios descritos.
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        <SignaturePad
          id="client-signature"
          label="Assinatura do cliente"
          value={form.watch("clientSignature")}
          onChange={(value) =>
            form.setValue("clientSignature", value, { shouldDirty: true })
          }
        />
        <SignaturePad
          id="technician-signature"
          label="Assinatura do técnico"
          value={form.watch("technicianSignature")}
          onChange={(value) =>
            form.setValue("technicianSignature", value, { shouldDirty: true })
          }
        />
      </div>
    </div>
  );
}
