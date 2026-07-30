import { createServiceOrder } from "@/services/service-order-service";
import { serviceOrderSchema } from "@/schemas/service-order";

export async function POST(request: Request) {
  try {
    const input = serviceOrderSchema.parse(await request.json());
    const order = await createServiceOrder(input);

    return Response.json(
      { id: order.id, number: order.number },
      { status: 201 },
    );
  } catch (error) {
    return Response.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Não foi possível criar a ordem de serviço.",
      },
      { status: 400 },
    );
  }
}
