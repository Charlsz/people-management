"use client";

import { useState, useRef, useEffect } from "react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function ConsultarNaturalPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // n8n webhook URL - configure in .env
  const N8N_WEBHOOK_URL = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || "http://localhost:5678/webhook/chat";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();
      const answer = data.output || data.response || data.text || "Sin respuesta del agente.";

      setMessages((prev) => [...prev, { role: "assistant", content: answer }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error: No se pudo conectar con n8n. Verifique que el servicio esté activo." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col" style={{ height: "calc(100vh - 200px)" }}>
      <h1 className="mb-4 text-2xl font-bold">🤖 Consulta Natural (RAG / n8n)</h1>
      <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
        Consulta información de personas usando lenguaje natural. Powered by n8n + Supabase pgvector.
      </p>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
        {messages.length === 0 && (
          <p className="text-center text-sm text-zinc-400">
            Haz una pregunta como: &quot;¿Cuántas personas tienen cédula de ciudadanía?&quot;
          </p>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-3 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-xl px-4 py-2 text-sm ${
                msg.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-zinc-800 shadow-sm dark:bg-zinc-800 dark:text-zinc-200"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="rounded-xl bg-white px-4 py-2 text-sm text-zinc-500 shadow-sm dark:bg-zinc-800">
              Pensando...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="mt-3 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe tu pregunta..."
          className="flex-1 rounded-lg border border-zinc-300 px-4 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}
