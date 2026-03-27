// context/UiContext.tsx
"use client";
import { createContext, useContext, useState, ReactNode } from 'react';

type Vista = 'tabla' | 'logs';

interface UiContextType {
  vistaActual: Vista;
  setVistaActual: (vista: Vista) => void;
  botonEncendido: boolean;
  setBotonEncendido: (estado: boolean) => void;
}

const UiContext = createContext<UiContextType | undefined>(undefined);

export const UiProvider = ({ children }: { children: ReactNode }) => {
  const [vistaActual, setVistaActual] = useState<Vista>('tabla');
  const [botonEncendido, setBotonEncendido] = useState(true);

  return (
    <UiContext.Provider value={{ vistaActual, setVistaActual, botonEncendido, setBotonEncendido }}>
      {children}
    </UiContext.Provider>
  );
};

export const useUi = () => {
  const context = useContext(UiContext);
  if (!context) throw new Error("useUi debe usarse dentro de UiProvider");
  return context;
};