import { paymentMethodLabels } from "@/lib/constants";
import { addCompanyLogo } from "@/services/pdf/pdf-logo";
import type { CompanyView, ServiceOrderView } from "@/types/domain";
import { formatCurrency, formatDate } from "@/utils/formatters";

export type CustomerDocumentType =
  | "WARRANTY_TERM"
  | "PAYMENT_RECEIPT"
  | "DELIVERY_RECEIPT";

export type WarrantyPdfInput = {
  servicePerformed: string;
  warrantyDays: number;
};

export type ReceiptPdfInput = {
  receivedFrom: string;
  amount: number;
  reference: string;
  paymentMethod: string;
  date: string;
};

export type DeliveryReceiptPdfInput = {
  customerName: string;
  document: string;
  equipment: string;
  brandModel: string;
  serialNumber: string;
  performedService: string;
  deliveryDate: string;
};

type PdfDocument = Awaited<ReturnType<typeof createPdf>>;

async function createPdf(title: string, company: CompanyView, reference?: string) {
  const { jsPDF } = await import("jspdf");
  const document = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });
  const pageWidth = document.internal.pageSize.getWidth();
  const margin = 18;

  document.setFillColor(2, 8, 23);
  document.rect(0, 0, pageWidth, 40, "F");
  const hasLogo = await addCompanyLogo(document, company.logoUrl, {
    x: margin,
    y: 6,
    width: 26,
    height: 26,
  });
  if (!hasLogo) {
    document.setFillColor(0, 102, 255);
    document.roundedRect(margin, 10, 17, 17, 3, 3, "F");
    document.setTextColor(255, 255, 255);
    document.setFont("helvetica", "bold");
    document.setFontSize(12);
    document.text("DI", margin + 8.5, 21, { align: "center" });
  }
  document.setTextColor(255, 255, 255);
  document.setFont("helvetica", "bold");
  document.setFontSize(15);
  document.text(company.companyName, margin + 30, 17);
  document.setFont("helvetica", "normal");
  document.setFontSize(6.5);
  document.setTextColor(185, 205, 232);
  document.text(
    [company.phone, company.email, company.address].filter(Boolean).join("  ·  "),
    margin + 30,
    23,
  );
  document.setTextColor(255, 255, 255);
  document.setFont("helvetica", "bold");
  document.setFontSize(9);
  document.text(title, pageWidth - margin, 16, { align: "right" });
  if (reference) {
    document.setTextColor(90, 180, 255);
    document.setFontSize(8);
    document.text(reference, pageWidth - margin, 23, { align: "right" });
  }

  return document;
}

function addField(
  document: PdfDocument,
  label: string,
  value: string,
  y: number,
  options?: { maxLines?: number; fontSize?: number },
) {
  const pageWidth = document.internal.pageSize.getWidth();
  const margin = 18;
  const width = pageWidth - margin * 2;
  document.setTextColor(115, 130, 150);
  document.setFont("helvetica", "bold");
  document.setFontSize(6.5);
  document.text(label.toUpperCase(), margin, y);
  document.setTextColor(25, 40, 65);
  document.setFont("helvetica", "normal");
  document.setFontSize(options?.fontSize ?? 9);
  const lines = document
    .splitTextToSize(value || "—", width)
    .slice(0, options?.maxLines ?? 3);
  document.text(lines, margin, y + 5);
}

function addManualSignatures(
  document: PdfDocument,
  leftLabel: string,
  rightLabel: string,
  y = 246,
) {
  const pageWidth = document.internal.pageSize.getWidth();
  const margin = 18;
  const signatureWidth = 70;
  const rightX = pageWidth - margin - signatureWidth;
  document.setDrawColor(90, 105, 125);
  document.line(margin, y, margin + signatureWidth, y);
  document.line(rightX, y, rightX + signatureWidth, y);
  document.setTextColor(100, 115, 135);
  document.setFont("helvetica", "bold");
  document.setFontSize(6);
  document.text(leftLabel.toUpperCase(), margin + signatureWidth / 2, y + 5, {
    align: "center",
  });
  document.text(rightLabel.toUpperCase(), rightX + signatureWidth / 2, y + 5, {
    align: "center",
  });
}

function addFooter(document: PdfDocument, company: CompanyView) {
  const pageWidth = document.internal.pageSize.getWidth();
  document.setTextColor(135, 145, 160);
  document.setFont("helvetica", "normal");
  document.setFontSize(6);
  document.text(
    `Gerado em ${formatDate(new Date(), true)} · ${company.document ?? company.email ?? ""}`,
    18,
    288,
  );
  document.text("Página 1 de 1", pageWidth - 18, 288, { align: "right" });
}

export async function downloadWarrantyPdf(
  order: ServiceOrderView,
  company: CompanyView,
  input: WarrantyPdfInput,
) {
  const document = await createPdf("TERMO DE GARANTIA", company, order.number);
  addField(document, "Nome do cliente", order.customerName, 57);
  addField(document, "Equipamento", order.equipmentLabel, 76);
  addField(document, "Serviço executado", input.servicePerformed, 95, {
    maxLines: 4,
  });
  addField(
    document,
    "Prazo da garantia",
    `${input.warrantyDays} dias a partir da entrega do equipamento`,
    122,
  );

  document.setFillColor(246, 248, 252);
  document.roundedRect(18, 143, 174, 64, 3, 3, "F");
  document.setTextColor(25, 40, 65);
  document.setFont("helvetica", "bold");
  document.setFontSize(8);
  [
    "A GARANTIA COBRE APENAS DEFEITOS RELACIONADOS AO SERVIÇO EXECUTADO.",
    "NÃO COBRIMOS DANOS CAUSADOS POR MAU USO.",
    "A GARANTIA NÃO COBRE PERDAS DE DADOS OU CONFIGURAÇÕES.",
    "PARA ACIONAR A GARANTIA, APRESENTE ESTE TERMO.",
  ].forEach((line, index) => document.text(`• ${line}`, 24, 155 + index * 13));

  addManualSignatures(document, "Cliente", "Responsável técnico");
  addFooter(document, company);
  const fileName = `termo-garantia-${order.number}.pdf`;
  document.save(fileName);
  return fileName;
}

export async function downloadReceiptPdf(
  order: ServiceOrderView,
  company: CompanyView,
  input: ReceiptPdfInput,
) {
  const document = await createPdf("RECIBO", company, order.number);
  addField(document, "Recebimento de", input.receivedFrom, 62);
  addField(document, "Quantia de", formatCurrency(input.amount), 86, {
    fontSize: 14,
  });
  addField(document, "Referente a", input.reference, 112, { maxLines: 4 });
  addField(document, "Forma de pagamento", input.paymentMethod, 145);
  addField(document, "Data", formatDate(`${input.date}T12:00:00`), 169);
  addManualSignatures(document, "Assinatura e carimbo", "Cliente", 235);
  addFooter(document, company);
  const fileName = `recibo-${order.number}.pdf`;
  document.save(fileName);
  return fileName;
}

export async function downloadDeliveryReceiptPdf(
  company: CompanyView,
  input: DeliveryReceiptPdfInput,
) {
  const document = await createPdf("COMPROVANTE DE ENTREGA", company);
  addField(document, "Nome", input.customerName, 56);
  addField(document, "RG / CPF", input.document, 75);
  addField(document, "Equipamento", input.equipment, 94);
  addField(document, "Marca / modelo", input.brandModel, 113);
  addField(document, "Número de série", input.serialNumber, 132);
  addField(document, "Serviço realizado", input.performedService, 151, {
    maxLines: 4,
  });
  addField(
    document,
    "Data da entrega",
    formatDate(`${input.deliveryDate}T12:00:00`),
    184,
  );
  addManualSignatures(document, "Cliente", "Responsável técnico", 240);
  addFooter(document, company);
  const fileName = `comprovante-entrega-${input.customerName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "cliente"}.pdf`;
  document.save(fileName);
  return fileName;
}

export async function downloadCustomerDocumentPdf(
  type: CustomerDocumentType,
  order: ServiceOrderView,
  company: CompanyView,
) {
  if (type === "WARRANTY_TERM") {
    return downloadWarrantyPdf(order, company, {
      warrantyDays: 90,
      servicePerformed: order.performedService || order.requestedService,
    });
  }

  if (type === "PAYMENT_RECEIPT") {
    return downloadReceiptPdf(order, company, {
      receivedFrom: order.customerName,
      amount: order.paidValue || order.totalValue,
      reference: order.performedService || order.requestedService,
      paymentMethod: order.paymentMethod
        ? paymentMethodLabels[order.paymentMethod] ?? order.paymentMethod
        : "Não informada",
      date: new Date().toISOString().slice(0, 10),
    });
  }

  return downloadDeliveryReceiptPdf(company, {
    customerName: order.customerName,
    document: order.customerDocument ?? "",
    equipment: order.equipmentLabel,
    brandModel: order.equipmentLabel,
    serialNumber: order.equipmentSerialNumber ?? "",
    performedService: order.performedService || order.requestedService,
    deliveryDate: new Date().toISOString().slice(0, 10),
  });
}
