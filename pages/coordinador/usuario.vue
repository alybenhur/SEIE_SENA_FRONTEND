<template>
  <NuxtLayout name="coordinador">

    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-800">Consultar usuario por cédula</h2>
      <p class="text-sm text-gray-500 mt-1">Busca los datos de un usuario y los proyectos donde participa.</p>
    </div>

    <!-- Buscador -->
    <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 mb-6">
      <form @submit.prevent="buscar" class="flex flex-wrap items-end gap-3">
        <div class="flex-1 min-w-[220px]">
          <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Número de cédula</label>
          <input v-model.trim="cedula" type="text" inputmode="numeric" placeholder="Ej. 1090375472"
            class="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
        </div>
        <button type="submit" :disabled="cargando || !cedula"
          class="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-md disabled:opacity-50"
          style="background: linear-gradient(90deg,#1e5c2a,#2d8a3e)">
          {{ cargando ? 'Buscando...' : 'Buscar' }}
        </button>
      </form>
    </div>

    <!-- Sin resultados -->
    <div v-if="buscado && !cargando && !usuario"
      class="bg-white rounded-2xl border border-gray-200 shadow-sm text-center py-14 text-gray-400">
      <p class="font-medium">No se encontró ningún usuario con la cédula <span class="text-gray-600">{{ cedulaBuscada }}</span>.</p>
    </div>

    <!-- Resultado -->
    <div v-if="usuario" class="space-y-6">

      <!-- Ficha del usuario -->
      <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100" style="background: linear-gradient(90deg,#f0faf4,#e6f4ea)">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <h3 class="text-lg font-bold text-gray-800">{{ usuario.nombreCompleto }}</h3>
            <span class="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide"
              :class="rolClass(usuario.rol)">{{ usuario.rol }}</span>
          </div>
        </div>
        <div class="px-6 py-4 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
          <div class="flex gap-2"><span class="text-gray-400 w-28 shrink-0">Cédula</span><span class="text-gray-700 font-medium">{{ usuario.numeroIdentificacion }}</span></div>
          <div class="flex gap-2"><span class="text-gray-400 w-28 shrink-0">Correo</span><span class="text-gray-700 font-medium break-all">{{ usuario.email }}</span></div>
          <div class="flex gap-2"><span class="text-gray-400 w-28 shrink-0">Celular</span><span class="text-gray-700 font-medium">{{ usuario.whatsappTelefono || '—' }}</span></div>
          <div class="flex gap-2"><span class="text-gray-400 w-28 shrink-0">Regional</span><span class="text-gray-700 font-medium">{{ usuario.regional || '—' }}</span></div>
          <div class="flex gap-2"><span class="text-gray-400 w-28 shrink-0">Estado</span><span class="text-gray-700 font-medium capitalize">{{ usuario.estado || '—' }}</span></div>
          <div class="flex gap-2"><span class="text-gray-400 w-28 shrink-0">Cambiar clave</span><span class="text-gray-700 font-medium">{{ usuario.mustChangePassword ? 'Sí (correo genérico)' : 'No' }}</span></div>
        </div>
      </div>

      <!-- Proyectos como autor / investigador -->
      <div>
        <h4 class="text-sm font-bold text-gray-600 uppercase tracking-widest mb-3">
          Proyectos como autor / investigador <span class="text-gray-400">({{ comoAutor.length }})</span>
        </h4>
        <div v-if="!comoAutor.length" class="text-sm text-gray-400 italic">No participa como autor en ningún proyecto.</div>
        <div v-else class="space-y-3">
          <div v-for="p in comoAutor" :key="p._id" class="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-4">
            <p class="font-semibold text-gray-800 text-sm">{{ p.titulo }}</p>
            <div class="flex flex-wrap gap-x-6 gap-y-1 mt-2 text-xs text-gray-500">
              <span>Regional: <b class="text-gray-700">{{ p.regional || '—' }}</b></span>
              <span>Modalidad: <b class="text-gray-700">{{ modalidadLabels[p.modalidadParticipacion] || '—' }}</b></span>
              <span>Línea: <b class="text-gray-700">{{ p.lineaInvestigacion || '—' }}</b></span>
              <span>Estado: <b class="text-gray-700 capitalize">{{ (p.estado || '').replace(/_/g,' ') }}</b></span>
              <span>Evaluador: <b class="text-gray-700">{{ p.evaluadorRef?.nombreCompleto || 'Sin asignar' }}</b></span>
              <span v-if="p.puntajeFinal != null">Nota: <b class="text-gray-700">{{ p.puntajeFinal }}/100</b></span>
            </div>
          </div>
        </div>
      </div>

      <!-- Proyectos como evaluador -->
      <div>
        <h4 class="text-sm font-bold text-gray-600 uppercase tracking-widest mb-3">
          Proyectos que evalúa <span class="text-gray-400">({{ comoEvaluador.length }})</span>
        </h4>
        <div v-if="!comoEvaluador.length" class="text-sm text-gray-400 italic">No tiene proyectos asignados para evaluar.</div>
        <div v-else class="space-y-3">
          <div v-for="p in comoEvaluador" :key="p._id" class="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-4">
            <p class="font-semibold text-gray-800 text-sm">{{ p.titulo }}</p>
            <div class="flex flex-wrap gap-x-6 gap-y-1 mt-2 text-xs text-gray-500">
              <span>Regional: <b class="text-gray-700">{{ p.regional || '—' }}</b></span>
              <span>Modalidad: <b class="text-gray-700">{{ modalidadLabels[p.modalidadParticipacion] || '—' }}</b></span>
              <span>Estado: <b class="text-gray-700 capitalize">{{ (p.estado || '').replace(/_/g,' ') }}</b></span>
              <span v-if="p.puntajeFinal != null">Nota: <b class="text-gray-700">{{ p.puntajeFinal }}/100</b></span>
            </div>
          </div>
        </div>
      </div>

    </div>

  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({ roles: ['coordinador'] })

const { get } = useApi()

const cedula = ref('')
const cedulaBuscada = ref('')
const cargando = ref(false)
const buscado = ref(false)
const usuario = ref<any>(null)
const comoAutor = ref<any[]>([])
const comoEvaluador = ref<any[]>([])

const modalidadLabels: Record<string, string> = {
  poster: 'Póster o Cartel',
  poster_prototipo: 'Póster y Prototipo',
  ponencia: 'Conferencia o Ponencia',
}

const rolClass = (rol: string) => {
  const m: Record<string, string> = {
    investigador: 'bg-teal-100 text-teal-700',
    evaluador: 'bg-indigo-100 text-indigo-700',
    coordinador: 'bg-amber-100 text-amber-700',
    admin: 'bg-red-100 text-red-700',
  }
  return m[rol] || 'bg-gray-100 text-gray-600'
}

async function buscar() {
  if (!cedula.value) return
  cargando.value = true
  buscado.value = true
  cedulaBuscada.value = cedula.value
  usuario.value = null
  comoAutor.value = []
  comoEvaluador.value = []
  try {
    const r = await get<any>(`/proyectos/consulta-usuario/${encodeURIComponent(cedula.value)}`)
    usuario.value = r?.usuario ?? null
    comoAutor.value = r?.comoAutor ?? []
    comoEvaluador.value = r?.comoEvaluador ?? []
  } catch {
    usuario.value = null
  } finally {
    cargando.value = false
  }
}

onMounted(() => { if (!localStorage.getItem('token')) navigateTo('/login') })
</script>
