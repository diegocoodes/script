import { z } from "zod";

export const customerSchema = z.object({
  name: z.string().trim().min(3, "Informe o nome completo."),
  document: z.string().trim().max(18).optional().or(z.literal("")),
  phone: z.string().trim().max(16).optional().or(z.literal("")),
  whatsapp: z.string().trim().min(10, "Informe um WhatsApp válido.").max(16),
  email: z
    .string()
    .trim()
    .email("Informe um e-mail válido.")
    .optional()
    .or(z.literal("")),
  address: z.string().trim().max(180).optional().or(z.literal("")),
  city: z.string().trim().max(80).optional().or(z.literal("")),
  state: z.string().trim().max(2).optional().or(z.literal("")),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
});

export type CustomerInput = z.infer<typeof customerSchema>;
