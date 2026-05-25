<template>
  <NuxtLayout name="admin">
    <!-- Cabecera -->
    <div class="flex flex-wrap items-center justify-between gap-3 mb-6">
      <h2 class="text-xl font-bold text-gray-800">Instituciones / Organizaciones</h2>
      <div class="flex flex-wrap gap-2">
        <button @click="confirmarReemplazar = true" :disabled="operando" class="text-sm px-3 py-1.5 rounded-md border border-orange-300 text-orange-700 hover:bg-orange-50 disabled:opacity-50">
          Reemplazar todo con predeterminadas
        </button>
        <button @click="importarPredeterminadas" :disabled="operando" class="text-sm px-3 py-1.5 rounded-md border border-indigo-300 text-indigo-700 hover:bg-indigo-50 disabled:opacity-50">
          {{ importando ? 'Importando...' : 'Importar predeterminadas' }}
        </button>
        <button @click="abrirCrear" class="btn-primary text-sm px-4 py-1.5">+ Nueva institución</button>
      </div>
    </div>

    <!-- Buscador + contador -->
    <div class="flex items-center gap-4 mb-4">
      <input v-model="q" class="form-input max-w-sm" placeholder="Buscar por nombre o regional..." />
      <span class="text-sm text-gray-400">{{ filtradas.length }} de {{ instituciones.length }}</span>
    </div>

    <!-- Tabla -->
    <div class="card overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-gray-200 text-left text-gray-500">
            <th class="pb-3 pr-4 font-medium">Centro de Formación</th>
            <th class="pb-3 pr-4 font-medium">Regional</th>
            <th class="pb-3 pr-4 font-medium text-center">Aprendices</th>
            <th class="pb-3 pr-4 font-medium text-center">Instructores</th>
            <th class="pb-3 pr-4 font-medium">Estado</th>
            <th class="pb-3 font-medium text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="inst in filtradas" :key="inst._id" class="border-b border-gray-100 hover:bg-gray-50">
            <td class="py-3 pr-4">{{ inst.nombre }}</td>
            <td class="py-3 pr-4 text-gray-500">{{ inst.departamento || '—' }}</td>
            <td class="py-3 pr-4 text-center">{{ inst.aprendices ?? 0 }}</td>
            <td class="py-3 pr-4 text-center">{{ inst.instructores ?? 0 }}</td>
            <td class="py-3 pr-4">
              <span :class="inst.activa ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'" class="px-2 py-0.5 rounded-full text-xs font-medium">
                {{ inst.activa ? 'Activa' : 'Inactiva' }}
              </span>
            </td>
            <td class="py-3 text-right">
              <div class="flex justify-end gap-3">
                <button @click="toggleActiva(inst)" class="text-xs text-gray-500 hover:text-gray-800 underline">
                  {{ inst.activa ? 'Desactivar' : 'Activar' }}
                </button>
                <button @click="abrirEditar(inst)" class="text-xs text-indigo-600 hover:text-indigo-800 underline">Editar</button>
                <button @click="confirmarEliminar(inst)" class="text-xs text-red-500 hover:text-red-700 underline">Eliminar</button>
              </div>
            </td>
          </tr>
          <tr v-if="!filtradas.length">
            <td colspan="6" class="py-8 text-center text-gray-400">No hay instituciones para mostrar</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Panel lateral: crear / editar -->
    <div v-if="panelAbierto" class="fixed inset-0 z-40 flex">
      <div class="flex-1 bg-black/30" @click="cerrarPanel" />
      <div class="w-full max-w-sm bg-white shadow-xl h-full overflow-y-auto p-6 flex flex-col gap-5">
        <h3 class="text-lg font-semibold text-gray-800">{{ editando ? 'Editar institución' : 'Nueva institución' }}</h3>

        <div>
          <label class="form-label">Nombre <span class="text-red-500">*</span></label>
          <input v-model="form.nombre" class="form-input" placeholder="Ej: Centro de Comercio - Antioquia" />
          <p v-if="errorForm" class="form-error mt-1">{{ errorForm }}</p>
        </div>

        <div>
          <label class="form-label">Regional / Departamento</label>
          <input v-model="form.departamento" class="form-input" placeholder="Ej: Antioquia" />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="form-label">Aprendices</label>
            <input v-model.number="form.aprendices" type="number" min="0" class="form-input" placeholder="0" />
          </div>
          <div>
            <label class="form-label">Instructores</label>
            <input v-model.number="form.instructores" type="number" min="0" class="form-input" placeholder="0" />
          </div>
        </div>

        <div class="flex items-center gap-3">
          <label class="form-label mb-0">Activa</label>
          <button type="button" @click="form.activa = !form.activa"
            :class="form.activa ? 'bg-teal-500' : 'bg-gray-300'"
            class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors">
            <span :class="form.activa ? 'translate-x-6' : 'translate-x-1'" class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
          </button>
        </div>

        <div class="flex gap-3 mt-auto pt-4 border-t border-gray-100">
          <button @click="guardar" :disabled="guardando" class="btn-primary flex-1 disabled:opacity-50">
            {{ guardando ? 'Guardando...' : 'Guardar' }}
          </button>
          <button @click="cerrarPanel" class="flex-1 px-4 py-2 rounded-md border border-gray-300 text-sm text-gray-600 hover:bg-gray-50">
            Cancelar
          </button>
        </div>
      </div>
    </div>

    <!-- Confirmación eliminar -->
    <div v-if="eliminandoItem" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div class="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full mx-4">
        <h4 class="font-semibold text-gray-800 mb-2">Eliminar institución</h4>
        <p class="text-sm text-gray-600 mb-5">¿Estás seguro de eliminar <strong>{{ eliminandoItem.nombre }}</strong>? Esta acción no se puede deshacer.</p>
        <div class="flex gap-3">
          <button @click="eliminar" :disabled="guardando" class="flex-1 px-4 py-2 rounded-md bg-red-500 text-white text-sm font-medium hover:bg-red-600 disabled:opacity-50">
            {{ guardando ? 'Eliminando...' : 'Eliminar' }}
          </button>
          <button @click="eliminandoItem = null" class="flex-1 px-4 py-2 rounded-md border border-gray-300 text-sm text-gray-600 hover:bg-gray-50">
            Cancelar
          </button>
        </div>
      </div>
    </div>

    <!-- Confirmación Reemplazar todo -->
    <div v-if="confirmarReemplazar" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div class="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full mx-4">
        <h4 class="font-semibold text-gray-800 mb-2">Reemplazar todas las instituciones</h4>
        <p class="text-sm text-gray-600 mb-5">
          Esta acción <strong>eliminará todas las instituciones actuales</strong> ({{ instituciones.length }}) y cargará los
          <strong>48 Centros de Formación SENA</strong> con sus aprendices e instructores. No se puede deshacer.
        </p>
        <div class="flex gap-3">
          <button @click="reemplazarTodo" :disabled="operando" class="flex-1 px-4 py-2 rounded-md bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 disabled:opacity-50">
            {{ operando ? 'Procesando...' : 'Sí, reemplazar todo' }}
          </button>
          <button @click="confirmarReemplazar = false" class="flex-1 px-4 py-2 rounded-md border border-gray-300 text-sm text-gray-600 hover:bg-gray-50">
            Cancelar
          </button>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <div v-if="toast" class="fixed bottom-4 right-4 z-50 bg-teal-600 text-white text-sm px-4 py-2.5 rounded-lg shadow-lg">
      {{ toast }}
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { INSTITUCIONES_PREDETERMINADAS } from '~/composables/useInstituciones'

definePageMeta({ roles: ['admin'] })

const { get, post, patch, del } = useApi()

interface Institucion {
  _id: string
  nombre: string
  departamento?: string
  aprendices?: number
  instructores?: number
  activa: boolean
}

const instituciones = ref<Institucion[]>([])
const q = ref('')
const panelAbierto = ref(false)
const editando = ref<Institucion | null>(null)
const eliminandoItem = ref<Institucion | null>(null)
const guardando = ref(false)
const importando = ref(false)
const confirmarReemplazar = ref(false)
const operando = computed(() => guardando.value || importando.value)
const errorForm = ref('')
const toast = ref('')
let toastTimer: ReturnType<typeof setTimeout>

const form = reactive({ nombre: '', departamento: '', aprendices: 0, instructores: 0, activa: true })

const filtradas = computed(() =>
  q.value
    ? instituciones.value.filter(
        (i) =>
          i.nombre.toLowerCase().includes(q.value.toLowerCase()) ||
          (i.departamento ?? '').toLowerCase().includes(q.value.toLowerCase()),
      )
    : instituciones.value,
)

function mostrarToast(msg: string) {
  clearTimeout(toastTimer)
  toast.value = msg
  toastTimer = setTimeout(() => (toast.value = ''), 3000)
}

async function cargar() {
  instituciones.value = await get<Institucion[]>('/instituciones')
}

function abrirCrear() {
  editando.value = null
  form.nombre = ''
  form.departamento = ''
  form.aprendices = 0
  form.instructores = 0
  form.activa = true
  errorForm.value = ''
  panelAbierto.value = true
}

function abrirEditar(inst: Institucion) {
  editando.value = inst
  form.nombre = inst.nombre
  form.departamento = inst.departamento ?? ''
  form.aprendices = inst.aprendices ?? 0
  form.instructores = inst.instructores ?? 0
  form.activa = inst.activa
  errorForm.value = ''
  panelAbierto.value = true
}

function cerrarPanel() {
  panelAbierto.value = false
  editando.value = null
}

async function guardar() {
  if (!form.nombre.trim()) { errorForm.value = 'El nombre es obligatorio'; return }
  errorForm.value = ''
  guardando.value = true
  try {
    const payload = {
      nombre: form.nombre.trim(),
      departamento: form.departamento.trim() || undefined,
      aprendices: form.aprendices,
      instructores: form.instructores,
      activa: form.activa,
    }
    if (editando.value) {
      await patch(`/instituciones/${editando.value._id}`, payload)
      mostrarToast('Institución actualizada')
    } else {
      await post('/instituciones', payload)
      mostrarToast('Institución creada')
    }
    cerrarPanel()
    await cargar()
  } finally {
    guardando.value = false
  }
}

async function toggleActiva(inst: Institucion) {
  await patch(`/instituciones/${inst._id}`, { activa: !inst.activa })
  await cargar()
  mostrarToast(inst.activa ? 'Institución desactivada' : 'Institución activada')
}

function confirmarEliminar(inst: Institucion) {
  eliminandoItem.value = inst
}

async function eliminar() {
  if (!eliminandoItem.value) return
  guardando.value = true
  try {
    await del(`/instituciones/${eliminandoItem.value._id}`)
    eliminandoItem.value = null
    mostrarToast('Institución eliminada')
    await cargar()
  } finally {
    guardando.value = false
  }
}

async function importarPredeterminadas() {
  importando.value = true
  try {
    const res = await post<{ insertados: number }>('/instituciones/seed', { items: INSTITUCIONES_PREDETERMINADAS })
    await cargar()
    mostrarToast(res.insertados > 0 ? `${res.insertados} instituciones importadas` : 'No hay nuevas instituciones para importar')
  } finally {
    importando.value = false
  }
}

async function reemplazarTodo() {
  importando.value = true
  try {
    await del('/instituciones/all')
    const res = await post<{ insertados: number }>('/instituciones/seed', { items: INSTITUCIONES_PREDETERMINADAS })
    confirmarReemplazar.value = false
    await cargar()
    mostrarToast(`Listo: ${res.insertados} centros SENA cargados`)
  } finally {
    importando.value = false
  }
}

onMounted(() => {
  if (!localStorage.getItem('token')) navigateTo('/login')
  else cargar()
})
</script>
