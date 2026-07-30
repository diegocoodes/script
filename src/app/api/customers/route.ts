import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { customerSchema } from "@/schemas/customer";

export async function POST(request: Request) {
  try {
    const input = customerSchema.parse(await request.json());
    const customer = await prisma.customer.create({
      data: {
        name: input.name,
        document: input.document || null,
        phone: input.phone || null,
        whatsapp: input.whatsapp,
        email: input.email || null,
        address: input.address || null,
        city: input.city || null,
        state: input.state?.toUpperCase() || null,
        notes: input.notes || null,
      },
    });

    return Response.json(
      {
        ...customer,
        equipmentCount: 0,
        orderCount: 0,
        createdAt: customer.createdAt.toISOString(),
        updatedAt: customer.updatedAt.toISOString(),
      },
      { status: 201 },
    );
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return Response.json(
        { message: "Já existe um cliente com este CPF ou CNPJ." },
        { status: 409 },
      );
    }

    return Response.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Não foi possível cadastrar o cliente.",
      },
      { status: 400 },
    );
  }
}
