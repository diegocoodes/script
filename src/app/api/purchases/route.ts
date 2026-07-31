import { prisma } from "@/lib/prisma";
import { businessPurchaseSchema } from "@/schemas/business-purchase";

export async function POST(request: Request) {
  try {
    const input = businessPurchaseSchema.parse(await request.json());
    const purchase = await prisma.businessPurchase.create({
      data: {
        description: input.description,
        category: input.category,
        quantity: input.quantity,
        totalValue: input.totalValue,
        supplier: input.supplier || null,
        purchasedAt: new Date(`${input.purchasedAt}T12:00:00`),
        notes: input.notes || null,
      },
    });

    return Response.json(
      {
        id: purchase.id,
        description: purchase.description,
        totalValue: Number(purchase.totalValue),
      },
      { status: 201 },
    );
  } catch (error) {
    return Response.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Não foi possível registrar a compra.",
      },
      { status: 400 },
    );
  }
}
