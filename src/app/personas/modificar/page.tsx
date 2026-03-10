"use client";

import { PersonaForm } from "@/components/personas/PersonaForm";
import { BuscadorDocumento } from "@/components/personas/BuscadorDocumento";
import { PersonaFormData } from "@/lib/validators";
import { useState } from "react";

export default function ModificarPersonaPage() {
  const [persona, setPersona] = useState<Record<string, unknown> | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function handleFound(data: Record<string, unknown>) {
    // Convert date for the form input
    const fechaRaw = data.fecha_nacimiento as string;
    const fecha = new Date(fechaRaw).toISOString().split("T")[0];
    setPersona({ ...data, fecha_nacimiento: fecha });
    setMessage(null);
  }

  async function handleUpdate(data: PersonaFormData, fotoBase64: string | null) {
    setMessage(null);
    const doc = persona?.nro_documento as string;

    const res = await fetch(`/api/personas/${encodeURIComponent(doc)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, foto_base64: fotoBase64 }),
    });

    const json = await res.json();

    if (!res.ok || !json.success) {
      setMessage({ type: "error", text: json.error || "Error al modificar persona" });
      return;
    }

    setMessage({ type: "success", text: "Persona modificada exitosamente" });
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold">✏️ Modificar Persona</h1>

      <div className="mb-6">
        <BuscadorDocumento onFound={handleFound} />
      </div>

      {message && (
        <div
          className={`mb-4 rounded-lg p-3 text-sm ${
            message.type === "success"
              ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      {persona && (
        <PersonaForm
          key={persona.nro_documento as string}
          defaultValues={persona as unknown as Partial<PersonaFormData>}
          onSubmit={handleUpdate}
          submitLabel="Guardar Cambios"
          disableDocumento
        />
      )}
    </div>
  );
}
