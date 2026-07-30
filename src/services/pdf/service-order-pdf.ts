import type { CompanyView, ServiceOrderView } from "@/types/domain";
import { formatCurrency, formatDate } from "@/utils/formatters";
import {
  equipmentTypeLabels,
  paymentMethodLabels,
  priorityConfig,
  statusConfig,
} from "@/lib/constants";

export type PrintMode = "complete" | "two-copies" | "customer" | "company";

export async function downloadServiceOrderPdf(
  order: ServiceOrderView,
  company: CompanyView,
  mode: PrintMode,
) {
  const { jsPDF } = await import("jspdf");
  const document = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });
  const copies =
    mode === "two-copies"
      ? ["Via do cliente", "Via da assistência"]
      : [
          mode === "customer"
            ? "Via do cliente"
            : mode === "company"
              ? "Via da assistência"
              : "",
        ];
  const pageWidth = document.internal.pageSize.getWidth();
  const pageHeight = document.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  const status =
    statusConfig[order.status as keyof typeof statusConfig] ??
    statusConfig.RECEIVED;
  const priority =
    priorityConfig[order.priority as keyof typeof priorityConfig] ??
    priorityConfig.NORMAL;

  function header(copyLabel: string) {
    document.setFillColor(2, 8, 23);
    document.rect(0, 0, pageWidth, 38, "F");
    document.setFillColor(0, 102, 255);
    document.roundedRect(margin, 9, 18, 18, 3, 3, "F");
    document.setTextColor(255, 255, 255);
    document.setFont("helvetica", "bold");
    document.setFontSize(13);
    document.text("DI", margin + 9, 20.5, { align: "center" });

    if (company.logoUrl?.startsWith("data:image")) {
      try {
        document.addImage(company.logoUrl, margin, 9, 18, 18);
      } catch {
        // O monograma permanece como fallback se o data URL não for suportado.
      }
    }

    document.setFontSize(16);
    document.text(company.companyName, margin + 23, 16);
    document.setFont("helvetica", "normal");
    document.setFontSize(7.5);
    document.setTextColor(185, 205, 232);
    document.text("ASSISTÊNCIA TÉCNICA ESPECIALIZADA", margin + 23, 22);

    document.setTextColor(255, 255, 255);
    document.setFont("helvetica", "bold");
    document.setFontSize(8);
    document.text("ORDEM DE SERVIÇO", pageWidth - margin, 13, {
      align: "right",
    });
    document.setFontSize(13);
    document.text(order.number, pageWidth - margin, 20, { align: "right" });
    if (copyLabel) {
      document.setTextColor(70, 170, 255);
      document.setFontSize(7);
      document.text(copyLabel.toUpperCase(), pageWidth - margin, 26, {
        align: "right",
      });
    }
    document.setTextColor(190, 205, 225);
    document.setFont("helvetica", "normal");
    document.setFontSize(6.5);
    document.text(
      [company.phone, company.instagram, company.address]
        .filter(Boolean)
        .join("  ·  "),
      margin,
      33,
    );
  }

  function drawInfoBar() {
    const y = 42;
    const cellWidth = contentWidth / 4;
    const cells = [
      ["ENTRADA", formatDate(order.entryDate)],
      ["PREVISÃO", formatDate(order.expectedDeliveryDate)],
      ["STATUS", status.label],
      ["PRIORIDADE", priority.label],
    ];
    document.setFillColor(246, 248, 252);
    document.roundedRect(margin, y, contentWidth, 15, 2, 2, "F");
    cells.forEach(([label, value], index) => {
      const x = margin + cellWidth * index + cellWidth / 2;
      document.setTextColor(125, 140, 160);
      document.setFont("helvetica", "bold");
      document.setFontSize(5.8);
      document.text(label, x, y + 5, { align: "center" });
      document.setTextColor(25, 40, 65);
      document.setFontSize(7.5);
      document.text(value, x, y + 10.5, { align: "center" });
    });
  }

  let y = 63;

  function ensureSpace(height: number) {
    if (y + height < pageHeight - 15) return;
    document.addPage();
    y = 18;
    document.setTextColor(15, 23, 42);
    document.setFont("helvetica", "bold");
    document.setFontSize(8);
    document.text(`${order.number} · continuação`, margin, 10);
  }

  function addSection(
    title: string,
    fields: Array<[label: string, value: string | null | undefined]>,
  ) {
    const lineHeights = fields.map(([, value]) => {
      const lines = document.splitTextToSize(value || "—", contentWidth - 4);
      return Math.max(lines.length * 3.6 + 5, 9);
    });
    const height = 8 + lineHeights.reduce((total, value) => total + value, 0);
    ensureSpace(height);
    document.setDrawColor(220, 227, 237);
    document.line(margin, y, pageWidth - margin, y);
    y += 5;
    document.setTextColor(0, 82, 190);
    document.setFont("helvetica", "bold");
    document.setFontSize(7.5);
    document.text(title.toUpperCase(), margin, y);
    y += 5;

    fields.forEach(([label, value], index) => {
      document.setTextColor(125, 140, 160);
      document.setFont("helvetica", "bold");
      document.setFontSize(5.8);
      document.text(label.toUpperCase(), margin, y);
      y += 3.5;
      document.setTextColor(25, 40, 65);
      document.setFont("helvetica", "normal");
      document.setFontSize(7.5);
      const lines = document.splitTextToSize(value || "—", contentWidth);
      document.text(lines, margin, y);
      y += Math.max(lines.length * 3.6 + 2.5, lineHeights[index] - 3);
    });
    y += 1;
  }

  function addSignatures() {
    ensureSpace(43);
    document.setFillColor(255, 249, 230);
    document.setDrawColor(238, 210, 128);
    document.roundedRect(margin, y, contentWidth, 14, 2, 2, "FD");
    document.setTextColor(95, 70, 20);
    document.setFont("helvetica", "normal");
    document.setFontSize(6.5);
    const legal = document.splitTextToSize(
      "A empresa não se responsabiliza por acessórios que não estejam expressamente descritos neste documento.",
      contentWidth - 6,
    );
    document.text(legal, margin + 3, y + 5);
    y += 25;

    const signatureWidth = 70;
    const leftX = margin + 10;
    const rightX = pageWidth - margin - 10 - signatureWidth;
    const signatureY = y;

    [
      [leftX, "ASSINATURA DO CLIENTE", order.clientSignature],
      [
        rightX,
        "ASSINATURA DO RESPONSÁVEL TÉCNICO",
        order.technicianSignature,
      ],
    ].forEach(([xValue, label, signature]) => {
      const x = Number(xValue);
      const rawSignature = String(signature ?? "");
      if (rawSignature.startsWith("data:image")) {
        try {
          document.addImage(
            rawSignature,
            "PNG",
            x + 8,
            signatureY - 10,
            signatureWidth - 16,
            14,
          );
        } catch {
          // Mantém a linha de assinatura como fallback.
        }
      } else if (rawSignature.startsWith("typed:")) {
        document.setFont("times", "italic");
        document.setFontSize(10);
        document.setTextColor(25, 40, 65);
        document.text(
          rawSignature.slice(6),
          x + signatureWidth / 2,
          signatureY,
          { align: "center" },
        );
      }
      document.setDrawColor(90, 105, 125);
      document.line(x, signatureY + 4, x + signatureWidth, signatureY + 4);
      document.setFont("helvetica", "bold");
      document.setFontSize(5.8);
      document.setTextColor(100, 115, 135);
      document.text(String(label), x + signatureWidth / 2, signatureY + 8, {
        align: "center",
      });
    });
    y += 17;
  }

  copies.forEach((copy, copyIndex) => {
    if (copyIndex > 0) document.addPage();
    header(copy);
    drawInfoBar();
    y = 63;
    addSection("Cliente", [
      ["Nome completo", order.customerName],
      ["CPF ou CNPJ", order.customerDocument],
      ["Telefone / WhatsApp", order.customerWhatsapp || order.customerPhone],
    ]);
    addSection("Equipamento recebido", [
      [
        "Tipo / Marca / Modelo",
        `${equipmentTypeLabels[order.equipmentType] ?? order.equipmentType} · ${order.equipmentLabel}`,
      ],
      ["Número de série", order.equipmentSerialNumber],
      ["Acessórios entregues", order.deliveredAccessories],
      ["Estado físico", order.physicalCondition],
    ]);
    addSection("Problema, diagnóstico e serviço", [
      ["Defeito relatado", order.reportedDefect],
      ["Serviço solicitado", order.requestedService],
      ["Diagnóstico técnico", order.technicalDiagnosis],
      ["Serviço realizado", order.performedService],
      ["Peças utilizadas", order.partsUsed],
      ["Observações para o cliente", order.customerNotes],
    ]);
    addSection("Valores e pagamento", [
      [
        "Composição",
        `Serviço: ${formatCurrency(order.serviceValue)} · Peças: ${formatCurrency(order.partsValue)} · Desconto: ${formatCurrency(order.discount)} · Acréscimo: ${formatCurrency(order.surcharge)}`,
      ],
      [
        "Total / Pago / Pendente",
        `${formatCurrency(order.totalValue)} · ${formatCurrency(order.paidValue)} · ${formatCurrency(order.pendingValue)}`,
      ],
      [
        "Forma de pagamento",
        order.paymentMethod
          ? paymentMethodLabels[order.paymentMethod] ?? order.paymentMethod
          : "Não informada",
      ],
    ]);
    addSignatures();
  });

  const totalPages = document.getNumberOfPages();
  for (let page = 1; page <= totalPages; page += 1) {
    document.setPage(page);
    document.setTextColor(135, 145, 160);
    document.setFont("helvetica", "normal");
    document.setFontSize(6);
    document.text(
      `Gerado em ${formatDate(new Date(), true)} · ${company.document ?? company.email ?? ""}`,
      margin,
      pageHeight - 7,
    );
    document.text(`${page}/${totalPages}`, pageWidth - margin, pageHeight - 7, {
      align: "right",
    });
  }

  const fileName = `ordem-servico-${order.number}.pdf`;
  document.save(fileName);
  return fileName;
}
