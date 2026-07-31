import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ClipboardCheck,
  FilePlus2,
  FileCheck2,
  ShoppingCart,
  UserPlus,
  WalletCards,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Início" };

const actions = [
  {
    title: "Nova ordem de serviço",
    description: "Abra um atendimento e registre valores recebidos do cliente.",
    href: "/ordens-servico/nova",
    icon: FilePlus2,
    tone: "bg-emerald-50 text-emerald-700",
  },
  {
    title: "Cadastre seu cliente",
    description: "Comece por aqui e mantenha todos os atendimentos vinculados.",
    href: "/clientes/novo",
    icon: UserPlus,
    tone: "bg-blue-600 text-white shadow-blue-600/20",
  },
  {
    title: "Registrar uma compra",
    description: "Informe o item comprado e quanto a empresa gastou.",
    href: "/compras",
    icon: ShoppingCart,
    tone: "bg-red-50 text-red-700",
  },
  {
    title: "Ver financeiro",
    description: "Confira ganhos, gastos, saldo e valores ainda a receber.",
    href: "/financeiro",
    icon: WalletCards,
    tone: "bg-violet-50 text-violet-700",
  },
  {
    title: "Comprovante de entrega",
    description: "Preencha os dados da entrega e gere o PDF separado.",
    href: "/comprovantes/novo",
    icon: FileCheck2,
    tone: "bg-amber-50 text-amber-700",
  },
] as const;

export default function StartPage() {
  return (
    <>
      <section className="mb-8 overflow-hidden rounded-3xl bg-slate-950 px-6 py-7 text-white shadow-xl shadow-slate-900/10 sm:px-8 sm:py-9">
        <div>
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-200">
              <ClipboardCheck aria-hidden="true" className="size-3.5" />
              Acesso rápido
            </span>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
              O que você deseja fazer?
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
              Cadastre o cliente uma vez e use o mesmo registro em equipamentos,
              ordens e documentos.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="quick-actions-title">
        <div className="mb-4">
          <div>
            <h2 id="quick-actions-title" className="text-lg font-extrabold text-slate-900">
              Funções principais
            </h2>
            <p className="mt-1 text-sm text-slate-500">Escolha uma opção para continuar.</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.title}
                href={action.href}
                className={cn(
                  "group relative flex min-h-44 touch-manipulation flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgb(15_23_42/0.05)] transition active:scale-[0.99] sm:min-h-52 sm:p-6 sm:hover:-translate-y-0.5 sm:hover:border-blue-200 sm:hover:shadow-[0_16px_40px_rgb(15_23_42/0.10)]",
                )}
              >
                <span
                  className={cn(
                    "grid size-12 place-items-center rounded-2xl shadow-lg shadow-transparent",
                    action.tone,
                  )}
                >
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <div className="mt-auto pt-8">
                  <h3 className="text-lg font-extrabold tracking-tight text-slate-900">
                    {action.title}
                  </h3>
                  <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                    {action.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-blue-600">
                    Acessar
                    <ArrowRight
                      aria-hidden="true"
                      className="size-4 transition-transform group-hover:translate-x-1"
                    />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
