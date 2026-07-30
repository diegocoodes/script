import Link from "next/link";
import { CalendarRange } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const periods = [
  { value: "today", label: "Hoje" },
  { value: "7days", label: "7 dias" },
  { value: "30days", label: "30 dias" },
] as const;

export function DashboardFilters({
  activePeriod,
  from,
  to,
}: {
  activePeriod: string;
  from?: string;
  to?: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
        {periods.map((period) => (
          <Link
            key={period.value}
            href={`/dashboard?period=${period.value}`}
            className={cn(
              "rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
              activePeriod === period.value
                ? "bg-slate-900 text-white"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-900",
            )}
          >
            {period.label}
          </Link>
        ))}
      </div>
      <form className="flex flex-wrap items-center gap-2" action="/dashboard">
        <input type="hidden" name="period" value="custom" />
        <label className="sr-only" htmlFor="from">
          Data inicial
        </label>
        <Input
          id="from"
          name="from"
          type="date"
          defaultValue={from}
          className="h-9 w-[145px] bg-white"
        />
        <label className="sr-only" htmlFor="to">
          Data final
        </label>
        <Input
          id="to"
          name="to"
          type="date"
          defaultValue={to}
          className="h-9 w-[145px] bg-white"
        />
        <Button
          type="submit"
          variant="outline"
          size="icon-lg"
          aria-label="Aplicar período personalizado"
        >
          <CalendarRange aria-hidden="true" className="size-4" />
        </Button>
      </form>
    </div>
  );
}
