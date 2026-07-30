import {
  Banknote,
  CheckCircle2,
  CircleDashed,
  Clock3,
  PackageCheck,
  ShieldAlert,
  Wrench,
  XCircle,
} from "lucide-react";

export const SERVICE_ORDER_STATUSES = [
  "RECEIVED",
  "IN_ANALYSIS",
  "AWAITING_APPROVAL",
  "AWAITING_PART",
  "IN_MAINTENANCE",
  "COMPLETED",
  "READY_FOR_PICKUP",
  "DELIVERED",
  "CANCELED",
] as const;

export const SERVICE_ORDER_PRIORITIES = [
  "LOW",
  "NORMAL",
  "HIGH",
  "URGENT",
] as const;

export const EQUIPMENT_TYPES = [
  "NOTEBOOK",
  "COMPUTER",
  "SMARTPHONE",
  "TABLET",
  "PRINTER",
  "MONITOR",
  "CONSOLE",
  "OTHER",
] as const;

export const PAYMENT_METHODS = [
  "CASH",
  "PIX",
  "CREDIT_CARD",
  "DEBIT_CARD",
  "TRANSFER",
  "OTHER",
] as const;

export const statusConfig = {
  RECEIVED: {
    label: "Recebido",
    className: "bg-slate-100 text-slate-700 border-slate-200",
    icon: PackageCheck,
  },
  IN_ANALYSIS: {
    label: "Em análise",
    className: "bg-sky-50 text-sky-700 border-sky-200",
    icon: CircleDashed,
  },
  AWAITING_APPROVAL: {
    label: "Aguardando aprovação",
    className: "bg-amber-50 text-amber-800 border-amber-200",
    icon: Clock3,
  },
  AWAITING_PART: {
    label: "Aguardando peça",
    className: "bg-orange-50 text-orange-800 border-orange-200",
    icon: Clock3,
  },
  IN_MAINTENANCE: {
    label: "Em manutenção",
    className: "bg-blue-50 text-blue-700 border-blue-200",
    icon: Wrench,
  },
  COMPLETED: {
    label: "Serviço concluído",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: CheckCircle2,
  },
  READY_FOR_PICKUP: {
    label: "Pronto para retirada",
    className: "bg-violet-50 text-violet-700 border-violet-200",
    icon: PackageCheck,
  },
  DELIVERED: {
    label: "Entregue",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: CheckCircle2,
  },
  CANCELED: {
    label: "Cancelado",
    className: "bg-red-50 text-red-700 border-red-200",
    icon: XCircle,
  },
} as const;

export const priorityConfig = {
  LOW: { label: "Baixa", className: "text-slate-600" },
  NORMAL: { label: "Normal", className: "text-blue-700" },
  HIGH: { label: "Alta", className: "text-orange-700" },
  URGENT: { label: "Urgente", className: "text-red-700" },
} as const;

export const equipmentTypeLabels: Record<string, string> = {
  NOTEBOOK: "Notebook",
  COMPUTER: "Computador",
  SMARTPHONE: "Smartphone",
  TABLET: "Tablet",
  PRINTER: "Impressora",
  MONITOR: "Monitor",
  CONSOLE: "Console",
  OTHER: "Outro",
};

export const paymentMethodLabels: Record<string, string> = {
  CASH: "Dinheiro",
  PIX: "Pix",
  CREDIT_CARD: "Cartão de crédito",
  DEBIT_CARD: "Cartão de débito",
  TRANSFER: "Transferência",
  OTHER: "Outro",
};

export const dashboardMetricIcons = {
  open: CircleDashed,
  analysis: ShieldAlert,
  maintenance: Wrench,
  ready: PackageCheck,
  completed: CheckCircle2,
  received: Banknote,
};
