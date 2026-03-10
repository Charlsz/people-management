"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { personaSchema, PersonaFormData, GENERO_OPTIONS, TIPO_DOC_OPTIONS } from "@/lib/validators";
import { useState, useRef } from "react";

interface PersonaFormProps {
  defaultValues?: Partial<PersonaFormData>;
  onSubmit: (data: PersonaFormData, fotoBase64: string | null) => Promise<void>;
  submitLabel: string;
  readOnly?: boolean;
  disableDocumento?: boolean;
}

export function PersonaForm({
  defaultValues,
  onSubmit,
  submitLabel,
  readOnly = false,
  disableDocumento = false,
}: PersonaFormProps) {
  const [fotoBase64, setFotoBase64] = useState<string | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PersonaFormData>({
    resolver: zodResolver(personaSchema),
    defaultValues: {
      tipo_documento: undefined,
      nro_documento: "",
      primer_nombre: "",
      segundo_nombre: "",
      apellidos: "",
      fecha_nacimiento: "",
      genero: undefined,
      email: "",
      celular: "",
      ...defaultValues,
    },
  });

  function handleFotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      alert("La foto no debe superar 2MB");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setFotoPreview(result);
      // Extract base64 data after the comma
      setFotoBase64(result.split(",")[1]);
    };
    reader.readAsDataURL(file);
  }

  async function handleFormSubmit(data: PersonaFormData) {
    setSubmitting(true);
    try {
      await onSubmit(data, fotoBase64);
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 disabled:opacity-60";
  const labelClass = "block text-sm font-medium text-zinc-700 dark:text-zinc-300";
  const errorClass = "mt-1 text-xs text-red-500";

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Tipo documento */}
        <div>
          <label className={labelClass}>Tipo de Documento *</label>
          <select {...register("tipo_documento")} disabled={readOnly} className={inputClass}>
            <option value="">Seleccionar...</option>
            {TIPO_DOC_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          {errors.tipo_documento && <p className={errorClass}>{errors.tipo_documento.message}</p>}
        </div>

        {/* Número documento */}
        <div>
          <label className={labelClass}>Nro. Documento *</label>
          <input
            type="text"
            maxLength={10}
            {...register("nro_documento")}
            disabled={readOnly || disableDocumento}
            className={inputClass}
            placeholder="Máximo 10 dígitos"
          />
          {errors.nro_documento && <p className={errorClass}>{errors.nro_documento.message}</p>}
        </div>

        {/* Primer nombre */}
        <div>
          <label className={labelClass}>Primer Nombre *</label>
          <input
            type="text"
            maxLength={30}
            {...register("primer_nombre")}
            disabled={readOnly}
            className={inputClass}
          />
          {errors.primer_nombre && <p className={errorClass}>{errors.primer_nombre.message}</p>}
        </div>

        {/* Segundo nombre */}
        <div>
          <label className={labelClass}>Segundo Nombre</label>
          <input
            type="text"
            maxLength={30}
            {...register("segundo_nombre")}
            disabled={readOnly}
            className={inputClass}
          />
          {errors.segundo_nombre && <p className={errorClass}>{errors.segundo_nombre.message}</p>}
        </div>

        {/* Apellidos */}
        <div className="sm:col-span-2">
          <label className={labelClass}>Apellidos *</label>
          <input
            type="text"
            maxLength={60}
            {...register("apellidos")}
            disabled={readOnly}
            className={inputClass}
          />
          {errors.apellidos && <p className={errorClass}>{errors.apellidos.message}</p>}
        </div>

        {/* Fecha nacimiento */}
        <div>
          <label className={labelClass}>Fecha de Nacimiento *</label>
          <input
            type="date"
            {...register("fecha_nacimiento")}
            disabled={readOnly}
            className={inputClass}
          />
          {errors.fecha_nacimiento && <p className={errorClass}>{errors.fecha_nacimiento.message}</p>}
        </div>

        {/* Género */}
        <div>
          <label className={labelClass}>Género *</label>
          <select {...register("genero")} disabled={readOnly} className={inputClass}>
            <option value="">Seleccionar...</option>
            {GENERO_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          {errors.genero && <p className={errorClass}>{errors.genero.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label className={labelClass}>Email *</label>
          <input
            type="email"
            {...register("email")}
            disabled={readOnly}
            className={inputClass}
            placeholder="correo@ejemplo.com"
          />
          {errors.email && <p className={errorClass}>{errors.email.message}</p>}
        </div>

        {/* Celular */}
        <div>
          <label className={labelClass}>Celular *</label>
          <input
            type="text"
            maxLength={10}
            {...register("celular")}
            disabled={readOnly}
            className={inputClass}
            placeholder="10 dígitos"
          />
          {errors.celular && <p className={errorClass}>{errors.celular.message}</p>}
        </div>

        {/* Foto */}
        {!readOnly && (
          <div className="sm:col-span-2">
            <label className={labelClass}>Foto (máx 2MB)</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFotoChange}
              className="mt-1 block w-full text-sm text-zinc-500 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-zinc-700 dark:file:text-zinc-300"
            />
            {fotoPreview && (
              <img
                src={fotoPreview}
                alt="Preview"
                className="mt-2 h-24 w-24 rounded-lg object-cover"
              />
            )}
          </div>
        )}
      </div>

      {!readOnly && (
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 sm:w-auto"
        >
          {submitting ? "Procesando..." : submitLabel}
        </button>
      )}
    </form>
  );
}
