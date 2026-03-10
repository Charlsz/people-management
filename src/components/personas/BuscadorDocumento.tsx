"use client";

import { useState } from "react";

interface BuscadorDocumentoProps {
  onFound: (persona: Record<string, unknown>) => void;
  label?: string;
}

export function BuscadorDocumento({ onFound, label = "Buscar por Documento" }: BuscadorDocumentoProps) {
  const [doc, setDoc] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!doc.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/personas/${encodeURIComponent(doc.trim())}`);
      const json = await res.json();

      if (!res.ok || !json.success) {
        setError(json.error || "Persona no encontrada");
        return;
      }

      onFound(json.data);
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSearch} className="flex items-end gap-3">
      <div className="flex-1">
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {label}
        </label>
        <input
          type="text"
          value={doc}
          onChange={(e) => setDoc(e.target.value)}
          maxLength={10}
          placeholder="Nro. documento"
          className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Buscando..." : "Buscar"}
      </button>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </form>
  );
}
