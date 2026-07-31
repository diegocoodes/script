import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CheckCircle2, Cpu, FileText, ShieldCheck, Zap } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";
import { getCurrentSession } from "@/lib/auth";

export const metadata: Metadata = { title: "Entrar" };

export default async function LoginPage() {
  if (await getCurrentSession()) redirect("/inicio");

  return (
    <main className="grid min-h-screen bg-slate-950 lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative hidden overflow-hidden p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,102,255,0.32),transparent_42%),radial-gradient(circle_at_80%_80%,rgba(33,162,255,0.18),transparent_40%)]" />
        <div className="relative flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-2xl bg-blue-600 shadow-xl shadow-blue-950">
            <Cpu aria-hidden="true" className="size-6" />
          </span>
          <div>
            <p className="text-lg font-extrabold tracking-tight">Deyvid Infotech</p>
            <p className="text-xs uppercase tracking-[0.22em] text-blue-300">Assistência técnica</p>
          </div>
        </div>

        <div className="relative max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-200">
            <Zap aria-hidden="true" className="size-3.5" />
            Operação simples e rápida
          </span>
          <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight xl:text-5xl">
            Clientes, equipamentos e documentos em poucos cliques.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-slate-300">
            Registre o atendimento e gere ordem de serviço, garantia, recibo e comprovante de entrega no mesmo fluxo.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {[
              [CheckCircle2, "Cadastro centralizado"],
              [FileText, "PDFs prontos para baixar"],
              [ShieldCheck, "Acesso administrativo"],
              [Zap, "Atalhos para uso diário"],
            ].map(([Icon, label]) => (
              <div key={String(label)} className="flex items-center gap-2 text-sm text-slate-200">
                <Icon aria-hidden="true" className="size-4 text-blue-400" />
                {String(label)}
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-slate-500">Deyvid Infotech · Sistema administrativo</p>
      </section>

      <section className="flex items-center justify-center bg-slate-50 px-5 py-10 sm:px-10">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <span className="grid size-10 place-items-center rounded-xl bg-blue-600 text-white">
              <Cpu aria-hidden="true" className="size-5" />
            </span>
            <p className="font-extrabold text-slate-900">Deyvid Infotech</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_24px_80px_rgb(15_23_42/0.10)] sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">Área restrita</p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">Bem-vindo de volta</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">Entre com o acesso administrativo para continuar.</p>
            <div className="mt-7">
              <LoginForm />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
