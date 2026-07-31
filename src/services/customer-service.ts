import { prisma } from "@/lib/prisma";

export async function deleteCustomerWithRelations(customerId: string) {
  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
    select: {
      id: true,
      serviceOrders: { select: { id: true } },
    },
  });
  if (!customer) return null;

  const orderIds = customer.serviceOrders.map((order) => order.id);

  return prisma.$transaction(async (transaction) => {
    await transaction.generatedDocument.deleteMany({
      where: { serviceOrderId: { in: orderIds } },
    });
    await transaction.deliveryReceipt.deleteMany({
      where: { serviceOrderId: { in: orderIds } },
    });
    await transaction.receipt.deleteMany({
      where: { serviceOrderId: { in: orderIds } },
    });
    await transaction.auditLog.deleteMany({
      where: {
        OR: [
          { serviceOrderId: { in: orderIds } },
          { entity: "Customer", entityId: customerId },
        ],
      },
    });
    await transaction.serviceOrder.deleteMany({
      where: { id: { in: orderIds } },
    });
    await transaction.equipment.deleteMany({ where: { customerId } });
    await transaction.customer.delete({ where: { id: customerId } });

    return { id: customerId };
  });
}
