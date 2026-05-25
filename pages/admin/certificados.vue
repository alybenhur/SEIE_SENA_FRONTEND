<template>
  <NuxtLayout name="admin">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-bold text-gray-800">Certificados</h2>
    </div>

    <!-- Emision masiva -->
    <div class="card mb-6">
      <h3 class="text-base font-semibold text-gray-700 mb-4">Emision masiva de certificados</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="form-label">Evento</label>
          <select v-model="emision.eventoId" class="form-input">
            <option value="">Selecciona evento</option>
            <option v-for="e in eventos" :key="e._id" :value="e._id">{{ e.nombre }}</option>
          </select>
        </div>
        <div>
          <label class="form-label">Rol</label>
          <select v-model="emision.rol" class="form-input">
            <option value="investigador">Investigador</option>
            <option value="emprendedor">Emprendedor</option>
            <option value="evaluador">Evaluador</option>
            <option value="lider_semillero">Lider de Semillero</option>
          </select>
        </div>
        <div>
          <label class="form-label">Tipo de certificado</label>
          <select v-model="emision.tipo" class="form-input">
            <option value="participacion">Participacion</option>
            <option value="evaluador">Evaluador</option>
            <option value="ponente">Ponente</option>
          </select>
        </div>
      </div>
      <div class="flex items-center gap-4 mt-4">
        <button @click="emitirMasivo" :disabled="!emision.eventoId || emitiendoMasivo"
          class="btn-primary bg-teal-600 hover:bg-teal-700 focus:ring-teal-500 disabled:opacity-50">
          {{ emitiendoMasivo ? 'Emitiendo...' : 'Emitir certificados' }}
        </button>
        <span v-if="mensajeEmision" class="text-sm" :class="emisionOk ? 'text-teal-700' : 'text-red-600'">{{ mensajeEmision }}</span>
      </div>
    </div>

    <!-- Filtros -->
    <div class="flex gap-3 mb-4">
      <select v-model="filtroTipo" class="text-sm border border-gray-300 rounded-md px-3 py-1.5">
        <option value="">Todos los tipos</option>
        <option value="participacion">Participacion</option>
        <option value="evaluador">Evaluador</option>
        <option value="ponente">Ponente</option>
        <option value="mejor_proyecto">Mejor Proyecto</option>
      </select>
      <select v-model="filtroEvento" class="text-sm border border-gray-300 rounded-md px-3 py-1.5">
        <option value="">Todos los eventos</option>
        <option v-for="e in eventos" :key="e._id" :value="e._id">{{ e.nombre }}</option>
      </select>
    </div>

    <div class="card overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-gray-200 text-left text-gray-500">
            <th class="pb-3 pr-4 font-medium">Codigo</th>
            <th class="pb-3 pr-4 font-medium">Persona</th>
            <th class="pb-3 pr-4 font-medium">Tipo</th>
            <th class="pb-3 pr-4 font-medium">Evento</th>
            <th class="pb-3 pr-4 font-medium">Proyecto</th>
            <th class="pb-3 pr-4 font-medium">Emision</th>
            <th class="pb-3 font-medium">PDF</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in certificados" :key="c._id" class="border-b border-gray-100 hover:bg-gray-50">
            <td class="py-3 pr-4 font-mono text-xs text-gray-600">{{ c.codigo }}</td>
            <td class="py-3 pr-4">
              <div class="font-medium">{{ c.usuarioRef?.nombreCompleto }}</div>
              <div class="text-xs text-gray-400">{{ c.usuarioRef?.email }}</div>
            </td>
            <td class="py-3 pr-4">
              <span :style="{ backgroundColor: colorTipo(c.tipo) + '20', color: colorTipo(c.tipo) }" class="text-xs px-2 py-0.5 rounded-full font-medium">
                {{ labelTipo(c.tipo) }}
              </span>
            </td>
            <td class="py-3 pr-4 text-gray-600">{{ c.eventoRef?.nombre }}</td>
            <td class="py-3 pr-4 text-gray-500 text-xs max-w-xs truncate">{{ c.proyectoRef?.titulo || '---' }}</td>
            <td class="py-3 pr-4 text-gray-400 text-xs">{{ formatFecha(c.fechaEmision) }}</td>
            <td class="py-3">
              <a :href="apiBase + '/certificados/pdf/' + c.codigo" target="_blank" class="text-xs text-teal-600 underline">Descargar</a>
            </td>
          </tr>
          <tr v-if="!certificados.length"><td colspan="7" class="py-8 text-center text-gray-400">No hay certificados</td></tr>
        </tbody>
      </table>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({ roles: ['admin'] })
const { get, post } = useApi()
const config = useRuntimeConfig()
const apiBase = config.public.apiBase
const certificados = ref([])
const eventos = ref([])
const filtroTipo = ref('')
const filtroEvento = ref('')
const emitiendoMasivo = ref(false)
const mensajeEmision = ref('')
const emisionOk = ref(true)

const emision = reactive({ eventoId: '', rol: 'investigador', tipo: 'participacion' })

const tiposLabel: Record<string, string> = { participacion: 'Participacion', evaluador: 'Evaluador', ponente: 'Ponente', mejor_proyecto: 'Mejor Proyecto' }
const tiposColor: Record<string, string> = { participacion: '#0d9488', evaluador: '#2563eb', ponente: '#7c3aed', mejor_proyecto: '#ea580c' }
const labelTipo = (t: string) => tiposLabel[t] || t
const colorTipo = (t: string) => tiposColor[t] || '#64748b'
const formatFecha = (f: string) => f ? new Date(f).toLocaleDateString('es-CO') : ''

async function cargar() {
  const params = new URLSearchParams()
  if (filtroTipo.value) params.append('tipo', filtroTipo.value)
  if (filtroEvento.value) params.append('evento', filtroEvento.value)
  certificados.value = await get(`/certificados?${params}`) as any
}

async function emitirMasivo() {
  emitiendoMasivo.value = true
  mensajeEmision.value = ''
  try {
    const r = await post<any>('/certificados/emitir-masivo', emision) as any
    emisionOk.value = true
    mensajeEmision.value = `Se emitieron ${r.emitidos} certificados.`
    await cargar()
  } catch (e: any) { emisionOk.value = false; mensajeEmision.value = e?.data?.message || 'Error.' }
  finally { emitiendoMasivo.value = false }
}

watch([filtroTipo, filtroEvento], cargar)
onMounted(async () => {
  if (!localStorage.getItem('token')) { navigateTo('/login'); return }
  ;[, eventos.value] = await Promise.all([cargar(), get('/eventos')]) as any
})
</script>