import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/personas/buscar?q=texto
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";

    const personas = await prisma.persona.findMany({
      where: {
        OR: [
          { nro_documento: { contains: q } },
          { primer_nombre: { contains: q, mode: "insensitive" } },
          { apellidos: { contains: q, mode: "insensitive" } },
          { email: { contains: q, mode: "insensitive" } },
        ],
      },
      orderBy: { created_at: "desc" },
      take: 50,
    });

    return NextResponse.json({ success: true, data: personas });
  } catch (error) {
    console.error("Error searching personas:", error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
