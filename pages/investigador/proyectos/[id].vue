<template>
  <NuxtLayout name="investigador">
    <div class="max-w-4xl mx-auto">

      <!-- Cabecera -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <NuxtLink to="/investigador/proyectos" class="text-gray-400 hover:text-gray-600 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
          </NuxtLink>
          <h2 class="text-2xl font-bold text-gray-800">Detalle del Proyecto</h2>
        </div>
        <!-- Botón eliminar (solo si enviado y dentro del plazo) -->
        <button v-if="puedeEliminar" @click="confirmarEliminar = true"
          class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
          </svg>
          Eliminar proyecto
        </button>
      </div>

      <!-- Modal confirmación eliminar -->
      <div v-if="confirmarEliminar" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <div class="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
            </div>
            <div>
              <h3 class="font-bold text-gray-800">¿Eliminar proyecto?</h3>
              <p class="text-sm text-gray-500">Esta acción no se puede deshacer.</p>
            </div>
          </div>
          <p class="text-sm text-gray-600 mb-5 bg-gray-50 rounded-xl p-3 border border-gray-200">
            "{{ p?.titulo }}"
          </p>
          <p v-if="errorEliminar" class="text-sm text-red-600 mb-3">{{ errorEliminar }}</p>
          <div class="flex gap-3">
            <button @click="eliminar" :disabled="eliminando"
              class="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold bg-red-600 hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
              <div v-if="eliminando" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              {{ eliminando ? 'Eliminando...' : 'Sí, eliminar' }}
            </button>
            <button @click="confirmarEliminar = false; errorEliminar = ''"
              class="flex-1 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              Cancelar
            </button>
          </div>
        </div>
      </div>

      <!-- Cargando -->
      <div v-if="cargando" class="flex justify-center py-20">
        <div class="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>

      <!-- Error -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-2xl p-8 text-center text-red-600">
        {{ error }}
      </div>

      <template v-else-if="p">

        <!-- ── ENCABEZADO DEL PROYECTO ── -->
        <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-5">
          <div class="px-6 py-5 border-b border-gray-100" style="background: linear-gradient(135deg,#0f766e,#14b8a6)">
            <div class="flex items-start justify-between gap-4">
              <div class="flex-1">
                <h3 class="text-white font-bold text-xl leading-snug">{{ p.titulo }}</h3>
                <div class="flex flex-wrap items-center gap-3 mt-2">
                  <span class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white capitalize">{{ p.tipo }}</span>
                  <span v-if="p.categoria" class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white capitalize">{{ p.categoria?.replace('_',' ') }}</span>
                  <span class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white">{{ p.modalidad }}</span>
                </div>
              </div>
              <span :class="estadoClass(p.estado)" class="flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold capitalize whitespace-nowrap">
                {{ p.estado?.replace('_',' ') }}
              </span>
            </div>
          </div>

          <!-- Datos rápidos -->
          <div class="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y divide-gray-100">
            <div class="px-5 py-4">
              <p class="text-xs text-gray-400 mb-0.5">Evento</p>
              <p class="text-sm font-semibold text-gray-700">{{ p.eventoRef?.nombre || '—' }}</p>
            </div>
            <div class="px-5 py-4">
              <p class="text-xs text-gray-400 mb-0.5">Línea de investigación</p>
              <p class="text-sm font-semibold text-gray-700">{{ p.lineaInvestigacion || '—' }}</p>
            </div>
            <div class="px-5 py-4">
              <p class="text-xs text-gray-400 mb-0.5">Institución</p>
              <p class="text-sm font-semibold text-gray-700 truncate" :title="p.institucion">{{ p.institucion || '—' }}</p>
            </div>
            <div class="px-5 py-4">
              <p class="text-xs text-gray-400 mb-0.5">Semillero</p>
              <p class="text-sm font-semibold text-gray-700">{{ p.semilleroNombre || p.semilleroRef?.nombre || '—' }}</p>
            </div>
            <div class="px-5 py-4">
              <p class="text-xs text-gray-400 mb-0.5">Área</p>
              <p class="text-sm font-semibold text-gray-700">{{ p.area || '—' }}</p>
            </div>
            <div class="px-5 py-4">
              <p class="text-xs text-gray-400 mb-0.5">Programa académico</p>
              <p class="text-sm font-semibold text-gray-700">{{ p.programaAcademico || '—' }}</p>
            </div>
            <div class="px-5 py-4">
              <p class="text-xs text-gray-400 mb-0.5">Departamento / Municipio</p>
              <p class="text-sm font-semibold text-gray-700">{{ [p.departamento, p.municipio].filter(Boolean).join(' / ') || '—' }}</p>
            </div>
            <div class="px-5 py-4">
              <p class="text-xs text-gray-400 mb-0.5">Fecha de registro</p>
              <p class="text-sm font-semibold text-gray-700">{{ fechaFormato(p.createdAt) }}</p>
            </div>
          </div>
        </div>

        <!-- ── DOCUMENTO ── -->
        <div v-if="p.urlDocumento || p.urlArchivo" class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 mb-5 flex flex-wrap items-center gap-4">
          <div class="flex items-center gap-3 flex-1 min-w-0">
            <div class="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center" style="background:linear-gradient(135deg,#0369a1,#0ea5e9)">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
            </div>
            <div class="min-w-0">
              <p class="text-sm font-semibold text-gray-700">Documento del proyecto</p>
              <p class="text-xs text-gray-400 truncate">{{ p.urlDocumento || p.urlArchivo }}</p>
            </div>
          </div>
          <div class="flex gap-2">
            <a v-if="p.urlDocumento" :href="p.urlDocumento" target="_blank"
              class="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white shadow transition-all hover:shadow-md hover:-translate-y-0.5"
              style="background:linear-gradient(135deg,#0369a1,#0ea5e9)">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Descargar
            </a>
            <a v-if="p.urlArchivo" :href="p.urlArchivo" target="_blank"
              class="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
              Enlace externo
            </a>
          </div>
        </div>

        <!-- ── PALABRAS CLAVE ── -->
        <div v-if="p.palabrasClaveArr?.length || p.palabrasClave" class="bg-white rounded-2xl border border-gray-200 shadow-sm px-6 py-4 mb-5">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Palabras clave</p>
          <div class="flex flex-wrap gap-2">
            <template v-if="p.palabrasClaveArr?.length">
              <span v-for="kw in p.palabrasClaveArr" :key="kw"
                class="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-medium border border-teal-200">{{ kw }}</span>
            </template>
            <template v-else>
              <span v-for="kw in p.palabrasClave?.split(',').map((s:string) => s.trim()).filter(Boolean)" :key="kw"
                class="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-medium border border-teal-200">{{ kw }}</span>
            </template>
          </div>
        </div>

        <!-- ── RESUMEN ── -->
        <section class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-5">
          <div class="px-6 py-3 border-b border-gray-100 bg-gray-50">
            <h4 class="text-sm font-semibold text-gray-600">Resumen ejecutivo</h4>
          </div>
          <div class="px-6 py-4 text-sm text-gray-700 leading-relaxed whitespace-pre-line">{{ p.resumen }}</div>
        </section>

        <!-- ── CONTENIDO ACADÉMICO ── -->
        <section class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-5">
          <div class="px-6 py-4 border-b border-gray-100" style="background:linear-gradient(135deg,#b45309,#f59e0b)">
            <h4 class="text-white font-semibold text-sm">Contenido Académico</h4>
          </div>
          <div class="divide-y divide-gray-50">
            <template v-for="bloque in bloquesContenido" :key="bloque.key">
              <div v-if="p[bloque.key]" class="px-6 py-4">
                <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">{{ bloque.label }}</p>
                <p class="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{{ p[bloque.key] }}</p>
              </div>
            </template>
            <!-- Objetivos específicos -->
            <div v-if="p.objetivosEspecificos?.length" class="px-6 py-4">
              <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Objetivos específicos</p>
              <ol class="space-y-1.5">
                <li v-for="(obj, i) in p.objetivosEspecificos" :key="i" class="flex gap-2 text-sm text-gray-700">
                  <span class="w-5 h-5 flex-shrink-0 rounded-full bg-amber-100 text-amber-700 text-xs flex items-center justify-center font-bold mt-0.5">{{ i+1 }}</span>
                  {{ obj }}
                </li>
              </ol>
            </div>
            <div v-if="!tieneContenido" class="px-6 py-6 text-center text-gray-400 text-sm">
              No se registró contenido académico adicional.
            </div>
          </div>
        </section>

        <!-- ── EQUIPO ── -->
        <section class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-5">
          <div class="px-6 py-4 border-b border-gray-100" style="background:linear-gradient(135deg,#7c3aed,#a78bfa)">
            <h4 class="text-white font-semibold text-sm">Equipo de Trabajo</h4>
          </div>
          <div class="p-6 space-y-5">

            <div v-for="grupo in gruposEquipo" :key="grupo.key">
              <template v-if="p[grupo.key]?.length">
                <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">{{ grupo.label }}</p>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div v-for="(a, i) in p[grupo.key]" :key="i"
                    class="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p class="font-semibold text-gray-800 text-sm">{{ a.nombreCompleto || '—' }}</p>
                    <div class="mt-1.5 space-y-0.5">
                      <p v-if="a.documento" class="text-xs text-gray-500">Doc: {{ a.documento }}</p>
                      <p v-if="a.email" class="text-xs text-gray-500">✉ {{ a.email }}</p>
                      <p v-if="a.telefono" class="text-xs text-gray-500">📞 {{ a.telefono }}</p>
                      <p v-if="a.rol" class="text-xs text-purple-600 font-medium mt-1">{{ a.rol }}</p>
                    </div>
                  </div>
                </div>
              </template>
            </div>

            <!-- Contacto -->
            <div v-if="p.emailContacto || p.telefonosContacto?.length" class="pt-4 border-t border-gray-100">
              <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Contacto del proyecto</p>
              <div class="flex flex-wrap gap-4 text-sm text-gray-700">
                <span v-if="p.emailContacto">✉ {{ p.emailContacto }}</span>
                <span v-for="t in p.telefonosContacto" :key="t">📞 {{ t }}</span>
              </div>
            </div>

            <div v-if="!tieneEquipo" class="text-center text-gray-400 text-sm py-2">
              No se registraron integrantes del equipo.
            </div>
          </div>
        </section>

        <!-- ── OBSERVACIÓN DE RECHAZO ── -->
        <div v-if="p.observacionRechazo"
          class="bg-red-50 border border-red-200 rounded-2xl p-5 mb-5 flex items-start gap-3">
          <svg class="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
          <div>
            <p class="text-sm font-semibold text-red-700 mb-1">Motivo de rechazo</p>
            <p class="text-sm text-red-600">{{ p.observacionRechazo }}</p>
            <p class="text-xs text-red-400 mt-2">Puedes eliminar este proyecto y volver a presentarlo corregido.</p>
          </div>
        </div>

        <!-- ── HISTORIAL DE ESTADOS ── -->
        <section class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-5">
          <div class="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h4 class="text-sm font-semibold text-gray-600">Historial de estados</h4>
          </div>
          <div class="px-6 py-4">
            <ol class="relative border-l border-gray-200 space-y-5 ml-2">
              <li v-for="(h, i) in historialCompleto" :key="i" class="ml-5">
                <span class="absolute -left-2.5 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center"
                  :class="historialDotClass(h.estado)">
                </span>
                <div class="flex flex-wrap items-center gap-2 mb-0.5">
                  <span :class="estadoClass(h.estado)" class="px-2 py-0.5 rounded-full text-xs font-medium capitalize">
                    {{ h.estado?.replace('_', ' ') }}
                  </span>
                  <span class="text-xs text-gray-400">{{ fechaFormato(h.fecha) }}</span>
                  <span v-if="h.cambiadoPor" class="text-xs text-gray-400">· {{ h.cambiadoPor }}</span>
                </div>
                <p v-if="h.observacion" class="text-sm text-gray-600 mt-1 italic">"{{ h.observacion }}"</p>
              </li>
            </ol>
          </div>
        </section>

        <!-- ── PUNTAJE (si evaluado) ── -->
        <div v-if="p.puntajeFinal !== undefined && p.puntajeFinal !== null"
          class="bg-white rounded-2xl border border-gray-200 shadow-sm px-6 py-4 mb-5 flex items-center gap-4">
          <div class="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-md"
            :style="puntajeColor(p.puntajeFinal)">
            {{ p.puntajeFinal }}
          </div>
          <div>
            <p class="text-xs text-gray-400">Puntaje final de evaluación</p>
            <p class="font-semibold text-gray-700">{{ puntajeLabel(p.puntajeFinal) }}</p>
          </div>
        </div>

      </template>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({ roles: ['investigador'] })

const route = useRoute()
const { get, del } = useApi()

const p = ref<any>(null)
const cargando = ref(true)
const error = ref('')

// ── Eliminar ──
const confirmarEliminar = ref(false)
const eliminando = ref(false)
const errorEliminar = ref('')

const puedeEliminar = computed(() => {
  if (!p.value) return false
  // Proyecto rechazado: siempre se puede eliminar para reenviar
  if (p.value.estado === 'rechazado') return true
  // Proyecto enviado: solo dentro del plazo
  if (p.value.estado === 'enviado') {
    const limite = p.value.eventoRef?.fechaLimiteRegistro
    if (!limite) return false
    return new Date() <= new Date(limite)
  }
  return false
})

async function eliminar() {
  eliminando.value = true
  errorEliminar.value = ''
  try {
    await del(`/proyectos/${route.params.id}`)
    navigateTo('/investigador/proyectos')
  } catch (e: any) {
    errorEliminar.value = e?.data?.message || 'Error al eliminar el proyecto.'
  } finally {
    eliminando.value = false
  }
}

// ── Bloques de contenido académico ──
const bloquesContenido = [
  { key: 'introduccion',          label: 'Introducción' },
  { key: 'planteamientoProblema', label: 'Planteamiento del problema' },
  { key: 'objetivoGeneral',       label: 'Objetivo general' },
  { key: 'referenteTeorico',      label: 'Referente teórico' },
  { key: 'metodologia',           label: 'Metodología' },
  { key: 'resultadosEsperados',   label: 'Resultados esperados' },
  { key: 'bibliografia',          label: 'Bibliografía' },
]

const gruposEquipo = [
  { key: 'autoresPrincipales', label: 'Autores / Investigadores principales' },
  { key: 'coautores',          label: 'Coautores / Aprendices' },
  { key: 'autoresDocentes',    label: 'Instructores / Docentes' },
  { key: 'ponentes',           label: 'Ponentes' },
]

// ── Computed helpers ──
const tieneContenido = computed(() =>
  bloquesContenido.some(b => p.value?.[b.key]) || p.value?.objetivosEspecificos?.length
)

const tieneEquipo = computed(() =>
  gruposEquipo.some(g => p.value?.[g.key]?.length) ||
  p.value?.emailContacto || p.value?.telefonosContacto?.length
)

// ── Historial completo (incluye envío inicial si no está registrado) ──
const historialCompleto = computed(() => {
  const raw: any[] = p.value?.historialEstados ?? []
  const tieneEnviado = raw.some((h: any) => h.estado === 'enviado')
  const lista = tieneEnviado
    ? [...raw]
    : [{ estado: 'enviado', fecha: p.value?.createdAt ?? null, observacion: '', cambiadoPor: '' }, ...raw]
  return [...lista].reverse()
})

// ── Estado colores ──
const estadoColors: Record<string, string> = {
  enviado:            'bg-yellow-100 text-yellow-700',
  aceptado:           'bg-teal-100 text-teal-700',
  evaluador_asignado: 'bg-indigo-100 text-indigo-700',
  sustentando:        'bg-orange-100 text-orange-700',
  en_evaluacion:      'bg-blue-100 text-blue-700',
  evaluado:           'bg-purple-100 text-purple-700',
  aprobado:           'bg-green-100 text-green-700',
  rechazado:          'bg-red-100 text-red-700',
}
const estadoClass = (e: string) => estadoColors[e] || 'bg-gray-100 text-gray-500'

const historialDotColors: Record<string, string> = {
  enviado:            'bg-yellow-400',
  aceptado:           'bg-teal-400',
  evaluador_asignado: 'bg-indigo-400',
  sustentando:        'bg-orange-400',
  en_evaluacion:      'bg-blue-400',
  evaluado:           'bg-purple-400',
  aprobado:           'bg-green-400',
  rechazado:          'bg-red-400',
}
const historialDotClass = (e: string) => historialDotColors[e] || 'bg-gray-300'

// ── Puntaje ──
function puntajeColor(n: number) {
  if (n >= 80) return 'background: linear-gradient(135deg,#16a34a,#22c55e)'
  if (n >= 60) return 'background: linear-gradient(135deg,#ca8a04,#eab308)'
  return 'background: linear-gradient(135deg,#dc2626,#ef4444)'
}
function puntajeLabel(n: number) {
  if (n >= 80) return 'Excelente'
  if (n >= 60) return 'Aceptable'
  return 'Por mejorar'
}

// ── Fecha ──
function fechaFormato(iso: string) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })
}

// ── Carga ──
onMounted(async () => {
  if (!localStorage.getItem('token')) { navigateTo('/login'); return }
  try {
    p.value = await get<any>(`/proyectos/${route.params.id}`)
  } catch {
    error.value = 'No se pudo cargar el proyecto. Verifica que existe y tienes permisos.'
  } finally {
    cargando.value = false
  }
})
</script>
