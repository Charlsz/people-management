import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { personaSchema } from "@/lib/validators";
import { createServerClient } from "@/lib/supabase";

// GET - Consultar persona por documento
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ doc: string }> }
) {
  try {
    const { doc } = await params;

    const persona = await prisma.persona.findUnique({
      where: { nro_documento: doc },
    });

    if (!persona) {
      return NextResponse.json(
        { success: false, error: "Persona no encontrada" },
        { status: 404 }
      );
    }

    // Log the query
    await prisma.log.create({
      data: {
        tipo: "READ",
        doc: persona.nro_documento,
        detalle: `Consulta persona: ${persona.primer_nombre} ${persona.apellidos}`,
      },
    });

    return NextResponse.json({ success: true, data: persona });
  } catch (error) {
    console.error("Error fetching persona:", error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// PUT - Modificar persona
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ doc: string }> }
) {
  try {
    const { doc } = await params;
    const body = await request.json();

    // Server-side Zod validation
    const parsed = personaSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Check existence
    const existing = await prisma.persona.findUnique({
      where: { nro_documento: doc },
    });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Persona no encontrada" },
        { status: 404 }
      );
    }

    // Handle photo upload if provided
    let foto_url = existing.foto_url;
    if (body.foto_base64) {
      const supabaseServer = createServerClient();
      const buffer = Buffer.from(body.foto_base64, "base64");
      const fileName = `personas/${doc}-${Date.now()}.jpg`;

      const { error: uploadError } = await supabaseServer.storage
        .from("fotos")
        .upload(fileName, buffer, { contentType: "image/jpeg", upsert: true });

      if (!uploadError) {
        const { data: urlData } = supabaseServer.storage
          .from("fotos")
          .getPublicUrl(fileName);
        foto_url = urlData.publicUrl;
      }
    }

    const persona = await prisma.persona.update({
      where: { nro_documento: doc },
      data: {
        tipo_documento: data.tipo_documento,
        primer_nombre: data.primer_nombre,
        segundo_nombre: data.segundo_nombre || null,
        apellidos: data.apellidos,
        fecha_nacimiento: new Date(data.fecha_nacimiento),
        genero: data.genero,
        email: data.email,
        celular: data.celular,
        foto_url,
      },
    });

    // Log the transaction
    await prisma.log.create({
      data: {
        tipo: "UPDATE",
        doc: persona.nro_documento,
        detalle: `Persona modificada: ${persona.primer_nombre} ${persona.apellidos}`,
      },
    });

    return NextResponse.json({ success: true, data: persona });
  } catch (error) {
    console.error("Error updating persona:", error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// DELETE - Borrar persona
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ doc: string }> }
) {
  try {
    const { doc } = await params;

    const existing = await prisma.persona.findUnique({
      where: { nro_documento: doc },
    });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Persona no encontrada" },
        { status: 404 }
      );
    }

    await prisma.persona.delete({ where: { nro_documento: doc } });

    // Log the transaction
    await prisma.log.create({
      data: {
        tipo: "DELETE",
        doc: existing.nro_documento,
        detalle: `Persona eliminada: ${existing.primer_nombre} ${existing.apellidos}`,
      },
    });

    return NextResponse.json({
      success: true,
      data: { message: "Persona eliminada exitosamente" },
    });
  } catch (error) {
    console.error("Error deleting persona:", error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
