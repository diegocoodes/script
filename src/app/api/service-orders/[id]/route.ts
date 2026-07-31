import { z } from "zod";
import { SERVICE_ORDER_STATUSES } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { getOrderById } from "@/repositories/app-repository";

const updateStatusSchema = z.object({
  status: z.enum(SERVICE_ORDER_STATUSES),
});

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const order = await getOrderById(id);
  if (!order) {
    return Response.json({ message: "Ordem de serviço não encontrada." }, { status: 404 });
  }
  return Response.json(order);
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const input = updateStatusSchema.parse(await request.json());
    const now = new Date();
    const order = await prisma.$transaction(async (transaction) => {
      const current = await transaction.serviceOrder.findUniqueOrThrow({
        where: { id },
        select: { status: true },
      });
      const updated = await transaction.serviceOrder.update({
        where: { id },
        data: {
          status: input.status,
          completedAt: ["COMPLETED", "READY_FOR_PICKUP", "DELIVERED"].includes(
            input.status,
          )
            ? now
            : undefined,
          pickedUpAt: input.status === "DELIVERED" ? now : undefined,
        },
      });
      await transaction.auditLog.create({
        data: {
          serviceOrderId: id,
          entity: "ServiceOrder",
          entityId: id,
          action: "STATUS_UPDATE",
          oldValues: { status: current.status },
          newValues: { status: input.status },
        },
      });
      return updated;
    });

    return Response.json({ id: order.id, status: order.status });
  } catch (error) {
    return Response.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Não foi possível atualizar o status.",
      },
      { status: 400 },
    );
  }
}
