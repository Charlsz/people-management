import Link from "next/link";

const menuItems = [
  {
    href: "/personas/crear",
    title: "Crear Persona",
    description: "Registrar una nueva persona en el sistema",
    icon: "➕",
  },
  {
    href: "/personas/modificar",
    title: "Modificar Persona",
    description: "Actualizar datos de una persona existente",
    icon: "✏️",
  },
  {
    href: "/personas/consultar",
    title: "Consultar Persona",
    description: "Buscar y ver datos de personas registradas",
    icon: "🔍",
  },
  {
    href: "/personas/borrar",
    title: "Borrar Persona",
    description: "Eliminar registro de una persona",
    icon: "🗑️",
  },
  {
    href: "/consultar-natural",
    title: "Consulta Natural (n8n)",
    description: "Consulta con lenguaje natural vía RAG/n8n",
    icon: "🤖",
  },
  {
    href: "/logs",
    title: "Logs del Sistema",
    description: "Ver historial de transacciones del sistema",
    icon: "📋",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col items-center gap-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Gestión de Datos Personales
        </h1>
        <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
          Seleccione una opción del menú
        </p>
      </div>

      <div className="grid w-full max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex flex-col items-center gap-3 rounded-xl border border-zinc-200 bg-white p-6 text-center shadow-sm transition-all hover:border-zinc-400 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-600"
          >
            <span className="text-4xl">{item.icon}</span>
            <h2 className="text-lg font-semibold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400">
              {item.title}
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {item.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
