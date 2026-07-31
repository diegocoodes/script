"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, LoaderCircle, Save, UserRound } from "lucide-react";
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
import { customerSchema, type CustomerInput } from "@/schemas/customer";
import { maskDocument, maskPhone } from "@/utils/formatters";

export function CustomerForm({
  compact = false,
  onCreated,
  onCancel,
}: {
  compact?: boolean;
  onCreated?: (customer: { id: string; name: string }) => void;
  onCancel?: () => void;
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CustomerInput>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: "",
      document: "",
      phone: "",
      whatsapp: "",
      email: "",
      address: "",
      city: "",
      state: "",
      notes: "",
    },
  });

  async function submit(input: CustomerInput) {
    setServerError(null);

    try {
      const response = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const result = (await response.json()) as {
        id?: string;
        name?: string;
        message?: string;
      };

      if (!response.ok || !result.id || !result.name) {
        throw new Error(result.message ?? "Não foi possível salvar o cliente.");
      }

      toast.success("Cliente cadastrado com sucesso.");
      if (onCreated) {
        onCreated({ id: result.id, name: result.name });
      } else {
        router.push(
          `/ordens-servico/nova?cliente=${encodeURIComponent(result.id)}`,
        );
        router.refresh();
      }
    } catch (error) {
      setServerError(
        error instanceof Error
          ? error.message
          : "Não foi possível salvar o cliente.",
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
          <Label htmlFor="customer-name">Nome completo *</Label>
          <Input
            id="customer-name"
            placeholder="Ex.: Marina Costa"
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "customer-name-error" : undefined}
            {...register("name")}
          />
          <FieldError id="customer-name-error" message={errors.name?.message} />
        </div>

        <div>
          <Label htmlFor="customer-document">CPF ou CNPJ</Label>
          <Input
            id="customer-document"
            inputMode="numeric"
            placeholder="000.000.000-00"
            aria-invalid={Boolean(errors.document)}
            {...register("document", {
              onChange: (event) =>
                setValue("document", maskDocument(event.target.value)),
            })}
          />
          <FieldError
            id="customer-document-error"
            message={errors.document?.message}
          />
        </div>

        <div>
          <Label htmlFor="customer-email">E-mail</Label>
          <Input
            id="customer-email"
            type="email"
            placeholder="cliente@email.com"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            {...register("email")}
          />
          <FieldError id="customer-email-error" message={errors.email?.message} />
        </div>

        <div>
          <Label htmlFor="customer-phone">Telefone</Label>
          <Input
            id="customer-phone"
            inputMode="tel"
            autoComplete="tel"
            placeholder="(11) 3333-0000"
            aria-invalid={Boolean(errors.phone)}
            {...register("phone", {
              onChange: (event) =>
                setValue("phone", maskPhone(event.target.value)),
            })}
          />
          <FieldError id="customer-phone-error" message={errors.phone?.message} />
        </div>

        <div>
          <Label htmlFor="customer-whatsapp">WhatsApp *</Label>
          <Input
            id="customer-whatsapp"
            inputMode="tel"
            autoComplete="tel"
            placeholder="(11) 99999-0000"
            aria-invalid={Boolean(errors.whatsapp)}
            aria-describedby={
              errors.whatsapp ? "customer-whatsapp-error" : undefined
            }
            {...register("whatsapp", {
              onChange: (event) =>
                setValue("whatsapp", maskPhone(event.target.value)),
            })}
          />
          <FieldError
            id="customer-whatsapp-error"
            message={errors.whatsapp?.message}
          />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="customer-address">Endereço</Label>
          <Input
            id="customer-address"
            placeholder="Rua, número e complemento"
            autoComplete="street-address"
            {...register("address")}
          />
        </div>

        <div>
          <Label htmlFor="customer-city">Cidade</Label>
          <Input
            id="customer-city"
            placeholder="São Paulo"
            autoComplete="address-level2"
            {...register("city")}
          />
        </div>

        <div>
          <Label htmlFor="customer-state">Estado</Label>
          <Input
            id="customer-state"
            placeholder="SP"
            maxLength={2}
            autoComplete="address-level1"
            className="uppercase"
            {...register("state", {
              onChange: (event) =>
                setValue("state", event.target.value.toUpperCase()),
            })}
          />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="customer-notes">Observações</Label>
          <Textarea
            id="customer-notes"
            placeholder="Preferências de contato ou informações relevantes"
            rows={4}
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
            render={<Link href="/clientes" />}
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
          {isSubmitting ? "Salvando…" : "Salvar cliente"}
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
            <UserRound aria-hidden="true" className="size-4" />
          </span>
          Dados do cliente
        </CardTitle>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  );
}
