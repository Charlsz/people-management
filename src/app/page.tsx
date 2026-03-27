// app/page.tsx
'use client';

import { useFormStatus } from 'react-dom';
import { loginAction } from '@/Auth/Auth.';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

function LoginForm() {
  const router = useRouter();
  const { pending } = useFormStatus();
  const [error, setError] = useState<string | null>(null);
  

  async function handleSubmit(formData: FormData) {
    const result = await loginAction(formData);
    
    if (result.error) {
      setError(result.error);
    } else {
      // Login exitoso
      setError(null);
      // Redirigir al dashboard
      router.push('/dashboard/query');
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <input 
        type="email" 
        name="email"
        placeholder="Email" 
        className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
        required
      />
      <input 
        type="password" 
        name="password"
        placeholder="Contraseña" 
        className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
        required
      />
      
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}
      
      <button 
        type="submit"
        disabled={pending}
        className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {pending ? 'Ingresando...' : 'Entrar'}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100 font-sans">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-slate-800">Iniciar Sesión</h1>
        <LoginForm />
      </div>
    </main>
  );
}