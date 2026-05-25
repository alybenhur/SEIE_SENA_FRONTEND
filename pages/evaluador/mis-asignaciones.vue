<template>
  <NuxtLayout name="evaluador">

    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-800">Mis proyectos asignados</h2>
      <p class="text-sm text-gray-500 mt-1">Proyectos que tienes asignados para evaluación.</p>
    </div>

    <!-- Cargando -->
    <div v-if="cargando" class="text-center py-16 text-gray-400 text-sm">Cargando proyectos...</div>

    <!-- Sin proyectos -->
    <div v-else-if="!proyectos.length"
      class="bg-white rounded-2xl border border-gray-200 shadow-sm text-center py-16 text-gray-400">
      <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
      </svg>
      <p class="font-medium">No tienes proyectos asignados aún.</p>
      <p class="text-xs mt-1">El coordinador te notificará cuando tengas proyectos para evaluar.</p>
    </div>

    <!-- Lista de proyectos -->
    <div v-else class="space-y-5">
      <div v-for="p in proyectos" :key="p._id"
        class="rounded-2xl overflow-hidden shadow-md border border-gray-200 bg-white">

        <!-- ── Cabecera oscura ── -->
        <div class="px-6 py-4 flex flex-wrap items-center justify-between gap-3 card-header">
          <div class="flex-1 min-w-0">
            <h3 class="font-bold text-white text-base leading-snug">{{ p.titulo }}</h3>
            <div class="flex flex-wrap items-center gap-2 mt-1.5">
              <span :class="p.tipo === 'investigacion' ? 'bg-teal-400/20 text-teal-200 border-teal-400/30' : 'bg-orange-400/20 text-orange-200 border-orange-400/30'"
                class="px-2.5 py-0.5 rounded-full text-xs font-medium capitalize border">
                {{ p.tipo }}
              </span>
              <span class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-400/20 text-sky-200 border border-sky-400/30">
                {{ p.eventoRef?.nombre || '—' }}
              </span>
            </div>
          </div>
          <!-- Badge de estado -->
          <span :class="estadoClass(p.estado)"
            class="px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap uppercase tracking-wide">
            {{ p.estado?.replace(/_/g, ' ') }}
          </span>
        </div>

        <!-- ── Cuerpo ── -->
        <div class="px-6 py-5 space-y-5">

          <!-- Sección: Información del proyecto -->
          <div>
            <div class="flex items-center gap-2 mb-3">
              <svg class="w-4 h-4 text-green-600 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
              </svg>
              <span class="text-xs font-bold text-gray-600 uppercase tracking-widest">Información del proyecto</span>
              <div class="flex-1 h-px bg-gray-200 ml-1"></div>
            </div>

            <div class="rounded-xl border border-gray-100 bg-gray-50/60 px-4 py-3 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <div class="flex gap-2">
                <span class="text-gray-400 w-24 shrink-0">Institución</span>
                <span class="text-gray-700 font-medium">{{ p.institucion || '—' }}</span>
              </div>
              <div class="flex gap-2">
                <span class="text-gray-400 w-24 shrink-0">Área</span>
                <span class="text-gray-700 font-medium">{{ p.area || '—' }}</span>
              </div>
              <div class="flex gap-2">
                <span class="text-gray-400 w-24 shrink-0">Categoría</span>
                <span class="text-gray-700 font-medium capitalize">{{ p.categoria?.replace('_', ' ') || '—' }}</span>
              </div>
              <div class="flex gap-2">
                <span class="text-gray-400 w-24 shrink-0">Semillero</span>
                <span class="text-gray-700 font-medium">{{ p.semilleroNombre || p.semilleroRef?.nombre || '—' }}</span>
              </div>
              <div class="flex gap-2">
                <span class="text-gray-400 w-24 shrink-0">Autor</span>
                <span class="text-gray-700 font-medium">{{ p.autorRef?.nombreCompleto || '—' }}</span>
              </div>
              <div v-if="p.lineaInvestigacion" class="flex gap-2">
                <span class="text-gray-400 w-24 shrink-0">Línea</span>
                <span class="text-gray-700 font-medium">{{ p.lineaInvestigacion }}</span>
              </div>
            </div>
          </div>

          <!-- Botón ver detalle -->
          <button @click="toggleDetalle(p._id)"
            class="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-green-700 hover:text-green-900 transition-colors select-none group">
            <span class="flex items-center justify-center w-5 h-5 rounded-full border border-green-300 group-hover:border-green-600 transition-colors">
              <svg class="w-3 h-3 transition-transform duration-200" :class="detalleAbierto === p._id ? 'rotate-180' : ''"
                fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="m19 9-7 7-7-7" />
              </svg>
            </span>
            {{ detalleAbierto === p._id ? 'Ocultar detalle' : 'Ver detalle' }}
          </button>

          <!-- Sección colapsable: Resumen + Palabras clave -->
          <div v-if="detalleAbierto === p._id" class="space-y-5">

            <!-- Resumen -->
            <div>
              <div class="flex items-center gap-2 mb-3">
                <svg class="w-4 h-4 text-green-600 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
                <span class="text-xs font-bold text-gray-600 uppercase tracking-widest">Resumen</span>
                <div class="flex-1 h-px bg-gray-200 ml-1"></div>
              </div>
              <div class="rounded-xl border border-gray-100 bg-gray-50/60 px-4 py-3">
                <p class="text-sm text-gray-700 leading-relaxed">{{ p.resumen }}</p>
              </div>
            </div>

            <!-- Palabras clave -->
            <div v-if="p.palabrasClaveArr?.length">
              <div class="flex items-center gap-2 mb-3">
                <svg class="w-4 h-4 text-green-600 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6Z" />
                </svg>
                <span class="text-xs font-bold text-gray-600 uppercase tracking-widest">Palabras clave</span>
                <div class="flex-1 h-px bg-gray-200 ml-1"></div>
              </div>
              <div class="flex flex-wrap gap-2">
                <span v-for="kw in p.palabrasClaveArr" :key="kw"
                  class="px-3 py-1 bg-green-50 text-green-700 border border-green-200 text-xs rounded-full font-semibold">
                  {{ kw }}
                </span>
              </div>
            </div>

          </div>
        </div>

        <!-- ── Footer de acciones ── -->
        <div class="px-6 py-3 bg-gray-50 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">

          <!-- Descargar documento -->
          <a v-if="p.urlDocumento" :href="p.urlDocumento" target="_blank"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-300 text-gray-600 hover:border-green-400 hover:text-green-700 transition-colors">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Descargar documento
          </a>
          <span v-else class="text-xs text-gray-400 italic">Sin documento adjunto</span>

          <!-- Evaluado -->
          <span v-if="p.estado === 'evaluado'"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-purple-100 text-purple-700 border border-purple-200">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
            Evaluación completada
          </span>

          <!-- Sustentando → puede evaluar -->
          <NuxtLink v-else-if="p.estado === 'sustentando'" :to="`/evaluador/evaluar/${p._id}`"
            class="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold text-white btn-evaluar transition-all hover:shadow-md">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>
            Evaluar proyecto
          </NuxtLink>

          <!-- Esperando sustentación -->
          <span v-else
            class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gray-100 text-gray-500 border border-gray-200">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            Esperando sustentación
          </span>

        </div>
      </div>
    </div>

  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({ roles: ['evaluador'] })

const { get } = useApi()
const proyectos = ref<any[]>([])
const cargando = ref(true)
const detalleAbierto = ref<string | null>(null)

function toggleDetalle(id: string) {
  detalleAbierto.value = detalleAbierto.value === id ? null : id
}

const estadoColors: Record<string, string> = {
  evaluador_asignado: 'bg-indigo-500/20 text-indigo-200 border border-indigo-400/30',
  sustentando:        'bg-orange-500/20 text-orange-200 border border-orange-400/30',
  en_evaluacion:      'bg-blue-500/20 text-blue-200 border border-blue-400/30',
  evaluado:           'bg-purple-500/20 text-purple-200 border border-purple-400/30',
}
const estadoClass = (e: string) => estadoColors[e] || 'bg-white/10 text-white/60 border border-white/20'

onMounted(async () => {
  if (!localStorage.getItem('token')) { navigateTo('/login'); return }
  try {
    proyectos.value = await get<any[]>('/proyectos/mis-asignaciones') ?? []
  } finally {
    cargando.value = false
  }
})
</script>

<style scoped>
.card-header {
  background: linear-gradient(100deg, #1a3a1a 0%, #1e5c2a 55%, #2d8a3e 100%);
}

.btn-evaluar {
  background: linear-gradient(90deg, #1e5c2a 0%, #2d8a3e 100%);
}
.btn-evaluar:hover {
  background: linear-gradient(90deg, #164d22 0%, #237033 100%);
}
</style>
