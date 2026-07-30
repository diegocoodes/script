import { z } from "zod";
import {
  PAYMENT_METHODS,
  SERVICE_ORDER_PRIORITIES,
  SERVICE_ORDER_STATUSES,
} from "@/lib/constants";

const moneyField = z.number().min(0, "O valor não pode ser negativo.");

export const serviceOrderSchema = z.object({
  customerId: z.string().min(1, "Selecione um cliente."),
  equipmentId: z.string().min(1, "Selecione um equipamento."),
  reportedDefect: z.string().trim().min(8, "Descreva o defeito relatado."),
  technicalDiagnosis: z.string().trim().optional().or(z.literal("")),
  requestedService: z.string().trim().min(4, "Informe o serviço solicitado."),
  performedService: z.string().trim().optional().or(z.literal("")),
  partsUsed: z.string().trim().optional().or(z.literal("")),
  internalNotes: z.string().trim().optional().or(z.literal("")),
  customerNotes: z.string().trim().optional().or(z.literal("")),
  serviceValue: moneyField,
  partsValue: moneyField,
  discount: moneyField,
  surcharge: moneyField,
  paidValue: moneyField,
  paymentMethod: z.enum(PAYMENT_METHODS).optional().or(z.literal("")),
  entryDate: z.string().min(1, "Informe a data de entrada."),
  expectedDeliveryDate: z.string().optional().or(z.literal("")),
  completedAt: z.string().optional().or(z.literal("")),
  pickedUpAt: z.string().optional().or(z.literal("")),
  technicianName: z.string().trim().optional().or(z.literal("")),
  status: z.enum(SERVICE_ORDER_STATUSES),
  priority: z.enum(SERVICE_ORDER_PRIORITIES),
  clientSignature: z.string().optional().or(z.literal("")),
  technicianSignature: z.string().optional().or(z.literal("")),
});

export type ServiceOrderInput = z.infer<typeof serviceOrderSchema>;
