import { supabase } from './supabase'

export async function uploadFoto(numeroDocumento: string, file: File): Promise<string> {
  const extension = file.name.split('.').pop()
  const path = `${numeroDocumento}.${extension}`

  const { error } = await supabase.storage
    .from('fotos-personas')
    .upload(path, file, { upsert: true })

  if (error) throw error

  const { data } = supabase.storage
    .from('fotos-personas')
    .getPublicUrl(path)

  return data.publicUrl
}

export async function deleteFoto(numeroDocumento: string) {
  const extensiones = ['jpg', 'jpeg', 'png', 'webp']

  for (const ext of extensiones) {
    await supabase.storage
      .from('fotos-personas')
      .remove([`${numeroDocumento}.${ext}`])
  }
}