import { deleteCustomerWithRelations } from "@/services/customer-service";

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const customer = await deleteCustomerWithRelations(id);
    if (!customer) {
      return Response.json(
        { message: "Cliente não encontrado." },
        { status: 404 },
      );
    }

    return Response.json({ id: customer.id });
  } catch (error) {
    return Response.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Não foi possível excluir o cliente.",
      },
      { status: 400 },
    );
  }
}
