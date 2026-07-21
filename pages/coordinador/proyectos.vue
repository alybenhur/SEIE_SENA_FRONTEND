<template>
  <NuxtLayout name="coordinador">

    <!-- Debug temporal -->
    <div v-if="debugInfo" class="mb-3 px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-xs text-gray-600 font-mono">
      🔍 {{ debugInfo }}
    </div>

    <!-- Error de carga -->
    <div v-if="errorCarga" class="mb-4 flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
      <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
      </svg>
      {{ errorCarga }}
    </div>

    <!-- Encabezado + filtro -->
    <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
      <div>
        <h2 class="text-xl font-bold text-gray-800">Gestión de Proyectos</h2>
        <p v-if="cargando" class="text-sm text-gray-400 mt-0.5">Cargando...</p>
        <p v-else-if="miEvento" class="text-sm text-green-700 mt-0.5">
          Evento: <strong>{{ miEvento?.nombre ?? miEvento }}</strong>
        </p>
        <p v-else class="text-sm text-red-500 mt-0.5">⚠ No tienes un evento asignado.</p>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <select v-model="filtroModalidad"
          class="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-green-300">
          <option value="">Todas las modalidades</option>
          <option value="poster">Póster o Cartel</option>
          <option value="poster_prototipo">Póster y Prototipo</option>
          <option value="ponencia">Conferencia o Ponencia</option>
          <option value="sin">Sin asignar</option>
        </select>
        <select v-model="filtroEstado"
          class="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-green-300">
          <option value="">Todos los estados</option>
          <option value="enviado">Enviados</option>
          <option value="aceptado">Aceptados</option>
          <option value="rechazado">Rechazados</option>
          <option value="evaluador_asignado">Evaluador asignado</option>
          <option value="sustentando">Sustentando</option>
          <option value="en_evaluacion">En evaluación</option>
          <option value="evaluado">Evaluados</option>
          <option value="aprobado">Aprobados</option>
        </select>
      </div>
    </div>

    <!-- Contador de trabajos por modalidad -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      <button v-for="m in resumenModalidad" :key="m.key || 'sin'"
        @click="filtroModalidad = filtroModalidad === m.key ? '' : m.key"
        :class="filtroModalidad === m.key ? 'ring-2 ring-green-400 border-green-300' : 'border-gray-200 hover:border-green-200'"
        class="text-left bg-white rounded-2xl border shadow-sm px-4 py-3 transition-all">
        <p class="text-3xl font-black leading-none" :class="m.color">{{ m.count }}</p>
        <p class="text-xs font-medium text-gray-500 mt-1.5">{{ m.label }}</p>
      </button>
    </div>

    <!-- Sin resultados -->
    <div v-if="!cargando && !proyectosFiltrados.length"
      class="bg-white rounded-2xl border border-gray-200 shadow-sm text-center py-16 text-gray-400">
      <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
      </svg>
      <p class="font-medium">No hay proyectos con este filtro.</p>
    </div>

    <!-- Cards de proyectos -->
    <div class="space-y-5">
      <div v-for="p in proyectosFiltrados" :key="p._id"
        class="rounded-2xl overflow-hidden shadow-md border border-gray-200 bg-white">

        <!-- ── Cabecera oscura ── -->
        <div class="px-6 py-4 card-header flex flex-wrap items-center justify-between gap-3">
          <div class="flex-1 min-w-0">
            <h3 class="font-bold text-white text-base leading-snug">{{ p.titulo }}</h3>
            <div class="flex flex-wrap items-center gap-2 mt-1.5">
              <span :class="p.tipo === 'investigacion' ? 'bg-teal-400/20 text-teal-200 border-teal-400/30' : 'bg-orange-400/20 text-orange-200 border-orange-400/30'"
                class="px-2.5 py-0.5 rounded-full text-xs font-medium capitalize border">
                {{ p.tipo }}
              </span>
              <span v-if="p.lineaInvestigacion" class="text-green-300 text-xs">· {{ p.lineaInvestigacion }}</span>
            </div>
          </div>
          <span :class="estadoHeaderClass(p.estado)"
            class="px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap uppercase tracking-wide border">
            {{ p.estado?.replace(/_/g, ' ') }}
          </span>
        </div>

        <!-- ── Cuerpo ── -->
        <div class="px-6 py-5 space-y-5">

          <!-- Sección: Información del proyecto -->
          <div>
            <div class="section-title">
              <svg class="w-4 h-4 text-green-600 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
              </svg>
              <span>Información del proyecto</span>
              <div class="flex-1 h-px bg-gray-200"></div>
            </div>

            <div class="data-box grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <div class="flex gap-2">
                <span class="text-gray-400 w-28 shrink-0">Institución</span>
                <span class="text-gray-700 font-medium">{{ p.institucion || '—' }}</span>
              </div>
              <div class="flex gap-2">
                <span class="text-gray-400 w-28 shrink-0">Autor</span>
                <span class="text-gray-700 font-medium">{{ p.autorRef?.nombreCompleto || '—' }}</span>
              </div>
              <div class="flex gap-2">
                <span class="text-gray-400 w-28 shrink-0">Modalidad</span>
                <span class="text-gray-700 font-medium">{{ modalidadLabels[p.modalidadParticipacion] || '—' }}</span>
              </div>
              <div class="flex gap-2">
                <span class="text-gray-400 w-28 shrink-0">Línea de investigación</span>
                <span class="text-gray-700 font-medium">{{ p.lineaInvestigacion || '—' }}</span>
              </div>
              <div class="flex gap-2">
                <span class="text-gray-400 w-28 shrink-0">Regional</span>
                <span class="text-gray-700 font-medium">{{ p.regional || '—' }}</span>
              </div>
              <div v-if="p.evaluadorRef" class="flex gap-2 sm:col-span-2">
                <span class="text-gray-400 w-28 shrink-0">Evaluador</span>
                <span class="text-gray-700 font-medium">{{ p.evaluadorRef?.nombreCompleto || '—' }}</span>
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

          <!-- Sección colapsable: Resumen -->
          <div v-if="detalleAbierto === p._id">
            <div class="section-title">
              <svg class="w-4 h-4 text-green-600 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
              <span>Resumen ejecutivo</span>
              <div class="flex-1 h-px bg-gray-200"></div>
            </div>
            <div class="data-box">
              <p class="text-sm text-gray-700 leading-relaxed">{{ p.resumen }}</p>
            </div>

            <!-- Observación de rechazo previa -->
            <div v-if="p.observacionRechazo" class="mt-4 flex items-start gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              <svg class="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
              <div><span class="font-semibold">Motivo de rechazo anterior:</span> {{ p.observacionRechazo }}</div>
            </div>
          </div>

        </div>

        <!-- ── Footer de acciones ── -->
        <div class="px-6 py-4 bg-gray-50 border-t border-gray-100">

          <!-- Botones de acción según estado -->
          <div v-if="accionActiva !== p._id" class="flex flex-wrap gap-3 items-center">

            <!-- Descargar documento -->
            <a v-if="p.urlDocumento" :href="p.urlDocumento" target="_blank"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-300 text-gray-600 hover:border-green-400 hover:text-green-700 transition-colors">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Documento
            </a>

            <!-- Estado: enviado -->
            <template v-if="p.estado === 'enviado'">
              <button @click.stop="iniciarAccion(p._id, 'aceptar')"
                class="action-btn action-btn-green">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                Aceptar
              </button>
              <button @click.stop="iniciarAccion(p._id, 'rechazar')"
                class="action-btn action-btn-red">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
                Rechazar
              </button>
            </template>

            <!-- Estado: aceptado -->
            <template v-else-if="p.estado === 'aceptado'">
              <span class="inline-flex items-center gap-1.5 text-sm text-teal-600 font-medium">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                Proyecto aceptado
              </span>
              <button @click.stop="iniciarAccion(p._id, 'asignar_evaluador')"
                class="action-btn action-btn-indigo">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                </svg>
                Asignar evaluador
              </button>
            </template>

            <!-- Estado: evaluador_asignado -->
            <template v-else-if="p.estado === 'evaluador_asignado'">
              <button @click.stop="iniciarAccion(p._id, 'sustentando')"
                class="action-btn action-btn-orange">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                </svg>
                Marcar sustentando
              </button>
              <button @click.stop="iniciarAccion(p._id, 'asignar_evaluador')"
                class="action-btn action-btn-ghost">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
                Reasignar evaluador
              </button>
            </template>

            <!-- Estado: sustentando -->
            <template v-else-if="p.estado === 'sustentando'">
              <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-100 text-orange-700 text-xs font-semibold border border-orange-200">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                </svg>
                En sustentación
              </span>
            </template>

            <span v-else-if="p.estado === 'rechazado'"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-100 text-red-600 text-xs font-semibold border border-red-200">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
              Rechazado
            </span>

            <span v-else class="text-sm text-gray-400 capitalize">{{ p.estado?.replace(/_/g, ' ') }}</span>
          </div>

          <!-- Panel: aceptar / rechazar -->
          <div v-if="accionActiva === p._id && tipoAccion !== 'asignar_evaluador'" @click.stop
            class="bg-white border border-gray-200 rounded-xl p-5 max-w-lg">
            <p class="font-semibold text-gray-800 mb-4">
              {{ tipoAccion === 'aceptar' ? '¿Confirmar aceptación del proyecto?' : 'Rechazar proyecto' }}
            </p>
            <div v-if="tipoAccion === 'rechazar'" class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Motivo del rechazo <span class="text-red-500">*</span>
              </label>
              <textarea v-model="observacionTexto" rows="4"
                class="w-full text-sm border border-gray-300 rounded-xl px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-red-300"
                placeholder="Describe el motivo por el cual se rechaza este proyecto..." />
              <p v-if="errorObservacion" class="text-xs text-red-500 mt-1">{{ errorObservacion }}</p>
            </div>
            <div class="flex gap-3">
              <button @click.stop="confirmarAccion(p._id)" :disabled="procesando"
                :class="tipoAccion === 'aceptar' ? 'action-btn action-btn-green' : 'action-btn action-btn-red'"
                class="disabled:opacity-50">
                {{ procesando ? 'Guardando...' : (tipoAccion === 'aceptar' ? 'Confirmar aceptación' : 'Confirmar rechazo') }}
              </button>
              <button @click.stop="cancelarAccion" class="action-btn action-btn-ghost">Cancelar</button>
            </div>
          </div>

          <!-- Panel: asignar evaluador -->
          <div v-if="accionActiva === p._id && tipoAccion === 'asignar_evaluador'" @click.stop
            class="bg-white border border-gray-200 rounded-xl p-5 max-w-lg">
            <div class="section-title mb-4">
              <svg class="w-4 h-4 text-green-600 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
              </svg>
              <span>Asignar evaluador al proyecto</span>
              <div class="flex-1 h-px bg-gray-200"></div>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Selecciona un evaluador <span class="text-red-500">*</span>
              </label>
              <select v-model="evaluadorSeleccionado"
                class="w-full text-sm border border-gray-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-300 bg-white">
                <option value="">— Selecciona un evaluador —</option>
                <option v-for="ev in evaluadoresDisponibles" :key="ev._id" :value="ev._id" :disabled="ev.carga >= 3">
                  {{ ev.nombreCompleto }} ({{ ev.carga }}/3{{ ev.carga >= 3 ? ' — CUPO LLENO' : '' }})
                </option>
              </select>
              <p v-if="errorObservacion" class="text-xs text-red-500 mt-1">{{ errorObservacion }}</p>
              <p v-if="!evaluadoresDisponibles.length && !cargandoEvaluadores" class="text-xs text-amber-600 mt-1">
                No hay evaluadores aprobados registrados.
              </p>
            </div>
            <div class="flex gap-3">
              <button @click.stop="confirmarAsignacion(p._id)" :disabled="procesando || !evaluadorSeleccionado"
                class="action-btn action-btn-green disabled:opacity-50">
                {{ procesando ? 'Asignando...' : 'Confirmar asignación' }}
              </button>
              <button @click.stop="cancelarAccion" class="action-btn action-btn-ghost">Cancelar</button>
            </div>
          </div>

        </div>
      </div>
    </div>

  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({ roles: ['coordinador'] })

const { get, patch } = useApi()

const proyectos = ref<any[]>([])
const miEvento = ref<any>(null)
const filtroEstado = ref('enviado')
const filtroModalidad = ref('')

const modalidadLabels: Record<string, string> = {
  poster: 'Póster o Cartel',
  poster_prototipo: 'Póster y Prototipo',
  ponencia: 'Conferencia o Ponencia',
}
const cargando = ref(true)
const errorCarga = ref('')
const debugInfo = ref('')
const detalleAbierto = ref<string | null>(null)
const accionActiva = ref<string | null>(null)
const tipoAccion = ref<'aceptar' | 'rechazar' | 'asignar_evaluador' | 'sustentando'>('aceptar')
const observacionTexto = ref('')
const errorObservacion = ref('')
const procesando = ref(false)

const evaluadoresDisponibles = ref<any[]>([])
const evaluadorSeleccionado = ref('')
const cargandoEvaluadores = ref(false)

const estadoHeaderColors: Record<string, string> = {
  enviado:            'bg-yellow-400/20 text-yellow-200 border-yellow-400/30',
  aceptado:           'bg-teal-400/20 text-teal-200 border-teal-400/30',
  evaluador_asignado: 'bg-indigo-400/20 text-indigo-200 border-indigo-400/30',
  sustentando:        'bg-orange-400/20 text-orange-200 border-orange-400/30',
  en_evaluacion:      'bg-blue-400/20 text-blue-200 border-blue-400/30',
  evaluado:           'bg-purple-400/20 text-purple-200 border-purple-400/30',
  aprobado:           'bg-green-400/20 text-green-200 border-green-400/30',
  rechazado:          'bg-red-400/20 text-red-200 border-red-400/30',
}
const estadoHeaderClass = (e: string) => estadoHeaderColors[e] || 'bg-white/10 text-white/60 border-white/20'

const coincideModalidad = (p: any) => {
  if (!filtroModalidad.value) return true
  if (filtroModalidad.value === 'sin') return !p.modalidadParticipacion
  return p.modalidadParticipacion === filtroModalidad.value
}

const proyectosFiltrados = computed(() =>
  proyectos.value.filter(p =>
    (!filtroEstado.value || p.estado === filtroEstado.value) && coincideModalidad(p)
  )
)

// Contador de trabajos por modalidad (sobre el total, no sobre el filtro)
const conteoModalidad = computed(() => {
  const c: Record<string, number> = { poster: 0, poster_prototipo: 0, ponencia: 0, sin: 0 }
  for (const p of proyectos.value) {
    const m = p.modalidadParticipacion
    if (m === 'poster' || m === 'poster_prototipo' || m === 'ponencia') c[m]++
    else c.sin++
  }
  return c
})

const resumenModalidad = computed(() => [
  { key: 'poster',           label: 'Póster o Cartel',        count: conteoModalidad.value.poster,           color: 'text-sky-600' },
  { key: 'poster_prototipo', label: 'Póster y Prototipo',     count: conteoModalidad.value.poster_prototipo, color: 'text-indigo-600' },
  { key: 'ponencia',         label: 'Conferencia o Ponencia', count: conteoModalidad.value.ponencia,         color: 'text-emerald-600' },
  { key: 'sin',              label: 'Sin asignar',            count: conteoModalidad.value.sin,              color: 'text-gray-400' },
])

function toggleDetalle(id: string) {
  detalleAbierto.value = detalleAbierto.value === id ? null : id
}

async function iniciarAccion(id: string, tipo: 'aceptar' | 'rechazar' | 'asignar_evaluador' | 'sustentando') {
  if (tipo === 'sustentando') {
    procesando.value = true
    try {
      await patch(`/proyectos/${id}/estado`, { estado: 'sustentando' })
      const idx = proyectos.value.findIndex(p => p._id === id)
      if (idx !== -1) proyectos.value[idx].estado = 'sustentando'
    } catch (e: any) {
      alert(e?.data?.message || 'Error al cambiar el estado.')
    } finally {
      procesando.value = false
    }
    return
  }

  accionActiva.value = id
  tipoAccion.value = tipo
  observacionTexto.value = ''
  errorObservacion.value = ''
  evaluadorSeleccionado.value = ''

  if (tipo === 'asignar_evaluador') {
    cargandoEvaluadores.value = true
    try {
      const [lista, cargas] = await Promise.all([
        get<any[]>('/usuarios?rol=evaluador&estado=aprobado'),
        get<any[]>('/proyectos/carga-evaluadores'),
      ])
      const cargaMap: Record<string, number> = {}
      for (const c of cargas) cargaMap[String(c._id)] = c.total
      evaluadoresDisponibles.value = (lista ?? []).map((ev: any) => ({
        ...ev,
        carga: cargaMap[String(ev._id)] ?? 0,
      }))
    } catch {
      evaluadoresDisponibles.value = []
    } finally {
      cargandoEvaluadores.value = false
    }
  }
}

function cancelarAccion() {
  accionActiva.value = null
  observacionTexto.value = ''
  errorObservacion.value = ''
  evaluadorSeleccionado.value = ''
}

async function confirmarAccion(id: string) {
  if (tipoAccion.value === 'rechazar' && !observacionTexto.value.trim()) {
    errorObservacion.value = 'La observación es obligatoria para rechazar un proyecto.'
    return
  }
  procesando.value = true
  try {
    const body: any = { estado: tipoAccion.value === 'aceptar' ? 'aceptado' : 'rechazado' }
    if (tipoAccion.value === 'rechazar') body.observacion = observacionTexto.value.trim()
    await patch(`/proyectos/${id}/estado`, body)
    const idx = proyectos.value.findIndex(p => p._id === id)
    if (idx !== -1) {
      proyectos.value[idx].estado = body.estado
      if (body.observacion) proyectos.value[idx].observacionRechazo = body.observacion
    }
    accionActiva.value = null
    observacionTexto.value = ''
  } catch (e: any) {
    errorObservacion.value = e?.data?.message || 'Error al actualizar el estado.'
  } finally {
    procesando.value = false
  }
}

async function confirmarAsignacion(id: string) {
  if (!evaluadorSeleccionado.value) {
    errorObservacion.value = 'Debes seleccionar un evaluador.'
    return
  }
  procesando.value = true
  try {
    await patch(`/proyectos/${id}/asignar-evaluador`, { evaluadorId: evaluadorSeleccionado.value })
    const idx = proyectos.value.findIndex(p => p._id === id)
    if (idx !== -1) {
      proyectos.value[idx].estado = 'evaluador_asignado'
      const ev = evaluadoresDisponibles.value.find(e => e._id === evaluadorSeleccionado.value)
      proyectos.value[idx].evaluadorRef = ev ?? { _id: evaluadorSeleccionado.value, nombreCompleto: '—' }
    }
    accionActiva.value = null
    evaluadorSeleccionado.value = ''
  } catch (e: any) {
    errorObservacion.value = e?.data?.message || 'Error al asignar el evaluador.'
  } finally {
    procesando.value = false
  }
}

onMounted(async () => {
  if (!localStorage.getItem('token')) { navigateTo('/login'); return }
  try {
    const perfil = await get<any>('/usuarios/me')
    miEvento.value = perfil?.eventoRef ?? null
    if (!miEvento.value) {
      errorCarga.value = 'No tienes un evento asignado. Contacta al administrador.'
      return
    }
    const eventoId = typeof miEvento.value === 'object'
      ? String((miEvento.value as any)._id)
      : String(miEvento.value)

    const todos = await get<any[]>('/proyectos') ?? []
    proyectos.value = todos.filter((p: any) => {
      const pEvId = typeof p.eventoRef === 'object' ? String(p.eventoRef?._id ?? p.eventoRef) : String(p.eventoRef)
      return pEvId === eventoId
    })
    debugInfo.value = `eventoId: ${eventoId} | total BD: ${todos.length} | este evento: ${proyectos.value.length}`
  } catch (e: any) {
    errorCarga.value = e?.data?.message || e?.message || 'Error al cargar los proyectos.'
  } finally {
    cargando.value = false
  }
})
</script>

<style scoped>
.card-header {
  background: linear-gradient(100deg, #1a3a1a 0%, #1e5c2a 55%, #2d8a3e 100%);
}

/* Sección título con ícono + línea */
.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}
.section-title span {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #4b5563;
  white-space: nowrap;
}

/* Caja de datos bordeada */
.data-box {
  border: 1px solid #f0f0f0;
  border-radius: 0.75rem;
  background: rgba(249, 250, 251, 0.6);
  padding: 0.75rem 1rem;
}

/* Botones de acción */
.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  border-radius: 0.625rem;
  font-size: 0.8125rem;
  font-weight: 600;
  transition: all 0.15s;
  white-space: nowrap;
}

.action-btn-green {
  background: linear-gradient(90deg, #1e5c2a, #2d8a3e);
  color: #fff;
}
.action-btn-green:hover { background: linear-gradient(90deg, #164d22, #237033); }

.action-btn-red {
  background-color: #ef4444;
  color: #fff;
}
.action-btn-red:hover { background-color: #dc2626; }

.action-btn-indigo {
  background-color: #6366f1;
  color: #fff;
}
.action-btn-indigo:hover { background-color: #4f46e5; }

.action-btn-orange {
  background-color: #f97316;
  color: #fff;
}
.action-btn-orange:hover { background-color: #ea6c0a; }

.action-btn-ghost {
  border: 1px solid #d1d5db;
  color: #6b7280;
  background: transparent;
}
.action-btn-ghost:hover {
  border-color: #9ca3af;
  color: #374151;
  background: #f9fafb;
}
</style>
