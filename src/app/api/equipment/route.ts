import { encryptSecret } from "@/lib/encryption";
import { prisma } from "@/lib/prisma";
import { equipmentSchema } from "@/schemas/equipment";

export async function POST(request: Request) {
  try {
    const input = equipmentSchema.parse(await request.json());
    const equipment = await prisma.equipment.create({
      data: {
        customerId: input.customerId,
        type: input.type,
        brand: input.brand,
        model: input.model,
        serialNumber: input.serialNumber || null,
        color: input.color || null,
        unlockSecret: encryptSecret(input.unlockSecret),
        deliveredAccessories: input.deliveredAccessories || null,
        physicalCondition: input.physicalCondition || null,
        reportedDefect: input.reportedDefect,
        notes: input.notes || null,
        photos: input.photoUrl
          ? {
              create: {
                url: input.photoUrl,
                caption: "Foto de entrada do equipamento",
              },
            }
          : undefined,
      },
      include: {
        customer: { select: { name: true } },
      },
    });

    return Response.json(
      {
        id: equipment.id,
        customerId: equipment.customerId,
        customerName: equipment.customer.name,
        type: equipment.type,
        brand: equipment.brand,
        model: equipment.model,
        serialNumber: equipment.serialNumber,
        color: equipment.color,
        deliveredAccessories: equipment.deliveredAccessories,
        physicalCondition: equipment.physicalCondition,
        reportedDefect: equipment.reportedDefect,
        notes: equipment.notes,
        orderCount: 0,
        createdAt: equipment.createdAt.toISOString(),
      },
      { status: 201 },
    );
  } catch (error) {
    return Response.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Não foi possível cadastrar o equipamento.",
      },
      { status: 400 },
    );
  }
}
