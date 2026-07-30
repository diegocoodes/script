import { z } from "zod";
import { prisma } from "@/lib/prisma";

const documentLogSchema = z.object({
  serviceOrderId: z.string().min(1),
  type: z.literal("SERVICE_ORDER"),
  fileName: z.string().min(1).max(220),
});

export async function POST(request: Request) {
  try {
    const input = documentLogSchema.parse(await request.json());
    const document = await prisma.generatedDocument.create({ data: input });
    return Response.json({ id: document.id }, { status: 201 });
  } catch {
    return Response.json(
      { message: "Não foi possível registrar o documento no histórico." },
      { status: 400 },
    );
  }
}
