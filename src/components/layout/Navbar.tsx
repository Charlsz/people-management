import Link from "next/link";

export function Navbar() {
  return (
    <nav className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-bold text-foreground">
          📋 Gestión Personas
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/personas/crear" className="hover:text-blue-600 dark:hover:text-blue-400">Crear</Link>
          <Link href="/personas/modificar" className="hover:text-blue-600 dark:hover:text-blue-400">Modificar</Link>
          <Link href="/personas/consultar" className="hover:text-blue-600 dark:hover:text-blue-400">Consultar</Link>
          <Link href="/personas/borrar" className="hover:text-blue-600 dark:hover:text-blue-400">Borrar</Link>
          <Link href="/consultar-natural" className="hover:text-blue-600 dark:hover:text-blue-400">RAG</Link>
          <Link href="/logs" className="hover:text-blue-600 dark:hover:text-blue-400">Logs</Link>
          <Link
            href="/login"
            className="rounded-lg bg-foreground px-3 py-1.5 text-background transition-colors hover:bg-zinc-700 dark:hover:bg-zinc-300"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}
