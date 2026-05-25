import type { EjeTematico, Evento, Semillero } from '~/types'

export function useRegistroData() {
  const { get } = useApi()

  const eventos = ref<Evento[]>([])
  const semilleros = ref<Semillero[]>([])
  const ejes = ref<EjeTematico[]>([])
  const cargando = ref(false)

  async function cargarEventosActivos() {
    eventos.value = await get<Evento[]>('/eventos/activos')
  }

  async function buscarSemilleros(q: string) {
    if (q.length < 2) { semilleros.value = []; return }
    semilleros.value = await get<Semillero[]>(`/semilleros?q=${encodeURIComponent(q)}`)
  }

  async function cargarEjes() {
    ejes.value = await get<EjeTematico[]>('/ejes-tematicos')
  }

  async function buscarInstituciones(q: string) {
    if (q.length < 2) return []
    return get<{ _id: string; nombre: string }[]>(`/instituciones?q=${encodeURIComponent(q)}`)
  }

  return { eventos, semilleros, ejes, cargando, cargarEventosActivos, buscarSemilleros, cargarEjes, buscarInstituciones }
}