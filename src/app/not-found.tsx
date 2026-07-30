import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#020817] px-6 text-center text-white">
      <div>
        <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-blue-500/15 text-blue-300">
          <FileQuestion aria-hidden="true" className="size-8" />
        </span>
        <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
          Erro 404
        </p>
        <h1 className="mt-2 text-3xl font-extrabold">Página não encontrada</h1>
        <p className="mt-3 text-sm text-slate-400">
          O conteúdo pode ter sido movido ou ainda não existe.
        </p>
        <Button className="mt-7" render={<Link href="/dashboard" />}>
          Voltar ao dashboard
        </Button>
      </div>
    </main>
  );
}
