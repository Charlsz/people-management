import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/logs?tipo=CREATE&doc=12345&desde=2025-01-01&hasta=2025-12-31
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tipo = searchParams.get("tipo");
    const doc = searchParams.get("doc");
    const desde = searchParams.get("desde");
    const hasta = searchParams.get("hasta");

    const where: Record<string, unknown> = {};

    if (tipo) where.tipo = tipo;
    if (doc) where.doc = { contains: doc };
    if (desde || hasta) {
      where.fecha = {};
      if (desde) (where.fecha as Record<string, unknown>).gte = new Date(desde);
      if (hasta) (where.fecha as Record<string, unknown>).lte = new Date(hasta);
    }

    const logs = await prisma.log.findMany({
      where,
      orderBy: { fecha: "desc" },
      take: 100,
    });

    return NextResponse.json({ success: true, data: logs });
  } catch (error) {
    console.error("Error fetching logs:", error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
