export const SEMILLEROS_PREDETERMINADOS = [
  'AGROPEC',
  'BIOSALUD',
  'BIOTRONICO',
  'CONSTRUYENDO',
  'ECOSPROG',
  'FUSOST',
  'INNOVA-T',
  'INNOVARIUM',
  'INNOVAT',
  'INNOVATECH',
  'JOINCOR',
  'JOKMAH',
  'KAYROS',
  'PSICOSAHAGUN',
  'SCIAC',
  'SEINCAMP',
  'Semillero de Investigación en Ciencias Ambientales SICAM',
  'Semillero de investigación Futuro Sostenible (FUSOST)',
  'Semillero Dechado Nivel 1',
  'SICAM',
  'SIEMA',
  'SIIAP',
  'SINCONT',
  'SIPCOB',
  'SYSTEM',
  'TICREATION',
].sort((a, b) => a.localeCompare(b, 'es'))

// Composable dinámico — carga desde la API y cachea con useState
export function useSemilleros() {
  const listaSemilleros = useState<string[]>('semilleros-list', () => [])

  const recargar = async () => {
    const config = useRuntimeConfig()
    const data = await $fetch<{ nombre: string; activo: boolean }[]>(
      `${config.public.apiBase}/semilleros`,
    )
    listaSemilleros.value = data
      .filter((s) => s.activo)
      .map((s) => s.nombre)
      .sort((a, b) => a.localeCompare(b, 'es'))
  }

  onMounted(() => {
    if (listaSemilleros.value.length === 0) recargar().catch(() => {})
  })

  return { listaSemilleros, recargar }
}
