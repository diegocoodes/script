import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { FileCheck2, ShieldCheck } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";
import { BrandMark } from "@/components/layout/brand-mark";
import { getCurrentSession } from "@/lib/auth";

export const metadata: Metadata = { title: "Entrar" };

export default async function LoginPage() {
  if (await getCurrentSession()) redirect("/inicio");

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-slate-950 px-5 py-10">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(0,102,255,0.28),transparent_34%),radial-gradient(circle_at_20%_85%,rgba(33,162,255,0.12),transparent_32%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:48px_48px]"
      />

      <section className="relative w-full max-w-md">
        <div className="mb-7 flex flex-col items-center text-center text-white">
          <BrandMark className="justify-center" />
          <h1 className="sr-only">Deyvid Infotech</h1>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white p-6 shadow-[0_30px_100px_rgb(0_0_0/0.38)] sm:p-8">
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-blue-700">
              <ShieldCheck aria-hidden="true" className="size-3.5" />
              Área restrita
            </span>
            <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900">
              Entre no sistema
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Informe seu acesso administrativo para continuar.
            </p>
          </div>

          <div className="mt-7">
            <LoginForm />
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 border-t border-slate-100 pt-5 text-xs text-slate-400">
            <FileCheck2 aria-hidden="true" className="size-3.5 text-blue-500" />
            Clientes, equipamentos e documentos em um só lugar
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-600">
          Deyvid Infotech · Sistema administrativo
        </p>
      </section>
    </main>
  );
}
