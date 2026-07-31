import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { ServiceOrderInput } from "@/schemas/service-order";

function optionalDate(value: string | undefined) {
  if (!value) return null;
  return new Date(`${value}T12:00:00`);
}

async function createInTransaction(input: ServiceOrderInput) {
  return prisma.$transaction(
    async (transaction) => {
      const equipment = await transaction.equipment.create({
        data: {
          customerId: input.customerId,
          type: "OTHER",
          brand: input.equipmentName,
          model: "",
          reportedDefect: input.reportedDefect,
          notes: input.equipmentDescription,
        },
        select: { id: true },
      });

      let company = await transaction.companySettings.findFirst({
        orderBy: { createdAt: "asc" },
      });

      if (!company) {
        company = await transaction.companySettings.create({
          data: {
            companyName: "Deyvid Infotech",
            orderPrefix: "OS",
            nextServiceOrderNumber: 1,
          },
        });
      }

      const year = new Date().getFullYear();
      const number = `${company.orderPrefix}-${year}-${String(
        company.nextServiceOrderNumber,
      ).padStart(6, "0")}`;
      const totalValue = Math.max(
        input.serviceValue +
          input.partsValue -
          input.discount +
          input.surcharge,
        0,
      );
      const pendingValue = Math.max(totalValue - input.paidValue, 0);

      await transaction.companySettings.update({
        where: { id: company.id },
        data: { nextServiceOrderNumber: { increment: 1 } },
      });

      const order = await transaction.serviceOrder.create({
        data: {
          number,
          customerId: input.customerId,
          equipmentId: equipment.id,
          reportedDefect: input.reportedDefect,
          technicalDiagnosis: input.technicalDiagnosis || null,
          requestedService: input.requestedService,
          performedService: input.performedService || null,
          partsUsed: input.partsUsed || null,
          internalNotes: input.internalNotes || null,
          customerNotes: input.customerNotes || null,
          serviceValue: input.serviceValue,
          partsValue: input.partsValue,
          discount: input.discount,
          surcharge: input.surcharge,
          totalValue,
          paidValue: input.paidValue,
          pendingValue,
          paymentMethod: input.paymentMethod || null,
          entryDate: optionalDate(input.entryDate) ?? new Date(),
          expectedDeliveryDate: optionalDate(input.expectedDeliveryDate),
          completedAt: optionalDate(input.completedAt),
          pickedUpAt: optionalDate(input.pickedUpAt),
          technicianDisplayName: input.technicianName || null,
          status: input.status,
          priority: input.priority,
          clientSignature: input.clientSignature || null,
          technicianSignature: input.technicianSignature || null,
        },
        include: {
          customer: true,
          equipment: true,
          technician: { select: { name: true } },
        },
      });

      if (input.paidValue > 0 && input.paymentMethod) {
        await transaction.payment.create({
          data: {
            serviceOrderId: order.id,
            amount: input.paidValue,
            method: input.paymentMethod,
            notes: "Pagamento registrado na abertura da ordem.",
          },
        });
      }

      await transaction.auditLog.create({
        data: {
          serviceOrderId: order.id,
          entity: "ServiceOrder",
          entityId: order.id,
          action: "CREATE",
          newValues: {
            number: order.number,
            status: order.status,
            totalValue,
          },
        },
      });

      return order;
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
  );
}

export async function createServiceOrder(input: ServiceOrderInput) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return await createInTransaction(input);
    } catch (error) {
      const retryable =
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2034";

      if (!retryable || attempt === 2) throw error;
    }
  }

  throw new Error("Não foi possível reservar o número da ordem.");
}
