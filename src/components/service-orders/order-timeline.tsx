import { Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/formatters";
import type { ServiceOrderView } from "@/types/domain";

const flow = [
  { status: "RECEIVED", label: "Equipamento recebido" },
  { status: "IN_ANALYSIS", label: "Análise técnica" },
  { status: "IN_MAINTENANCE", label: "Manutenção" },
  { status: "COMPLETED", label: "Serviço concluído" },
  { status: "READY_FOR_PICKUP", label: "Pronto para retirada" },
  { status: "DELIVERED", label: "Equipamento entregue" },
] as const;

export function OrderTimeline({ order }: { order: ServiceOrderView }) {
  const normalizedStatus =
    order.status === "AWAITING_APPROVAL" || order.status === "AWAITING_PART"
      ? "IN_ANALYSIS"
      : order.status;
  const currentIndex = flow.findIndex(
    (item) => item.status === normalizedStatus,
  );

  return (
    <ol className="space-y-0" aria-label="Linha do tempo do atendimento">
      {flow.map((item, index) => {
        const completed = index <= currentIndex && order.status !== "CANCELED";
        const current = index === currentIndex;
        const date =
          index === 0
            ? order.entryDate
            : item.status === "COMPLETED"
              ? order.completedAt
              : item.status === "DELIVERED"
                ? order.pickedUpAt
                : null;

        return (
          <li key={item.status} className="relative flex gap-3 pb-5 last:pb-0">
            {index < flow.length - 1 && (
              <span
                aria-hidden="true"
                className={cn(
                  "absolute left-[15px] top-8 h-[calc(100%-1rem)] w-px",
                  completed && index < currentIndex
                    ? "bg-blue-500"
                    : "bg-slate-200",
                )}
              />
            )}
            <span
              aria-hidden="true"
              className={cn(
                "relative z-10 grid size-8 shrink-0 place-items-center rounded-full border-2 bg-white",
                completed
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-slate-200 text-slate-300",
              )}
            >
              {completed ? (
                <Check className="size-3.5" />
              ) : (
                <Circle className="size-3" />
              )}
            </span>
            <div className="pt-1">
              <p
                className={cn(
                  "text-sm font-semibold",
                  completed ? "text-slate-800" : "text-slate-400",
                )}
              >
                {item.label}
                {current && (
                  <span className="ml-2 text-[10px] font-bold uppercase tracking-wider text-blue-600">
                    Atual
                  </span>
                )}
              </p>
              {date && (
                <p className="mt-0.5 text-xs text-slate-400">
                  {formatDate(date, true)}
                </p>
              )}
            </div>
          </li>
        );
      })}
      {order.status === "CANCELED" && (
        <li className="rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
          Ordem cancelada
        </li>
      )}
    </ol>
  );
}
