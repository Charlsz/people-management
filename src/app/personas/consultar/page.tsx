"use client";

import { BuscadorDocumento } from "@/components/personas/BuscadorDocumento";
import { PersonaForm } from "@/components/personas/PersonaForm";
import { PersonaFormData } from "@/lib/validators";
import { useState } from "react";

export default function ConsultarPersonaPage() {
  const [persona, setPersona] = useState<Record<string, unknown> | null>(null);

  function handleFound(data: Record<string, unknown>) {
    const fechaRaw = data.fecha_nacimiento as string;
    const fecha = new Date(fechaRaw).toISOString().split("T")[0];
    setPersona({ ...data, fecha_nacimiento: fecha });
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold">🔍 Consultar Persona</h1>

      <div className="mb-6">
        <BuscadorDocumento onFound={handleFound} />
      </div>

      {persona && (
        <div className="space-y-4">
          {typeof persona.foto_url === "string" && persona.foto_url && (
            <img
              src={persona.foto_url}
              alt="Foto persona"
              className="h-32 w-32 rounded-xl object-cover"
            />
          )}
          <PersonaForm
            key={persona.nro_documento as string}
            defaultValues={persona as unknown as Partial<PersonaFormData>}
            onSubmit={async () => {}}
            submitLabel=""
            readOnly
          />
        </div>
      )}
    </div>
  );
}
