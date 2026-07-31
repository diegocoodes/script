import { z } from "zod";

export const PURCHASE_CATEGORIES = [
  "EQUIPMENT",
  "PART",
  "SUPPLY",
  "SERVICE",
  "OTHER",
] as const;

export const businessPurchaseSchema = z.object({
  description: z
    .string()
    .trim()
    .min(2, "Informe o que foi comprado.")
    .max(160, "Use no máximo 160 caracteres."),
  category: z.enum(PURCHASE_CATEGORIES),
  quantity: z
    .number({ invalid_type_error: "Informe uma quantidade válida." })
    .int("Informe uma quantidade inteira.")
    .min(1, "A quantidade mínima é 1.")
    .max(9999, "A quantidade máxima é 9.999."),
  totalValue: z
    .number({ invalid_type_error: "Informe um valor válido." })
    .positive("Informe um valor maior que zero.")
    .max(99999999.99, "O valor informado é muito alto."),
  supplier: z.string().trim().max(120).optional().or(z.literal("")),
  purchasedAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Informe uma data válida.")
    .refine((value) => {
      const [year, month, day] = value.split("-").map(Number);
      const date = new Date(Date.UTC(year, month - 1, day));
      return (
        date.getUTCFullYear() === year &&
        date.getUTCMonth() === month - 1 &&
        date.getUTCDate() === day
      );
    }, "Informe uma data válida."),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
});

export type BusinessPurchaseInput = z.infer<typeof businessPurchaseSchema>;
