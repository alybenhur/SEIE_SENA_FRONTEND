<template>
  <NuxtLayout name="admin">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-bold text-gray-800">Proyectos presentados</h2>
      <div class="flex gap-3">
        <select v-model="filtroEje" class="text-sm border border-gray-300 rounded-md px-3 py-1.5">
          <option value="">Todos los ejes</option>
          <option v-for="n in 7" :key="n" :value="n">Eje {{ n }}</option>
        </select>
        <select v-model="filtroEstado" class="text-sm border border-gray-300 rounded-md px-3 py-1.5">
          <option value="">Todos los estados</option>
          <option value="enviado">Enviado</option>
          <option value="en_evaluacion">En evaluacion</option>
          <option value="evaluado">Evaluado</option>
          <option value="aprobado">Aprobado</option>
          <option value="rechazado">Rechazado</option>
        </select>
        <select v-model="filtroTipo" class="text-sm border border-gray-300 rounded-md px-3 py-1.5">
          <option value="">Todos los tipos</option>
          <option value="investigacion">Investigacion</option>
          <option value="emprendimiento">Emprendimiento</option>
        </select>
      </div>
    </div>

    <div class="card overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-gray-200 text-left text-gray-500">
            <th class="pb-3 pr-4 font-medium">Titulo</th>
            <th class="pb-3 pr-4 font-medium">Autor</th>
            <th class="pb-3 pr-4 font-medium">Tipo</th>
            <th class="pb-3 pr-4 font-medium">Eje</th>
            <th class="pb-3 pr-4 font-medium">Estado</th>
            <th class="pb-3 pr-4 font-medium">Puntaje</th>
            <th class="pb-3 font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in proyectos" :key="p._id" class="border-b border-gray-100 hover:bg-gray-50">
            <td class="py-3 pr-4">
              <div class="font-medium max-w-xs truncate" :title="p.titulo">{{ p.titulo }}</div>
              <div class="text-xs text-gray-400">{{ p.eventoRef?.nombre }}</div>
            </td>
            <td class="py-3 pr-4">
              <div>{{ p.autorRef?.nombreCompleto }}</div>
              <div class="text-xs text-gray-400">{{ p.autorRef?.email }}</div>
            </td>
            <td class="py-3 pr-4">
              <span :class="p.tipo === 'investigacion' ? 'bg-teal-100 text-teal-700' : 'bg-orange-100 text-orange-700'" class="text-xs px-2 py-0.5 rounded-full">{{ p.tipo }}</span>
            </td>
            <td class="py-3 pr-4 text-center">{{ p.ejeTematico }}</td>
            <td class="py-3 pr-4">
              <span :class="estadoClass(p.estado)" class="text-xs px-2 py-0.5 rounded-full">{{ p.estado }}</span>
            </td>
            <td class="py-3 pr-4 font-bold" :class="p.puntajeFinal >= 70 ? 'text-teal-600' : p.puntajeFinal ? 'text-orange-500' : 'text-gray-300'">
              {{ p.puntajeFinal ?? '---' }}
            </td>
            <td class="py-3">
              <button @click="abrirAsignar(p)" class="text-xs text-blue-600 underline mr-2">Asignar evaluador</button>
            </td>
          </tr>
          <tr v-if="!proyectos.length"><td colspan="7" class="py-8 text-center text-gray-400">No hay proyectos</td></tr>
        </tbody>
      </table>
    </div>

    <!-- Modal asignacion -->
    <div v-if="proyectoSeleccionado" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
        <h3 class="font-bold text-gray-800 mb-1">Asignar evaluador</h3>
        <p class="text-sm text-gray-500 mb-4">Proyecto: <strong>{{ proyectoSeleccionado.titulo }}</strong> (Eje {{ proyectoSeleccionado.ejeTematico }})</p>
        <div class="mb-4">
          <label class="form-label">Selecciona evaluador (Eje {{ proyectoSeleccionado.ejeTematico }})</label>
          <select v-model="evaluadorSeleccionado" class="form-input">
            <option value="">Selecciona un evaluador</option>
            <option v-for="e in evaluadoresCompatibles" :key="e._id" :value="e._id">
              {{ e.nombreCompleto }} — Ejes: {{ e.ejesTematicos?.join(', ') }}
            </option>
          </select>
        </div>
        <div class="mb-4">
          <label class="form-label">Nota para el evaluador (opcional)</label>
          <input v-model="notaAdmin" class="form-input" placeholder="Instrucciones especificas..." />
        </div>
        <p v-if="mensajeAsig" class="text-sm mb-3" :class="asigOk ? 'text-teal-700' : 'text-red-600'">{{ mensajeAsig }}</p>
        <div class="flex gap-3">
          <button @click="asignar" :disabled="!evaluadorSeleccionado || asignando" class="btn-primary bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 disabled:opacity-50">
            {{ asignando ? 'Asignando...' : 'Asignar' }}
          </button>
          <button @click="proyectoSeleccionado = null" class="text-sm text-gray-500 underline">Cancelar</button>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({ roles: ['admin'] })
const { get, post } = useApi()
const proyectos = ref([])
const evaluadores = ref([])
const filtroEje = ref('')
const filtroEstado = ref('')
const filtroTipo = ref('')
const proyectoSeleccionado = ref<any>(null)
const evaluadorSeleccionado = ref('')
const notaAdmin = ref('')
const mensajeAsig = ref('')
const asigOk = ref(true)
const asignando = ref(false)

const estadoClasses: Record<string, string> = { enviado: 'bg-yellow-100 text-yellow-700', en_evaluacion: 'bg-blue-100 text-blue-700', evaluado: 'bg-purple-100 text-purple-700', aprobado: 'bg-green-100 text-green-700', rechazado: 'bg-red-100 text-red-700' }
const estadoClass = (e: string) => estadoClasses[e] || 'bg-gray-100 text-gray-500'

const evaluadoresCompatibles = computed(() =>
  evaluadores.value.filter((e: any) =>
    !proyectoSeleccionado.value || e.ejesTematicos?.includes(proyectoSeleccionado.value.ejeTematico)
  )
)

async function cargar() {
  const params = new URLSearchParams()
  if (filtroEje.value) params.append('eje', filtroEje.value)
  if (filtroEstado.value) params.append('estado', filtroEstado.value)
  if (filtroTipo.value) params.append('tipo', filtroTipo.value)
  proyectos.value = await get(`/proyectos?${params}`) as any
}

function abrirAsignar(p: any) {
  proyectoSeleccionado.value = p
  evaluadorSeleccionado.value = ''
  notaAdmin.value = ''
  mensajeAsig.value = ''
}

async function asignar() {
  asignando.value = true
  mensajeAsig.value = ''
  try {
    await post('/asignaciones', {
      evaluadorRef: evaluadorSeleccionado.value,
      proyectoRef: proyectoSeleccionado.value._id,
      eventoRef: proyectoSeleccionado.value.eventoRef?._id || proyectoSeleccionado.value.eventoRef,
      notaAdmin: notaAdmin.value,
    })
    asigOk.value = true
    mensajeAsig.value = 'Evaluador asignado exitosamente.'
    await cargar()
    setTimeout(() => { proyectoSeleccionado.value = null }, 1500)
  } catch (e: any) { asigOk.value = false; mensajeAsig.value = e?.data?.message || 'Error al asignar.' }
  finally { asignando.value = false }
}

watch([filtroEje, filtroEstado, filtroTipo], cargar)
onMounted(async () => {
  if (!localStorage.getItem('token')) { navigateTo('/login'); return }
  ;[, evaluadores.value] = await Promise.all([cargar(), get('/usuarios?rol=evaluador&estado=aprobado')]) as any
})
</script>