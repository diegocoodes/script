import { AtSign, Cpu, MapPin, Phone } from "lucide-react";
import {
  equipmentTypeLabels,
  paymentMethodLabels,
  priorityConfig,
  statusConfig,
} from "@/lib/constants";
import type { CompanyView, ServiceOrderView } from "@/types/domain";
import { formatCurrency, formatDate } from "@/utils/formatters";

function DocumentField({
  label,
  value,
  wide = false,
}: {
  label: string;
  value: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div className={wide ? "sm:col-span-2" : undefined}>
      <dt className="text-[8px] font-extrabold uppercase tracking-[0.12em] text-slate-400">
        {label}
      </dt>
      <dd className="mt-1 text-[10px] leading-[1.55] text-slate-800">
        {value || "—"}
      </dd>
    </div>
  );
}

function DocumentSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="print-avoid-break border-t border-slate-200 px-6 py-4 sm:px-9">
      <h2 className="mb-3 text-[9px] font-black uppercase tracking-[0.16em] text-blue-700">
        {title}
      </h2>
      {children}
    </section>
  );
}

function SignatureBlock({ label }: { label: string }) {
  return (
    <div className="pt-10 text-center">
      <div className="mx-auto w-full max-w-56 border-t border-slate-500 pt-1.5">
        <p className="text-[8px] font-bold uppercase tracking-wider text-slate-500">
          {label}
        </p>
      </div>
    </div>
  );
}

export function ServiceOrderDocument({
  order,
  company,
  generatedAt,
  copyLabel,
}: {
  order: ServiceOrderView;
  company: CompanyView;
  generatedAt: string;
  copyLabel?: string;
}) {
  const status =
    statusConfig[order.status as keyof typeof statusConfig] ??
    statusConfig.RECEIVED;
  const priority =
    priorityConfig[order.priority as keyof typeof priorityConfig] ??
    priorityConfig.NORMAL;

  return (
    <article className="document-page overflow-hidden text-slate-950">
      <header className="bg-[#020817] px-6 py-6 text-white sm:px-9">
        <div className="flex items-start justify-between gap-5">
          <div className="flex items-center gap-3">
            {company.logoUrl ? (
              // O administrador pode informar um logo remoto ou um data URL.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={company.logoUrl}
                alt={`Logotipo ${company.companyName}`}
                className="size-12 rounded-xl bg-white object-contain p-1"
              />
            ) : (
              <span className="grid size-12 place-items-center rounded-xl bg-blue-600">
                <Cpu aria-hidden="true" className="size-6" />
              </span>
            )}
            <div>
              <p className="text-lg font-black tracking-tight">
                {company.companyName}
              </p>
              <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-blue-300">
                Assistência técnica especializada
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-slate-400">
              Ordem de serviço
            </p>
            <p className="mt-1 text-lg font-black text-white">{order.number}</p>
            {copyLabel && (
              <p className="mt-1 text-[8px] font-bold uppercase tracking-wider text-blue-300">
                {copyLabel}
              </p>
            )}
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-1 border-t border-white/10 pt-3 text-[8px] text-slate-300">
          {company.phone && (
            <span className="flex items-center gap-1.5">
              <Phone aria-hidden="true" className="size-2.5" />
              {company.phone}
            </span>
          )}
          {company.instagram && (
            <span className="flex items-center gap-1.5">
              <AtSign aria-hidden="true" className="size-2.5" />
              {company.instagram}
            </span>
          )}
          {company.address && (
            <span className="flex items-center gap-1.5">
              <MapPin aria-hidden="true" className="size-2.5" />
              {company.address}
              {company.city ? ` · ${company.city}/${company.state}` : ""}
            </span>
          )}
        </div>
      </header>

      <div className="grid grid-cols-2 gap-px bg-slate-200 text-center sm:grid-cols-4">
        {[
          ["Data de entrada", formatDate(order.entryDate)],
          ["Previsão de entrega", formatDate(order.expectedDeliveryDate)],
          ["Status", status.label],
          ["Prioridade", priority.label],
        ].map(([label, value]) => (
          <div key={label} className="bg-slate-50 px-3 py-3">
            <p className="text-[7px] font-bold uppercase tracking-wider text-slate-400">
              {label}
            </p>
            <p className="mt-1 text-[9px] font-extrabold text-slate-800">
              {value}
            </p>
          </div>
        ))}
      </div>

      <DocumentSection title="Cliente">
        <dl className="grid grid-cols-2 gap-x-8 gap-y-3">
          <DocumentField label="Nome completo" value={order.customerName} />
          <DocumentField
            label="CPF ou CNPJ"
            value={order.customerDocument}
          />
          <DocumentField
            label="Telefone / WhatsApp"
            value={order.customerWhatsapp || order.customerPhone}
          />
        </dl>
      </DocumentSection>

      <DocumentSection title="Equipamento recebido">
        <dl className="grid grid-cols-2 gap-x-8 gap-y-3">
          <DocumentField
            label="Tipo"
            value={
              equipmentTypeLabels[order.equipmentType] ?? order.equipmentType
            }
          />
          <DocumentField label="Marca e modelo" value={order.equipmentLabel} />
          <DocumentField
            label="Número de série"
            value={order.equipmentSerialNumber}
          />
          <DocumentField label="Cor" value={order.equipmentColor} />
          <DocumentField
            label="Acessórios entregues"
            value={order.deliveredAccessories}
            wide
          />
          <DocumentField
            label="Estado físico"
            value={order.physicalCondition}
            wide
          />
          <DocumentField
            label="Descrição do equipamento"
            value={order.equipmentDescription}
            wide
          />
        </dl>
      </DocumentSection>

      <DocumentSection title="Problema, diagnóstico e serviço">
        <dl className="grid grid-cols-2 gap-x-8 gap-y-3">
          <DocumentField
            label="Defeito relatado"
            value={order.reportedDefect}
          />
          <DocumentField
            label="Serviço solicitado"
            value={order.requestedService}
          />
          <DocumentField
            label="Diagnóstico técnico"
            value={order.technicalDiagnosis}
          />
          <DocumentField
            label="Serviço realizado"
            value={order.performedService}
          />
          <DocumentField
            label="Peças utilizadas"
            value={order.partsUsed}
            wide
          />
          <DocumentField
            label="Observações"
            value={order.customerNotes}
            wide
          />
        </dl>
      </DocumentSection>

      <DocumentSection title="Valores e pagamento">
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {[
            ["Serviço", formatCurrency(order.serviceValue)],
            ["Peças", formatCurrency(order.partsValue)],
            ["Desconto", formatCurrency(order.discount)],
            ["Acréscimo", formatCurrency(order.surcharge)],
            ["Total", formatCurrency(order.totalValue)],
            ["Pendente", formatCurrency(order.pendingValue)],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg bg-slate-50 px-2 py-2.5">
              <p className="text-[7px] font-bold uppercase text-slate-400">
                {label}
              </p>
              <p className="mt-1 text-[9px] font-extrabold text-slate-800">
                {value}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[8px] text-slate-500">
          Forma de pagamento:{" "}
          <strong className="text-slate-700">
            {order.paymentMethod
              ? paymentMethodLabels[order.paymentMethod] ?? order.paymentMethod
              : "Não informada"}
          </strong>
        </p>
      </DocumentSection>

      <section className="print-avoid-break border-t border-slate-200 px-6 py-4 sm:px-9">
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[8px] leading-[1.55] text-amber-950">
          Declaro que as informações e os acessórios descritos acima estão
          corretos. A empresa não se responsabiliza por acessórios que não
          estejam expressamente relacionados neste documento.
        </p>
        <div className="grid grid-cols-2 gap-10">
          <SignatureBlock label="Assinatura do cliente" />
          <SignatureBlock label="Assinatura do atendente" />
        </div>
      </section>

      <footer className="flex items-center justify-between border-t border-slate-200 px-6 py-3 text-[7px] text-slate-400 sm:px-9">
        <span>
          Documento gerado em {formatDate(generatedAt, true)}
        </span>
        <span>
          {company.document ? `${company.document} · ` : ""}
          {company.email}
        </span>
      </footer>
    </article>
  );
}
