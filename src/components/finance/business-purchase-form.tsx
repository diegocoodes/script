"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Save, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FieldError } from "@/components/forms/field-error";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { purchaseCategoryLabels } from "@/lib/constants";
import {
  businessPurchaseSchema,
  PURCHASE_CATEGORIES,
  type BusinessPurchaseInput,
} from "@/schemas/business-purchase";

export function BusinessPurchaseForm({ defaultDate }: { defaultDate: string }) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BusinessPurchaseInput>({
    resolver: zodResolver(businessPurchaseSchema),
    defaultValues: {
      description: "",
      category: "EQUIPMENT",
      quantity: 1,
      totalValue: 0,
      supplier: "",
      purchasedAt: defaultDate,
      notes: "",
    },
  });

  async function submit(input: BusinessPurchaseInput) {
    setServerError(null);

    try {
      const response = await fetch("/api/purchases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const result = (await response.json()) as { message?: string };
      if (!response.ok) {
        throw new Error(result.message ?? "Não foi possível registrar a compra.");
      }

      reset({
        description: "",
        category: "EQUIPMENT",
        quantity: 1,
        totalValue: 0,
        supplier: "",
        purchasedAt: defaultDate,
        notes: "",
      });
      toast.success("Compra registrada", {
        description: "O gasto já foi incluído no financeiro.",
      });
      router.refresh();
    } catch (error) {
      setServerError(
        error instanceof Error
          ? error.message
          : "Não foi possível registrar a compra.",
      );
    }
  }

  return (
    <Card className="gap-0 rounded-2xl border-slate-200/80 py-0 shadow-[0_10px_36px_rgb(15_23_42/0.05)]">
      <CardHeader className="border-b border-slate-100 px-4 py-5 sm:px-6">
        <CardTitle className="flex items-center gap-3 text-lg font-extrabold text-slate-900">
          <span className="grid size-10 place-items-center rounded-xl bg-blue-50 text-blue-600">
            <ShoppingCart aria-hidden="true" className="size-5" />
          </span>
          Nova compra
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 py-5 sm:px-6">
        <form onSubmit={handleSubmit(submit)} noValidate className="space-y-5">
          {serverError && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
            >
              {serverError}
            </div>
          )}

          <div>
            <Label htmlFor="purchase-description">O que foi comprado *</Label>
            <Input
              id="purchase-description"
              className="mt-2"
              placeholder="Ex.: SSD NVMe 1 TB"
              aria-invalid={Boolean(errors.description)}
              aria-describedby={
                errors.description ? "purchase-description-error" : undefined
              }
              {...register("description")}
            />
            <FieldError
              id="purchase-description-error"
              message={errors.description?.message}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="purchase-category">Categoria *</Label>
              <select
                id="purchase-category"
                className="mt-2 h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-[15px] text-slate-900 outline-none transition focus-visible:border-blue-500 focus-visible:ring-3 focus-visible:ring-blue-500/15"
                {...register("category")}
              >
                {PURCHASE_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {purchaseCategoryLabels[category]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="purchase-date">Data da compra *</Label>
              <Input
                id="purchase-date"
                type="date"
                className="mt-2"
                aria-invalid={Boolean(errors.purchasedAt)}
                aria-describedby={
                  errors.purchasedAt ? "purchase-date-error" : undefined
                }
                {...register("purchasedAt")}
              />
              <FieldError
                id="purchase-date-error"
                message={errors.purchasedAt?.message}
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="purchase-quantity">Quantidade *</Label>
              <Input
                id="purchase-quantity"
                type="number"
                min="1"
                step="1"
                inputMode="numeric"
                className="mt-2"
                aria-invalid={Boolean(errors.quantity)}
                aria-describedby={
                  errors.quantity ? "purchase-quantity-error" : undefined
                }
                {...register("quantity", { valueAsNumber: true })}
              />
              <FieldError
                id="purchase-quantity-error"
                message={errors.quantity?.message}
              />
            </div>
            <div>
              <Label htmlFor="purchase-total">Valor total gasto *</Label>
              <Input
                id="purchase-total"
                type="number"
                min="0.01"
                step="0.01"
                inputMode="decimal"
                className="mt-2"
                placeholder="0,00"
                aria-invalid={Boolean(errors.totalValue)}
                aria-describedby={
                  errors.totalValue
                    ? "purchase-total-help purchase-total-error"
                    : "purchase-total-help"
                }
                {...register("totalValue", { valueAsNumber: true })}
              />
              <FieldError
                id="purchase-total-error"
                message={errors.totalValue?.message}
              />
              <p id="purchase-total-help" className="mt-1.5 text-xs text-slate-500">
                Informe o valor da compra inteira, não o valor por unidade.
              </p>
            </div>
          </div>

          <div>
            <Label htmlFor="purchase-supplier">Fornecedor</Label>
            <Input
              id="purchase-supplier"
              className="mt-2"
              placeholder="Nome da loja ou fornecedor"
              aria-invalid={Boolean(errors.supplier)}
              aria-describedby={
                errors.supplier ? "purchase-supplier-error" : undefined
              }
              {...register("supplier")}
            />
            <FieldError
              id="purchase-supplier-error"
              message={errors.supplier?.message}
            />
          </div>

          <div>
            <Label htmlFor="purchase-notes">Observações</Label>
            <Textarea
              id="purchase-notes"
              rows={3}
              className="mt-2"
              placeholder="Detalhes opcionais da compra"
              aria-invalid={Boolean(errors.notes)}
              aria-describedby={
                errors.notes ? "purchase-notes-error" : undefined
              }
              {...register("notes")}
            />
            <FieldError
              id="purchase-notes-error"
              message={errors.notes?.message}
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="min-h-11 w-full font-semibold sm:w-auto"
          >
            {isSubmitting ? (
              <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
            ) : (
              <Save aria-hidden="true" className="size-4" />
            )}
            {isSubmitting ? "Salvando…" : "Registrar compra"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
