import type { Metadata } from "next";
import "./globals.css";



export const metadata: Metadata = {
  title: "CRUD Diseño",
  description: "Un proyecto de CRUD con diseño moderno usando Next.js y Tailwind CSS",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="antialiased"> 
        {children} 
      </body>
    </html>
  );
}