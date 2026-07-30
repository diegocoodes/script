import type { LucideIcon } from "lucide-react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function ModulePlaceholder({
  title,
  description,
  icon: Icon,
  features,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  features: string[];
}) {
  return (
    <>
      <PageHeader
        eyebrow="Módulo preparado"
        title={title}
        description={description}
      />
      <Card className="mx-auto max-w-3xl border-slate-200/80 shadow-[0_12px_40px_rgb(15_23_42/0.05)]">
        <CardContent className="p-6 sm:p-8">
          <span className="grid size-12 place-items-center rounded-2xl bg-blue-50 text-blue-600">
            <Icon aria-hidden="true" className="size-6" />
          </span>
          <h2 className="mt-5 text-lg font-extrabold text-slate-900">
            Estrutura pronta para a próxima etapa
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Esta rota já faz parte da navegação e será conectada aos modelos do
            Prisma previstos no briefing.
          </p>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {features.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-2 text-sm text-slate-600"
              >
                <CheckCircle2
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0 text-emerald-600"
                />
                {feature}
              </li>
            ))}
          </ul>
          <Button
            className="mt-7"
            render={<Link href="/ordens-servico" />}
          >
            Acessar ordens de serviço
            <ArrowRight aria-hidden="true" className="size-4" />
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
