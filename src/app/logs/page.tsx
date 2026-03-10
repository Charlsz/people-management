"use client";

import { useState } from "react";
import type { Log } from "@/types";

export default function LogsPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    tipo: "",
    doc: "",
    desde: "",
    hasta: "",
  });

  async function fetchLogs() {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.tipo) params.set("tipo", filters.tipo);
    if (filters.doc) params.set("doc", filters.doc);
    if (filters.desde) params.set("desde", filters.desde);
    if (filters.hasta) params.set("hasta", filters.hasta);

    try {
      const res = await fetch(`/api/logs?${params.toString()}`);
      const json = await res.json();
      if (json.success) setLogs(json.data);
    } catch (err) {
      console.error("Error fetching logs:", err);
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleString("es-CO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const tipoColors: Record<string, string> = {
    CREATE: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    READ: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    UPDATE: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    DELETE: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-6 text-2xl font-bold">📋 Logs del Sistema</h1>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 gap-3 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 sm:grid-cols-5">
        <div>
          <label className="block text-xs font-medium text-zinc-500">Tipo</label>
          <select
            value={filters.tipo}
            onChange={(e) => setFilters((f) => ({ ...f, tipo: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-2 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-800"
          >
            <option value="">Todos</option>
            <option value="CREATE">CREATE</option>
            <option value="READ">READ</option>
            <option value="UPDATE">UPDATE</option>
            <option value="DELETE">DELETE</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-500">Documento</label>
          <input
            type="text"
            value={filters.doc}
            onChange={(e) => setFilters((f) => ({ ...f, doc: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-2 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-800"
            placeholder="Nro doc"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-500">Desde</label>
          <input
            type="date"
            value={filters.desde}
            onChange={(e) => setFilters((f) => ({ ...f, desde: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-2 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-800"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-500">Hasta</label>
          <input
            type="date"
            value={filters.hasta}
            onChange={(e) => setFilters((f) => ({ ...f, hasta: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-2 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-800"
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={fetchLogs}
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Cargando..." : "Buscar"}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-50 dark:bg-zinc-900">
            <tr>
              <th className="px-4 py-3 font-medium">Tipo</th>
              <th className="px-4 py-3 font-medium">Documento</th>
              <th className="px-4 py-3 font-medium">Fecha</th>
              <th className="px-4 py-3 font-medium">Detalle</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {logs.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-zinc-400">
                  {loading ? "Cargando..." : "No hay logs. Use los filtros para buscar."}
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${tipoColors[log.tipo] || ""}`}>
                      {log.tipo}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{log.doc}</td>
                  <td className="px-4 py-3 text-xs text-zinc-500">{formatDate(log.fecha)}</td>
                  <td className="px-4 py-3">{log.detalle}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
