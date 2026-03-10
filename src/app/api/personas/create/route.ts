import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { personaSchema } from "@/lib/validators";
import { createServerClient } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
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

    // Check if persona already exists
    const existing = await prisma.persona.findUnique({
      where: { nro_documento: data.nro_documento },
    });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "Ya existe una persona con este documento" },
        { status: 409 }
      );
    }

    // Handle photo upload if provided
    let foto_url: string | null = null;
    if (body.foto_base64) {
      const supabaseServer = createServerClient();
      const buffer = Buffer.from(body.foto_base64, "base64");
      const fileName = `personas/${data.nro_documento}-${Date.now()}.jpg`;

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

    const persona = await prisma.persona.create({
      data: {
        tipo_documento: data.tipo_documento,
        nro_documento: data.nro_documento,
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
        tipo: "CREATE",
        doc: persona.nro_documento,
        detalle: `Persona creada: ${persona.primer_nombre} ${persona.apellidos}`,
      },
    });

    return NextResponse.json({ success: true, data: persona }, { status: 201 });
  } catch (error) {
    console.error("Error creating persona:", error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
