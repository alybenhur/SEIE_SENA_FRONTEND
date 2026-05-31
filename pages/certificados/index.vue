<template>
  <NuxtLayout name="admin">
    <h2 class="text-xl font-bold text-gray-800 mb-6">Mis certificados</h2>
    <div v-if="!certificados.length" class="card text-center py-12 text-gray-400">Sin certificados emitidos aun.</div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div v-for="c in certificados" :key="c._id" class="card border-l-4" :style="{ borderColor: colorTipo(c.tipo) }">
        <div class="flex items-start justify-between gap-4">
          <div>
            <span class="text-xs font-semibold uppercase tracking-wide mb-1 block" :style="{ color: colorTipo(c.tipo) }">
              {{ labelTipo(c.tipo) }}
            </span>
            <h3 class="font-semibold text-gray-800">{{ c.eventoRef?.nombre }}</h3>
            <p v-if="c.proyectoRef" class="text-sm text-gray-500 mt-1">{{ c.proyectoRef.titulo }}</p>
            <p class="text-xs text-gray-400 mt-2">Emitido: {{ formatFecha(c.fechaEmision) }}</p>
            <p class="text-xs text-gray-300 font-mono mt-0.5">{{ c.codigo }}</p>
          </div>
          <a :href="apiBase + '/certificados/pdf/' + c.codigo" target="_blank"
            class="btn-primary bg-teal-600 hover:bg-teal-700 text-xs shrink-0 mt-1">
            Descargar PDF
          </a>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({ roles: ['investigador','emprendedor','lider_semillero','evaluador','admin'] })
const { get } = useApi()
const config = useRuntimeConfig()
const apiBase = config.public.apiBase
const certificados = ref([])
const tiposLabel: Record<string, string> = { participacion: 'Participacion', evaluador: 'Evaluador', ponente: 'Ponente', mejor_proyecto: 'Mejor Proyecto' }
const tiposColor: Record<string, string> = { participacion: '#0d9488', evaluador: '#2563eb', ponente: '#7c3aed', mejor_proyecto: '#ea580c' }
const labelTipo = (t: string) => tiposLabel[t] || t
const colorTipo = (t: string) => tiposColor[t] || '#64748b'
const parseFecha = (f: string) => f.includes('T') ? new Date(f) : new Date(f + 'T12:00:00')
const formatFecha = (f: string) => f ? parseFecha(f).toLocaleDateString('es-CO') : ''
onMounted(async () => {
  if (!localStorage.getItem('token')) { navigateTo('/login'); return }
  certificados.value = await get('/certificados/mis-certificados') as any
})
</script>