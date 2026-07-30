import { Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

export function BrandMark({
  compact = false,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="relative grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-white shadow-lg shadow-blue-950/40">
        <Cpu aria-hidden="true" className="size-5" />
        <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full border-2 border-[#020817] bg-[#ff2d3d]" />
      </span>
      {!compact && (
        <span>
          <span className="block text-[15px] font-extrabold tracking-tight text-white">
            Deyvid <span className="text-[#21a2ff]">Infotech</span>
          </span>
          <span className="block text-[10px] font-semibold uppercase tracking-[0.19em] text-slate-500">
            Assistência técnica
          </span>
        </span>
      )}
    </div>
  );
}
