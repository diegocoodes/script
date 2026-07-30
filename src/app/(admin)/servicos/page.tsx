import type { Metadata } from "next";
import { Clock3, Wrench } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { getServices } from "@/repositories/app-repository";
import { formatCurrency } from "@/utils/formatters";

export const metadata: Metadata = { title: "Tabela de serviços" };
export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <>
      <PageHeader
        eyebrow="Catálogo"
        title="Tabela de serviços"
        description="Valores de referência. O preço final pode variar conforme o modelo e o diagnóstico técnico."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {services.map((service) => (
          <Card
            key={service.id}
            className="border-slate-200/80 shadow-[0_8px_30px_rgb(15_23_42/0.04)]"
          >
            <CardContent>
              <div className="flex items-start justify-between gap-4">
                <span className="grid size-10 place-items-center rounded-xl bg-blue-50 text-blue-600">
                  <Wrench aria-hidden="true" className="size-5" />
                </span>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                  {service.active ? "Ativo" : "Inativo"}
                </span>
              </div>
              <p className="mt-5 text-[10px] font-bold uppercase tracking-wider text-blue-600">
                {service.category}
              </p>
              <h2 className="mt-1 text-base font-extrabold text-slate-900">
                {service.name}
              </h2>
              <p className="mt-2 min-h-10 text-xs leading-5 text-slate-500">
                {service.description}
              </p>
              <div className="mt-5 rounded-xl bg-slate-50 p-3">
                <p className="text-[10px] uppercase tracking-wider text-slate-400">
                  Faixa de valor
                </p>
                <p className="mt-1 text-sm font-extrabold text-slate-800">
                  {formatCurrency(service.minimumValue)} —{" "}
                  {formatCurrency(service.maximumValue)}
                </p>
              </div>
              {service.estimatedTime && (
                <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
                  <Clock3 aria-hidden="true" className="size-3.5" />
                  {service.estimatedTime}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
