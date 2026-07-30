import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function MetricCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "blue",
}: {
  label: string;
  value: string | number;
  hint: string;
  icon: LucideIcon;
  tone?: "blue" | "sky" | "violet" | "emerald" | "slate" | "red";
}) {
  const tones = {
    blue: "bg-blue-50 text-blue-600",
    sky: "bg-sky-50 text-sky-600",
    violet: "bg-violet-50 text-violet-600",
    emerald: "bg-emerald-50 text-emerald-600",
    slate: "bg-slate-100 text-slate-600",
    red: "bg-red-50 text-red-600",
  };

  return (
    <Card className="gap-0 overflow-hidden border-slate-200/80 py-0 shadow-[0_8px_30px_rgb(15_23_42/0.04)]">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-slate-500">{label}</p>
            <p className="mt-2 text-2xl font-extrabold tracking-tight text-slate-950">
              {value}
            </p>
          </div>
          <span
            aria-hidden="true"
            className={cn("grid size-10 place-items-center rounded-xl", tones[tone])}
          >
            <Icon className="size-5" />
          </span>
        </div>
        <p className="mt-3 text-[11px] text-slate-400">{hint}</p>
      </CardContent>
    </Card>
  );
}
