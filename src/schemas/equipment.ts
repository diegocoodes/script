import { z } from "zod";
import { EQUIPMENT_TYPES } from "@/lib/constants";

export const equipmentSchema = z.object({
  customerId: z.string().min(1, "Selecione o cliente responsável."),
  type: z.enum(EQUIPMENT_TYPES, {
    message: "Selecione o tipo do equipamento.",
  }),
  brand: z.string().trim().min(2, "Informe a marca."),
  model: z.string().trim().min(2, "Informe o modelo."),
  serialNumber: z.string().trim().max(100).optional().or(z.literal("")),
  color: z.string().trim().max(60).optional().or(z.literal("")),
  unlockSecret: z.string().max(160).optional().or(z.literal("")),
  deliveredAccessories: z
    .string()
    .trim()
    .max(600)
    .optional()
    .or(z.literal("")),
  physicalCondition: z
    .string()
    .trim()
    .max(1000)
    .optional()
    .or(z.literal("")),
  reportedDefect: z
    .string()
    .trim()
    .min(8, "Descreva o defeito relatado.")
    .max(1600),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
  photoUrl: z
    .string()
    .url("Informe uma URL válida.")
    .optional()
    .or(z.literal("")),
});

export type EquipmentInput = z.infer<typeof equipmentSchema>;
