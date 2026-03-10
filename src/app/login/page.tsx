"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithOtp({ email });

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage("Revisa tu correo para el enlace de acceso.");
    }
    setLoading(false);
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-sm space-y-6 rounded-xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="text-center text-2xl font-bold">Iniciar Sesión</h1>

        <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
          Ingresa tu correo y te enviaremos un enlace mágico para acceder.
        </p>

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
              placeholder="correo@ejemplo.com"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Enviando..." : "Enviar enlace mágico"}
          </button>
        </form>

        {message && (
          <p className="text-center text-sm text-blue-600 dark:text-blue-400">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
