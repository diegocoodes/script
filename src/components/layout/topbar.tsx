import { Search } from "lucide-react";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { Input } from "@/components/ui/input";

export function Topbar() {
  return (
    <header className="app-topbar sticky top-0 z-30 flex min-h-16 items-center gap-3 border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-lg sm:px-6 lg:px-8">
      <MobileNavigation />
      <form
        action="/ordens-servico"
        className="relative hidden w-full max-w-md sm:block"
        role="search"
      >
        <label htmlFor="global-search" className="sr-only">
          Buscar ordem, cliente ou equipamento
        </label>
        <Search
          aria-hidden="true"
          className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
        />
        <Input
          id="global-search"
          name="q"
          placeholder="Buscar OS, cliente ou equipamento…"
          className="h-10 border-transparent bg-slate-100 pl-9 shadow-none focus-visible:bg-white"
        />
      </form>
      <div className="ml-auto flex items-center gap-3">
        <span className="hidden text-right sm:block">
          <span className="block text-xs font-semibold text-slate-800">
            Administrador
          </span>
          <span className="block text-[10px] text-slate-500">Acesso total</span>
        </span>
        <span
          aria-hidden="true"
          className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-xs font-bold text-white shadow-sm"
        >
          DI
        </span>
      </div>
    </header>
  );
}
