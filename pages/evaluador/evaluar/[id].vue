<template>
  <NuxtLayout name="evaluador">

    <!-- Volver -->
    <NuxtLink to="/evaluador/mis-asignaciones"
      class="inline-flex items-center gap-1.5 text-sm text-green-700 hover:text-green-900 font-medium mb-6 transition-colors">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
      </svg>
      Volver a mis asignaciones
    </NuxtLink>

    <div v-if="cargando" class="text-center py-20 text-gray-400 text-sm">Cargando proyecto...</div>

    <template v-else-if="proyecto">

      <!-- Cabecera del proyecto -->
      <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-5">
        <div class="px-6 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3"
          style="background: linear-gradient(90deg,#f0faf4,#e6f4ea)">
          <div class="flex-1 min-w-0">
            <h2 class="text-lg font-bold text-gray-800">{{ proyecto.titulo }}</h2>
            <div class="flex flex-wrap items-center gap-2 mt-1">
              <span :class="proyecto.tipo === 'investigacion' ? 'bg-teal-100 text-teal-700' : 'bg-orange-100 text-orange-700'"
                class="px-2 py-0.5 rounded-full text-xs font-medium capitalize">{{ proyecto.tipo }}</span>
              <span v-if="proyecto.modalidadParticipacion"
                class="px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                {{ modalidadLabels[proyecto.modalidadParticipacion] || proyecto.modalidadParticipacion }}
              </span>
              <span class="px-2 py-0.5 rounded-full text-xs font-medium bg-sky-100 text-sky-700">
                {{ proyecto.eventoRef?.nombre || '—' }}
              </span>
              <span v-if="proyecto.lineaInvestigacion" class="text-xs text-gray-400">· {{ proyecto.lineaInvestigacion }}</span>
            </div>
          </div>
          <a v-if="proyecto.urlDocumento" :href="proyecto.urlDocumento" target="_blank"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-colors"
            style="background: linear-gradient(90deg,#1e5c2a,#2d8a3e)">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Descargar documento
          </a>
        </div>

        <div class="px-6 py-4 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1.5 text-sm">
          <p><span class="text-gray-400 w-32 inline-block align-top">Institución:</span><span class="text-gray-700">{{ proyecto.institucion || '—' }}</span></p>
          <p><span class="text-gray-400 w-32 inline-block align-top">Tipo de trabajo:</span><span class="text-gray-700">{{ modalidadLabels[proyecto.modalidadParticipacion] || '—' }}</span></p>
          <p><span class="text-gray-400 w-32 inline-block align-top">Línea:</span><span class="text-gray-700">{{ proyecto.lineaInvestigacion || '—' }}</span></p>
          <p><span class="text-gray-400 w-32 inline-block align-top">Regional:</span><span class="text-gray-700">{{ proyecto.regional || '—' }}</span></p>
          <p class="sm:col-span-2"><span class="text-gray-400 w-32 inline-block align-top">Autores:</span><span class="text-gray-700">{{ autoresDe(proyecto) }}</span></p>
        </div>

        <!-- Resumen colapsable -->
        <div class="px-6 pb-4">
          <button @click="verResumen = !verResumen"
            class="flex items-center gap-1.5 text-xs font-medium text-green-700 hover:text-green-900 transition-colors">
            <svg class="w-3.5 h-3.5 transition-transform duration-200" :class="verResumen ? 'rotate-180' : ''"
              fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="m19 9-7 7-7-7" />
            </svg>
            {{ verResumen ? 'Ocultar resumen' : 'Ver resumen' }}
          </button>
          <div v-if="verResumen" class="mt-3 border-t border-gray-100 pt-3">
            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Resumen</p>
            <p class="text-sm text-gray-700 leading-relaxed">{{ proyecto.resumen }}</p>
            <div v-if="proyecto.palabrasClaveArr?.length" class="flex flex-wrap gap-1.5 mt-3">
              <span v-for="kw in proyecto.palabrasClaveArr" :key="kw"
                class="px-2.5 py-0.5 bg-green-50 text-green-700 border border-green-100 text-xs rounded-full font-medium">
                {{ kw }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Rúbrica -->
      <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-5">
        <div class="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h3 class="text-base font-bold text-gray-800">
            Rúbrica de evaluación<span v-if="rubrica"> · {{ rubrica.nombre }}</span>
          </h3>
          <p class="text-xs text-gray-500 mt-0.5">Cada criterio se califica de 0 a 20 puntos. Puntaje máximo total: 100.</p>
        </div>

        <!-- Aviso: modalidad no asignada -->
        <div v-if="!modalidadAsignada" class="mx-6 mt-4 flex items-start gap-2 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-700">
          <svg class="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
          <span>Este proyecto aún no tiene una <strong>modalidad de participación</strong> asignada. Se muestra la rúbrica base de Póster; el coordinador debe asignar la modalidad correcta para aplicar la rúbrica oficial.</span>
        </div>

        <div class="px-6 py-4 space-y-4">
          <div v-for="(criterio, i) in criterios" :key="criterio.nombre"
            class="border border-gray-100 rounded-xl p-4 hover:border-green-200 transition-colors">
            <div class="flex items-start justify-between gap-4 mb-2">
              <div class="flex-1">
                <h4 class="font-semibold text-gray-800 text-sm">{{ criterio.nombre }}</h4>
                <p class="text-xs text-gray-500 mt-0.5">{{ criterio.descripcion }}</p>
              </div>
              <div class="flex items-center gap-1.5 shrink-0">
                <input :value="criterios[i].puntaje" @input="setPuntaje(i, $event)" @blur="setPuntaje(i, $event)"
                  type="number" min="0" :max="criterio.maxPuntaje" step="1"
                  class="w-16 text-center border border-gray-300 rounded-lg py-1.5 text-sm font-bold focus:ring-2 focus:ring-green-400 focus:outline-none transition-colors"
                  :class="criterios[i].puntaje >= 16 ? 'text-green-600 border-green-300' : criterios[i].puntaje >= 10 ? 'text-yellow-600 border-yellow-300' : criterios[i].puntaje > 0 ? 'text-red-500 border-red-300' : 'text-gray-400'" />
                <span class="text-xs text-gray-400 font-medium">/{{ criterio.maxPuntaje }}</span>
              </div>
            </div>
            <textarea v-model="criterios[i].observacion" rows="2"
              class="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-green-300 mt-1"
              placeholder="Observación sobre este criterio (opcional)" />
          </div>
        </div>

        <!-- Puntaje total -->
        <div class="mx-6 mb-4 p-4 rounded-xl"
          :class="puntajeTotal >= 70 ? 'bg-green-50 border border-green-200' : puntajeTotal >= 50 ? 'bg-yellow-50 border border-yellow-200' : 'bg-red-50 border border-red-200'">
          <div class="flex items-center justify-between mb-2">
            <span class="font-semibold text-gray-700 text-sm">Puntaje total</span>
            <span class="text-3xl font-black"
              :class="puntajeTotal >= 70 ? 'text-green-700' : puntajeTotal >= 50 ? 'text-yellow-600' : 'text-red-500'">
              {{ puntajeTotal }}<span class="text-base font-normal text-gray-400">/100</span>
            </span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2.5">
            <div class="h-2.5 rounded-full transition-all duration-500"
              :style="{ width: puntajeTotal + '%' }"
              :class="puntajeTotal >= 70 ? 'bg-green-500' : puntajeTotal >= 50 ? 'bg-yellow-500' : 'bg-red-500'" />
          </div>
        </div>
      </div>

      <!-- Observaciones -->
      <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-5">
        <div class="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h3 class="text-base font-bold text-gray-800">Observaciones</h3>
        </div>
        <div class="px-6 py-4 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Observación general <span class="text-red-500">*</span>
              <span class="text-xs text-gray-400 font-normal ml-1">(obligatoria para enviar)</span>
            </label>
            <textarea v-model="observacionGeneral" rows="4" maxlength="1500"
              class="w-full text-sm border border-gray-300 rounded-xl px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-green-300"
              placeholder="Fortalezas, debilidades y comentarios generales sobre el proyecto..." />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Recomendaciones <span class="text-xs text-gray-400 font-normal">(opcional)</span>
            </label>
            <textarea v-model="recomendaciones" rows="3" maxlength="500"
              class="w-full text-sm border border-gray-300 rounded-xl px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-green-300"
              placeholder="Sugerencias para mejorar el proyecto..." />
          </div>
        </div>

        <!-- Botones -->
        <div class="px-6 pb-5 flex flex-wrap gap-3 items-center border-t border-gray-100 pt-4">
          <button @click="guardar('borrador')" :disabled="!!guardando"
            class="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors disabled:opacity-50 bg-gray-500 hover:bg-gray-600">
            {{ guardando === 'borrador' ? 'Guardando...' : 'Guardar borrador' }}
          </button>
          <button @click="guardar('enviada')" :disabled="!!guardando || !observacionGeneral.trim()"
            class="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors disabled:opacity-50"
            style="background: linear-gradient(90deg,#1e5c2a,#2d8a3e)">
            {{ guardando === 'enviada' ? 'Enviando...' : 'Enviar evaluación final' }}
          </button>
          <p v-if="!observacionGeneral.trim()" class="text-xs text-orange-500">
            Completa la observación general antes de enviar.
          </p>
        </div>

        <div v-if="mensajeGuardado" class="mx-6 mb-5 px-4 py-3 rounded-xl text-sm font-medium"
          :class="guardadoOk ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'">
          {{ mensajeGuardado }}
        </div>
      </div>

    </template>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({ roles: ['evaluador'] })

const route = useRoute()
const { get, post } = useApi()

const proyectoId = route.params.id as string
const proyecto = ref<any>(null)
const cargando = ref(true)
const guardando = ref<string | false>(false)
const mensajeGuardado = ref('')
const guardadoOk = ref(true)
const observacionGeneral = ref('')
const recomendaciones = ref('')
const verResumen = ref(false)

interface CriterioEval { nombre: string; descripcion: string; puntaje: number; observacion: string; maxPuntaje: number }

const rubrica = ref<any>(null)
const criterios = ref<CriterioEval[]>([])
const modalidadAsignada = ref(true)

const modalidadLabels: Record<string, string> = {
  poster: 'Póster o Cartel',
  poster_prototipo: 'Póster y Prototipo',
  ponencia: 'Conferencia o Ponencia',
}

// Todos los autores del proyecto (aprendices en autoresPrincipales; fallback al autor referenciado)
function autoresDe(p: any): string {
  const nombres = (p?.autoresPrincipales?.length
    ? p.autoresPrincipales.map((a: any) => a?.nombreCompleto)
    : [p?.autorRef?.nombreCompleto]
  ).filter(Boolean)
  return nombres.length ? nombres.join(', ') : '—'
}

// Carga la rúbrica oficial según la modalidad del proyecto.
// Si el proyecto aún no tiene modalidad asignada, usa la rúbrica base de Póster
// y muestra un aviso.
async function cargarRubrica(modalidad?: string) {
  modalidadAsignada.value = !!modalidad
  const mod = modalidad || 'poster'
  const r = await get<any>(`/rubricas/${mod}`)
  rubrica.value = r
  criterios.value = (r.criterios || []).map((c: any) => ({
    nombre: c.nombre,
    descripcion: c.descripcion,
    puntaje: 0,
    observacion: '',
    maxPuntaje: c.maxPuntaje ?? 20,
  }))
}

// Limita el puntaje ingresado al rango permitido [0, maxPuntaje] del criterio
function setPuntaje(i: number, e: Event) {
  const input = e.target as HTMLInputElement
  const max = criterios.value[i].maxPuntaje ?? 20
  // Campo vacío: mantener 0 en el modelo, normalizar al salir del campo
  if (input.value === '') {
    criterios.value[i].puntaje = 0
    if (e.type === 'blur') input.value = '0'
    return
  }
  let v = Math.floor(Number(input.value))
  if (isNaN(v)) v = 0
  v = Math.max(0, Math.min(max, v)) // no puede superar el máximo ni bajar de 0
  criterios.value[i].puntaje = v
  // Si el usuario escribió algo fuera de rango, reflejar el valor corregido
  if (String(v) !== input.value) input.value = String(v)
}

const puntajeTotal = computed(() => criterios.value.reduce((s, c) => s + (c.puntaje || 0), 0))

async function guardar(estado: string) {
  guardando.value = estado
  mensajeGuardado.value = ''
  try {
    await post('/evaluaciones', {
      proyectoRef: proyectoId,
      criterios: criterios.value,
      observacionGeneral: observacionGeneral.value,
      recomendaciones: recomendaciones.value,
      estado,
    })
    guardadoOk.value = true
    mensajeGuardado.value = estado === 'enviada'
      ? 'Evaluación enviada exitosamente.'
      : 'Borrador guardado.'
    if (estado === 'enviada') {
      setTimeout(() => navigateTo('/evaluador/mis-asignaciones'), 2000)
    }
  } catch (e: any) {
    guardadoOk.value = false
    mensajeGuardado.value = e?.data?.message || 'Error al guardar.'
  } finally {
    guardando.value = false
  }
}

onMounted(async () => {
  if (!localStorage.getItem('token')) { navigateTo('/login'); return }
  try {
    proyecto.value = await get<any>(`/proyectos/${proyectoId}`)
    await cargarRubrica(proyecto.value?.modalidadParticipacion)
  } catch {
    navigateTo('/evaluador/mis-asignaciones')
  } finally {
    cargando.value = false
  }
})
</script>
