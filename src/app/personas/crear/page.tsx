"use client";

import { PersonaForm } from "@/components/personas/PersonaForm";
import { PersonaFormData } from "@/lib/validators";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CrearPersonaPage() {
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const router = useRouter();

  async function handleCreate(data: PersonaFormData, fotoBase64: string | null) {
    setMessage(null);

    const res = await fetch("/api/personas/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, foto_base64: fotoBase64 }),
    });

    const json = await res.json();

    if (!res.ok || !json.success) {
      setMessage({ type: "error", text: json.error || "Error al crear persona" });
      return;
    }

    setMessage({ type: "success", text: "Persona creada exitosamente" });
    setTimeout(() => router.push("/"), 1500);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold">➕ Crear Persona</h1>

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

      <PersonaForm onSubmit={handleCreate} submitLabel="Crear Persona" />
    </div>
  );
}
