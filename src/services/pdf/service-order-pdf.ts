import type { CompanyView, ServiceOrderView } from "@/types/domain";
import { formatDate } from "@/utils/formatters";
import { addCompanyLogo } from "@/services/pdf/pdf-logo";

function formatTime(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export async function downloadServiceOrderPdf(
  order: ServiceOrderView,
  company: CompanyView,
) {
  const { jsPDF } = await import("jspdf");
  const document = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });
  const pageWidth = document.internal.pageSize.getWidth();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  function textLines(value: string | null | undefined, width: number, max = 2) {
    return document.splitTextToSize(value || "—", width).slice(0, max);
  }

  function sectionTitle(title: string, y: number) {
    document.setTextColor(0, 82, 190);
    document.setFont("helvetica", "bold");
    document.setFontSize(7.5);
    document.text(title.toUpperCase(), margin, y);
    document.setDrawColor(205, 216, 231);
    document.line(margin, y + 2, pageWidth - margin, y + 2);
  }

  function field(
    label: string,
    value: string | null | undefined,
    x: number,
    y: number,
    width: number,
    maxLines = 2,
  ) {
    document.setTextColor(120, 135, 155);
    document.setFont("helvetica", "bold");
    document.setFontSize(5.8);
    document.text(label.toUpperCase(), x, y);
    document.setTextColor(25, 40, 65);
    document.setFont("helvetica", "normal");
    document.setFontSize(8);
    document.text(textLines(value, width, maxLines), x, y + 4);
  }

  document.setFillColor(2, 8, 23);
  document.rect(0, 0, pageWidth, 37, "F");
  const hasLogo = await addCompanyLogo(document, company.logoUrl, {
    x: margin,
    y: 5,
    width: 24,
    height: 24,
  });
  if (!hasLogo) {
    document.setFillColor(0, 102, 255);
    document.roundedRect(margin, 8, 17, 17, 3, 3, "F");
    document.setTextColor(255, 255, 255);
    document.setFont("helvetica", "bold");
    document.setFontSize(12);
    document.text("DI", margin + 8.5, 19, { align: "center" });
  }
  document.setTextColor(255, 255, 255);
  document.setFont("helvetica", "bold");
  document.setFontSize(15);
  document.text(company.companyName, margin + 28, 14);
  document.setFont("helvetica", "normal");
  document.setFontSize(6.5);
  document.setTextColor(185, 205, 232);
  document.text(
    [company.phone, company.email, company.address].filter(Boolean).join("  ·  "),
    margin + 28,
    20,
  );
  document.setFont("helvetica", "bold");
  document.setTextColor(255, 255, 255);
  document.setFontSize(8);
  document.text("ORDEM DE SERVIÇO", pageWidth - margin, 12, {
    align: "right",
  });
  document.setFontSize(12);
  document.text(order.number, pageWidth - margin, 19, { align: "right" });

  const infoY = 41;
  const infoWidth = contentWidth / 3;
  [
    ["DATA DE ENTRADA", formatDate(order.entryDate)],
    ["HORA", formatTime(order.entryDate)],
    ["PREVISÃO DE ENTREGA", formatDate(order.expectedDeliveryDate)],
  ].forEach(([label, value], index) => {
    const x = margin + infoWidth * index;
    document.setFillColor(246, 248, 252);
    document.roundedRect(x + 1, infoY, infoWidth - 2, 14, 2, 2, "F");
    document.setFont("helvetica", "bold");
    document.setFontSize(5.8);
    document.setTextColor(120, 135, 155);
    document.text(label, x + infoWidth / 2, infoY + 5, { align: "center" });
    document.setFontSize(8);
    document.setTextColor(25, 40, 65);
    document.text(value, x + infoWidth / 2, infoY + 10.5, {
      align: "center",
    });
  });

  sectionTitle("Dados do cliente", 63);
  field("Nome", order.customerName, margin, 71, 82);
  field(
    "Telefone",
    order.customerPhone || order.customerWhatsapp,
    margin + 92,
    71,
    82,
  );
  field("Endereço", order.customerAddress, margin, 82, 110, 2);
  field(
    "Cidade",
    [order.customerCity, order.customerState].filter(Boolean).join(" / "),
    margin + 120,
    82,
    54,
  );

  sectionTitle("Dados do equipamento", 98);
  field("Marca / modelo", order.equipmentLabel, margin, 106, 82);
  field(
    "Acessórios",
    order.deliveredAccessories,
    margin + 92,
    106,
    82,
  );
  field("Descrição", order.equipmentDescription, margin, 118, contentWidth, 2);
  field("Defeito relatado", order.reportedDefect, margin, 132, contentWidth, 3);

  sectionTitle("Serviço solicitado", 151);
  field("Descrição do serviço", order.requestedService, margin, 159, contentWidth, 4);
  field(
    "Serviço realizado",
    order.performedService,
    margin,
    178,
    contentWidth,
    4,
  );

  document.setFillColor(255, 249, 230);
  document.setDrawColor(238, 210, 128);
  document.roundedRect(margin, 201, contentWidth, 17, 2, 2, "FD");
  document.setTextColor(95, 70, 20);
  document.setFont("helvetica", "normal");
  document.setFontSize(6.5);
  document.text(
    textLines(
      "Declaro que os dados, o equipamento e os acessórios descritos nesta ordem estão corretos.",
      contentWidth - 8,
      2,
    ),
    margin + 4,
    208,
  );

  const signatureY = 246;
  const signatureWidth = 72;
  const signatureGap = contentWidth - signatureWidth * 2;
  [
    [margin, "ASSINATURA DO CLIENTE"],
    [margin + signatureWidth + signatureGap, "ASSINATURA DO ATENDENTE"],
  ].forEach(([xValue, label]) => {
    const x = Number(xValue);
    document.setDrawColor(90, 105, 125);
    document.line(x, signatureY, x + signatureWidth, signatureY);
    document.setTextColor(100, 115, 135);
    document.setFont("helvetica", "bold");
    document.setFontSize(6);
    document.text(String(label), x + signatureWidth / 2, signatureY + 5, {
      align: "center",
    });
  });

  document.setTextColor(135, 145, 160);
  document.setFont("helvetica", "normal");
  document.setFontSize(6);
  document.text(
    `Gerado em ${formatDate(new Date(), true)} · ${company.document ?? company.email ?? ""}`,
    margin,
    288,
  );
  document.text("Página 1 de 1", pageWidth - margin, 288, { align: "right" });

  const fileName = `ordem-servico-${order.number}.pdf`;
  document.save(fileName);
  return fileName;
}
