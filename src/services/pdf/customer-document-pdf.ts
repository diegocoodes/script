import { equipmentTypeLabels, paymentMethodLabels } from "@/lib/constants";
import type { CompanyView, ServiceOrderView } from "@/types/domain";
import { formatCurrency, formatDate } from "@/utils/formatters";

export type CustomerDocumentType =
  | "WARRANTY_TERM"
  | "PAYMENT_RECEIPT"
  | "DELIVERY_RECEIPT";

const documentConfig = {
  WARRANTY_TERM: {
    title: "TERMO DE GARANTIA",
    filePrefix: "termo-garantia",
  },
  PAYMENT_RECEIPT: {
    title: "RECIBO DE PAGAMENTO",
    filePrefix: "recibo",
  },
  DELIVERY_RECEIPT: {
    title: "COMPROVANTE DE ENTREGA",
    filePrefix: "comprovante-entrega",
  },
} as const;

export async function downloadCustomerDocumentPdf(
  type: CustomerDocumentType,
  order: ServiceOrderView,
  company: CompanyView,
) {
  const { jsPDF } = await import("jspdf");
  const document = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const config = documentConfig[type];
  const pageWidth = document.internal.pageSize.getWidth();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  let y = 0;

  document.setFillColor(2, 8, 23);
  document.rect(0, 0, pageWidth, 42, "F");
  document.setFillColor(0, 102, 255);
  document.roundedRect(margin, 10, 18, 18, 3, 3, "F");
  document.setTextColor(255, 255, 255);
  document.setFont("helvetica", "bold");
  document.setFontSize(13);
  document.text("DI", margin + 9, 21.5, { align: "center" });
  document.setFontSize(16);
  document.text(company.companyName, margin + 23, 17);
  document.setFont("helvetica", "normal");
  document.setFontSize(7);
  document.setTextColor(185, 205, 232);
  document.text(
    [company.phone, company.email, company.address].filter(Boolean).join("  ·  "),
    margin + 23,
    23,
  );
  document.setTextColor(255, 255, 255);
  document.setFont("helvetica", "bold");
  document.setFontSize(9);
  document.text(config.title, pageWidth - margin, 17, { align: "right" });
  document.setTextColor(90, 180, 255);
  document.setFontSize(8);
  document.text(order.number, pageWidth - margin, 23, { align: "right" });

  y = 54;
  function section(
    title: string,
    fields: Array<[label: string, value: string | null | undefined]>,
  ) {
    document.setTextColor(0, 82, 190);
    document.setFont("helvetica", "bold");
    document.setFontSize(8);
    document.text(title.toUpperCase(), margin, y);
    y += 4;
    document.setDrawColor(215, 225, 238);
    document.line(margin, y, pageWidth - margin, y);
    y += 7;

    for (const [label, value] of fields) {
      document.setTextColor(120, 135, 155);
      document.setFont("helvetica", "bold");
      document.setFontSize(6.5);
      document.text(label.toUpperCase(), margin, y);
      y += 4;
      document.setTextColor(25, 40, 65);
      document.setFont("helvetica", "normal");
      document.setFontSize(9);
      const lines = document.splitTextToSize(value || "—", contentWidth);
      document.text(lines, margin, y);
      y += Math.max(8, lines.length * 4.5 + 4);
    }
    y += 3;
  }

  section("Cliente", [
    ["Nome", order.customerName],
    ["CPF ou CNPJ", order.customerDocument],
    ["Telefone / WhatsApp", order.customerWhatsapp || order.customerPhone],
  ]);
  section("Atendimento", [
    ["Ordem de serviço", order.number],
    [
      "Equipamento",
      `${equipmentTypeLabels[order.equipmentType] ?? order.equipmentType} · ${order.equipmentLabel}`,
    ],
    ["Número de série", order.equipmentSerialNumber],
  ]);

  if (type === "WARRANTY_TERM") {
    const startDate = new Date(order.completedAt ?? order.updatedAt);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 90);
    section("Condições da garantia", [
      ["Serviço coberto", order.performedService || order.requestedService],
      ["Peças substituídas", order.partsUsed],
      ["Início da garantia", formatDate(startDate)],
      ["Validade", `${formatDate(endDate)} (90 dias)`],
      [
        "Termos",
        "A garantia cobre exclusivamente o serviço descrito neste documento. Não cobre mau uso, quedas, líquidos, violação por terceiros, danos elétricos ou perda de dados.",
      ],
    ]);
  } else if (type === "PAYMENT_RECEIPT") {
    section("Declaração de pagamento", [
      ["Valor recebido", formatCurrency(order.paidValue || order.totalValue)],
      [
        "Forma de pagamento",
        order.paymentMethod
          ? paymentMethodLabels[order.paymentMethod] ?? order.paymentMethod
          : "Não informada",
      ],
      [
        "Referente a",
        order.performedService || order.requestedService || `Serviços da ${order.number}`,
      ],
      [
        "Declaração",
        `Recebemos de ${order.customerName} o valor indicado acima, referente aos serviços vinculados à ordem ${order.number}.`,
      ],
    ]);
  } else {
    section("Confirmação de entrega", [
      ["Data da entrega", formatDate(order.pickedUpAt ?? new Date(), true)],
      ["Equipamento entregue", order.equipmentLabel],
      ["Acessórios", order.deliveredAccessories],
      ["Condição registrada", order.physicalCondition],
      [
        "Declaração",
        `Declaro que recebi o equipamento acima vinculado à ordem ${order.number}, juntamente com os acessórios descritos, após conferência das condições de entrega.`,
      ],
    ]);
  }

  y = Math.min(Math.max(y + 18, 225), 250);
  const signatureWidth = 70;
  const signatureY = y;
  document.setDrawColor(100, 115, 135);
  document.line(margin, signatureY, margin + signatureWidth, signatureY);
  document.line(
    pageWidth - margin - signatureWidth,
    signatureY,
    pageWidth - margin,
    signatureY,
  );
  document.setTextColor(100, 115, 135);
  document.setFont("helvetica", "bold");
  document.setFontSize(6.5);
  document.text("ASSINATURA DO CLIENTE", margin + signatureWidth / 2, signatureY + 5, {
    align: "center",
  });
  document.text(
    "RESPONSÁVEL PELA ASSISTÊNCIA",
    pageWidth - margin - signatureWidth / 2,
    signatureY + 5,
    { align: "center" },
  );

  document.setTextColor(135, 145, 160);
  document.setFont("helvetica", "normal");
  document.setFontSize(6.5);
  document.text(
    `Gerado em ${formatDate(new Date(), true)} · ${company.document ?? company.email ?? ""}`,
    margin,
    288,
  );

  const fileName = `${config.filePrefix}-${order.number}.pdf`;
  document.save(fileName);
  return fileName;
}
