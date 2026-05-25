export function useLineasInvestigacion() {
  const listaLineas = useState<string[]>('lineas-investigacion-list', () => [])

  const recargar = async () => {
    const config = useRuntimeConfig()
    const data = await $fetch<{ linea: string; activa: boolean }[]>(
      `${config.public.apiBase}/lineas-investigacion`,
    )
    listaLineas.value = data
      .filter((l) => l.activa)
      .map((l) => l.linea)
      .sort((a, b) => a.localeCompare(b, 'es'))
  }

  onMounted(() => {
    if (listaLineas.value.length === 0) recargar().catch(() => {})
  })

  return { listaLineas, recargar }
}
