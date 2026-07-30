import { CircleHelp } from "lucide-react";
import { BrandMark } from "@/components/layout/brand-mark";
import { Navigation } from "@/components/layout/navigation";

export function Sidebar() {
  return (
    <aside className="app-sidebar sticky top-0 hidden h-screen flex-col border-r border-white/5 bg-[#020817] px-4 py-5 md:flex">
      <BrandMark className="px-2 pb-7" />
      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        <Navigation />
      </div>
      <div className="mt-4 rounded-xl border border-white/[0.07] bg-white/[0.035] p-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <CircleHelp aria-hidden="true" className="size-4 text-blue-400" />
          Central de ajuda
        </div>
        <p className="mt-1.5 text-[11px] leading-4 text-slate-500">
          Consulte o README para configurar o banco e o primeiro acesso.
        </p>
      </div>
    </aside>
  );
}
