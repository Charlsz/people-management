'use server'

export async function loginAction(formData: FormData) {
  const email = formData.get('email');
  const password = formData.get('password');

  try {
    // 1. Petición a ROBLE
    const response = await fetch('https://roble-api.openlab.uninorte.edu.co/auth/crudroles_c6b6d152d6/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' }
    });

    const data = await response.json();
    console.log('Respuesta de ROBLE:', data);

    if(response.ok) {
      // 2. Guardar token en cookie (ejemplo con Next.js)
      // Aquí podrías usar cookies o cualquier método de almacenamiento que prefieras
      // Para este ejemplo, simplemente retornamos el token al cliente
      return { token: data.token };
    } else {
        return { error: data.message || 'Error en autenticación' };
    }
    
  } catch (error) {
    console.error('Error en login:', error);
    return { error: 'Error al conectar con el servidor' };
  }
}