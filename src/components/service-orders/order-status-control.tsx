"use client";

import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SERVICE_ORDER_STATUSES, statusConfig } from "@/lib/constants";

export function OrderStatusControl({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [updating, setUpdating] = useState(false);

  async function updateStatus(nextStatus: string) {
    const previous = status;
    setStatus(nextStatus);
    setUpdating(true);

    try {
      const response = await fetch(`/api/service-orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const result = (await response.json()) as { message?: string };
      if (!response.ok) {
        throw new Error(result.message ?? "Não foi possível alterar o status.");
      }
      toast.success("Status atualizado com sucesso.");
      router.refresh();
    } catch (error) {
      setStatus(previous);
      toast.error(
        error instanceof Error
          ? error.message
          : "Não foi possível alterar o status.",
      );
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div className="relative">
      <label htmlFor="order-status-update" className="sr-only">
        Alterar status da ordem
      </label>
      <select
        id="order-status-update"
        value={status}
        onChange={(event) => updateStatus(event.target.value)}
        disabled={updating}
        className="h-11 min-w-48 rounded-lg border border-input bg-white px-3 pr-9 text-sm font-semibold text-slate-700 shadow-xs"
      >
        {SERVICE_ORDER_STATUSES.map((value) => (
          <option key={value} value={value}>
            {statusConfig[value].label}
          </option>
        ))}
      </select>
      {updating && (
        <LoaderCircle
          aria-hidden="true"
          className="absolute right-8 top-1/2 size-4 -translate-y-1/2 animate-spin text-blue-600"
        />
      )}
    </div>
  );
}
