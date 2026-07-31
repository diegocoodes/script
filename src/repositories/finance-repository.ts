import type { Prisma } from "@prisma/client";
import { demoFinancialData, demoPurchases } from "@/lib/demo-data";
import { prisma } from "@/lib/prisma";
import type {
  BusinessPurchaseView,
  FinancialData,
  FinancialRevenueView,
} from "@/types/domain";

type PurchaseRecord = Prisma.BusinessPurchaseGetPayload<Record<string, never>>;

function reportFallback(area: string, error: unknown) {
  if (process.env.NODE_ENV === "development") {
    console.warn(
      `[dados de demonstração] ${area}:`,
      error instanceof Error ? error.message : error,
    );
  }
}

function toPurchaseView(purchase: PurchaseRecord): BusinessPurchaseView {
  return {
    id: purchase.id,
    description: purchase.description,
    category: purchase.category,
    quantity: purchase.quantity,
    totalValue: Number(purchase.totalValue),
    supplier: purchase.supplier,
    purchasedAt: purchase.purchasedAt.toISOString(),
    notes: purchase.notes,
    createdAt: purchase.createdAt.toISOString(),
  };
}

export async function getBusinessPurchases(): Promise<BusinessPurchaseView[]> {
  try {
    const purchases = await prisma.businessPurchase.findMany({
      orderBy: [{ purchasedAt: "desc" }, { createdAt: "desc" }],
    });
    return purchases.map(toPurchaseView);
  } catch (error) {
    reportFallback("compras", error);
    return demoPurchases;
  }
}

export async function getFinancialData(): Promise<FinancialData> {
  try {
    const [
      revenueSummary,
      outstandingSummary,
      purchaseSummary,
      recentRevenueRecords,
      recentPurchaseRecords,
    ] = await Promise.all([
      prisma.serviceOrder.aggregate({
        where: { paidValue: { gt: 0 } },
        _sum: { paidValue: true },
        _count: true,
      }),
      prisma.serviceOrder.aggregate({
        where: {
          pendingValue: { gt: 0 },
          status: { not: "CANCELED" },
        },
        _sum: { pendingValue: true },
      }),
      prisma.businessPurchase.aggregate({
        _sum: { totalValue: true },
        _count: true,
      }),
      prisma.serviceOrder.findMany({
        where: { paidValue: { gt: 0 } },
        select: {
          id: true,
          number: true,
          paidValue: true,
          pendingValue: true,
          entryDate: true,
          customer: { select: { name: true } },
        },
        orderBy: { entryDate: "desc" },
        take: 8,
      }),
      prisma.businessPurchase.findMany({
        orderBy: [{ purchasedAt: "desc" }, { createdAt: "desc" }],
        take: 8,
      }),
    ]);

    const totalRevenue = Number(revenueSummary._sum.paidValue ?? 0);
    const totalExpenses = Number(purchaseSummary._sum.totalValue ?? 0);
    const recentRevenues: FinancialRevenueView[] = recentRevenueRecords.map(
      (order) => ({
        id: order.id,
        number: order.number,
        customerName: order.customer.name,
        paidValue: Number(order.paidValue),
        pendingValue: Number(order.pendingValue),
        entryDate: order.entryDate.toISOString(),
      }),
    );

    return {
      totalRevenue,
      totalExpenses,
      balance: totalRevenue - totalExpenses,
      outstandingValue: Number(outstandingSummary._sum.pendingValue ?? 0),
      revenueCount: revenueSummary._count,
      purchaseCount: purchaseSummary._count,
      recentRevenues,
      recentPurchases: recentPurchaseRecords.map(toPurchaseView),
    };
  } catch (error) {
    reportFallback("financeiro", error);
    return demoFinancialData;
  }
}
