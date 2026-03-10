"use client";

import { BuscadorDocumento } from "@/components/personas/BuscadorDocumento";
import { useState } from "react";

export default function BorrarPersonaPage() {
  const [persona, setPersona] = useState<Record<string, unknown> | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [confirmando, setConfirmando] = useState(false);

  function handleFound(data: Record<string, unknown>) {
    setPersona(data);
    setMessage(null);
    setConfirmando(false);
  }

  async function handleDelete() {
    if (!persona) return;
    const doc = persona.nro_documento as string;

    const res = await fetch(`/api/personas/${encodeURIComponent(doc)}`, {
      method: "DELETE",
    });

    const json = await res.json();

    if (!res.ok || !json.success) {
      setMessage({ type: "error", text: json.error || "Error al eliminar" });
      return;
    }

    setMessage({ type: "success", text: "Persona eliminada exitosamente" });
    setPersona(null);
    setConfirmando(false);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold">🗑️ Borrar Persona</h1>

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
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-lg font-semibold">
            {persona.primer_nombre as string} {persona.segundo_nombre as string || ""} {persona.apellidos as string}
          </h2>
          <p className="text-sm text-zinc-500">
            {persona.tipo_documento as string}: {persona.nro_documento as string}
          </p>
          <p className="text-sm text-zinc-500">Email: {persona.email as string}</p>
          <p className="text-sm text-zinc-500">Celular: {persona.celular as string}</p>

          <div className="mt-4">
            {!confirmando ? (
              <button
                onClick={() => setConfirmando(true)}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Eliminar Persona
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <p className="text-sm font-medium text-red-600">¿Está seguro?</p>
                <button
                  onClick={handleDelete}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                >
                  Sí, eliminar
                </button>
                <button
                  onClick={() => setConfirmando(false)}
                  className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
