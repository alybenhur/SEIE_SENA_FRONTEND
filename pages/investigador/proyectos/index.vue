<template>
  <NuxtLayout name="investigador">

    <!-- Cabecera -->
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-gray-800">Módulo Proyectos</h2>

      <!-- Sin eventos disponibles -->
      <div v-if="!cargando && sinEventos"
        class="flex items-center gap-2 px-4 py-2 rounded-lg text-amber-700 text-sm font-medium bg-amber-50 border border-amber-200 cursor-not-allowed select-none"
        title="No existen eventos con registro abierto">
        <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
        </svg>
        Sin eventos disponibles
      </div>

      <!-- Con eventos disponibles -->
      <NuxtLink v-else-if="!cargando" to="/investigador/nuevo-proyecto"
        class="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-semibold shadow hover:shadow-md transition-all"
        style="background: linear-gradient(135deg, #2563eb, #1d4ed8)">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
        </svg>
        NUEVO PROYECTO
      </NuxtLink>
    </div>

    <!-- Buscador -->
    <div class="bg-white rounded-xl border border-gray-200 p-5 mb-6 shadow-sm">
      <input
        v-model="q"
        class="w-full text-sm text-gray-700 bg-transparent outline-none border-b border-gray-200 pb-2 mb-3"
        placeholder="Buscar por título, categoría, área, zona, programa, institución o semillero"
        @keyup.enter="buscar"
      />
      <button @click="buscar" class="text-blue-600 text-sm font-semibold tracking-wide hover:text-blue-800 transition-colors">
        BUSCAR
      </button>
    </div>

    <!-- Tabla -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-gray-100">
            <th class="text-left px-5 py-3 font-semibold text-gray-700">Título</th>
            <th class="text-left px-4 py-3 font-semibold text-gray-700">Tipo</th>
            <th class="text-left px-4 py-3 font-semibold text-gray-700">Área</th>
            <th class="text-left px-4 py-3 font-semibold text-gray-700">Institución/Semillero</th>
            <th class="text-left px-4 py-3 font-semibold text-gray-700">Estado</th>
            <th class="text-left px-4 py-3 font-semibold text-gray-700">Equipo</th>
            <th class="text-left px-4 py-3 font-semibold text-gray-700">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in filtrados" :key="p._id" class="border-b border-gray-50 hover:bg-gray-50 transition-colors">
            <td class="px-5 py-3 font-medium text-gray-800 max-w-[200px] truncate" :title="p.titulo">{{ p.titulo }}</td>
            <td class="px-4 py-3">
              <span :class="p.tipo === 'investigacion' ? 'bg-teal-100 text-teal-700' : 'bg-orange-100 text-orange-700'"
                class="px-2 py-0.5 rounded-full text-xs font-medium capitalize">
                {{ p.tipo }}
              </span>
            </td>
            <td class="px-4 py-3 text-gray-500 text-xs max-w-[140px] truncate" :title="p.area">{{ p.area || '—' }}</td>
            <td class="px-4 py-3 text-gray-500 text-xs max-w-[160px] truncate" :title="p.institucion || p.semilleroNombre">
              {{ p.institucion || p.semilleroNombre || '—' }}
            </td>
            <td class="px-4 py-3">
              <span :class="estadoClass(p.estado)" class="px-2 py-0.5 rounded-full text-xs font-medium capitalize">
                {{ p.estado?.replace('_', ' ') }}
              </span>
            </td>
            <td class="px-4 py-3 text-gray-500 text-xs">{{ p.autoresPrincipales?.length ? `${p.autoresPrincipales.length} autor(es)` : '—' }}</td>
            <td class="px-4 py-3">
              <NuxtLink :to="`/investigador/proyectos/${p._id}`" class="text-blue-600 hover:text-blue-800 text-xs underline">
                Ver detalle
              </NuxtLink>
            </td>
          </tr>
          <tr v-if="!filtrados.length">
            <td colspan="7" class="px-5 py-10 text-center text-gray-400">No hay proyectos para mostrar.</td>
          </tr>
        </tbody>
      </table>
    </div>

  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({ roles: ['investigador'] })

const { get } = useApi()
const proyectos = ref<any[]>([])
const q = ref('')
const cargando = ref(true)
const sinEventos = ref(false)

const estadoColors: Record<string, string> = {
  enviado:       'bg-yellow-100 text-yellow-700',
  en_evaluacion: 'bg-blue-100 text-blue-700',
  evaluado:      'bg-purple-100 text-purple-700',
  aprobado:      'bg-green-100 text-green-700',
  rechazado:     'bg-red-100 text-red-700',
}
const estadoClass = (e: string) => estadoColors[e] || 'bg-gray-100 text-gray-500'

const filtrados = computed(() => {
  if (!q.value.trim()) return proyectos.value
  const term = q.value.toLowerCase()
  return proyectos.value.filter((p) =>
    [p.titulo, p.tipo, p.area, p.institucion, p.semilleroNombre, p.palabrasClave]
      .filter(Boolean)
      .some((v) => String(v).toLowerCase().includes(term)),
  )
})

function buscar() {}

onMounted(async () => {
  if (!localStorage.getItem('token')) { navigateTo('/login'); return }
  const [mis, eventos] = await Promise.all([
    get<any[]>('/proyectos/mis-proyectos'),
    get<any[]>('/eventos/registro-abierto'),
  ])
  proyectos.value = mis
  sinEventos.value = eventos.length === 0
  cargando.value = false
})
</script>
