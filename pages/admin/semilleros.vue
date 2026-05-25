<template>
  <NuxtLayout name="admin">
    <!-- Cabecera -->
    <div class="flex flex-wrap items-center justify-between gap-3 mb-6">
      <h2 class="text-xl font-bold text-gray-800">Semilleros</h2>
      <div class="flex gap-2">
        <button @click="importarPredeterminados" :disabled="importando" class="text-sm px-3 py-1.5 rounded-md border border-indigo-300 text-indigo-700 hover:bg-indigo-50 disabled:opacity-50">
          {{ importando ? 'Importando...' : 'Importar predeterminados' }}
        </button>
        <button @click="abrirCrear" class="btn-primary text-sm px-4 py-1.5">+ Nuevo semillero</button>
      </div>
    </div>

    <!-- Buscador -->
    <div class="mb-4">
      <input v-model="q" class="form-input max-w-sm" placeholder="Buscar por nombre..." />
    </div>

    <!-- Tabla -->
    <div class="card overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-gray-200 text-left text-gray-500">
            <th class="pb-3 pr-4 font-medium">Nombre</th>
            <th class="pb-3 pr-4 font-medium">Estado</th>
            <th class="pb-3 font-medium text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="s in filtrados" :key="s._id" class="border-b border-gray-100 hover:bg-gray-50">
            <td class="py-3 pr-4 font-medium">{{ s.nombre }}</td>
            <td class="py-3 pr-4">
              <span :class="s.activo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'" class="px-2 py-0.5 rounded-full text-xs font-medium">
                {{ s.activo ? 'Activo' : 'Inactivo' }}
              </span>
            </td>
            <td class="py-3 text-right">
              <div class="flex justify-end gap-3">
                <button @click="toggleActivo(s)" class="text-xs text-gray-500 hover:text-gray-800 underline">
                  {{ s.activo ? 'Desactivar' : 'Activar' }}
                </button>
                <button @click="abrirEditar(s)" class="text-xs text-indigo-600 hover:text-indigo-800 underline">Editar</button>
                <button @click="confirmarEliminar(s)" class="text-xs text-red-500 hover:text-red-700 underline">Eliminar</button>
              </div>
            </td>
          </tr>
          <tr v-if="!filtrados.length">
            <td colspan="3" class="py-8 text-center text-gray-400">No hay semilleros para mostrar</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Panel lateral: crear / editar -->
    <div v-if="panelAbierto" class="fixed inset-0 z-40 flex">
      <div class="flex-1 bg-black/30" @click="cerrarPanel" />
      <div class="w-full max-w-sm bg-white shadow-xl h-full overflow-y-auto p-6 flex flex-col gap-5">
        <h3 class="text-lg font-semibold text-gray-800">{{ editando ? 'Editar semillero' : 'Nuevo semillero' }}</h3>

        <div>
          <label class="form-label">Nombre <span class="text-red-500">*</span></label>
          <input v-model="form.nombre" class="form-input" placeholder="Nombre del semillero" />
          <p v-if="errorForm" class="form-error mt-1">{{ errorForm }}</p>
        </div>

        <div class="flex items-center gap-3">
          <label class="form-label mb-0">Activo</label>
          <button type="button" @click="form.activo = !form.activo"
            :class="form.activo ? 'bg-teal-500' : 'bg-gray-300'"
            class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors">
            <span :class="form.activo ? 'translate-x-6' : 'translate-x-1'" class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
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
        <h4 class="font-semibold text-gray-800 mb-2">Eliminar semillero</h4>
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

    <!-- Toast -->
    <div v-if="toast" class="fixed bottom-4 right-4 z-50 bg-teal-600 text-white text-sm px-4 py-2.5 rounded-lg shadow-lg">
      {{ toast }}
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { SEMILLEROS_PREDETERMINADOS } from '~/composables/useSemilleros'

definePageMeta({ roles: ['admin'] })

const { get, post, patch, del } = useApi()

interface Semillero { _id: string; nombre: string; activo: boolean }

const semilleros = ref<Semillero[]>([])
const q = ref('')
const panelAbierto = ref(false)
const editando = ref<Semillero | null>(null)
const eliminandoItem = ref<Semillero | null>(null)
const guardando = ref(false)
const importando = ref(false)
const errorForm = ref('')
const toast = ref('')
let toastTimer: ReturnType<typeof setTimeout>

const form = reactive({ nombre: '', activo: true })

const filtrados = computed(() =>
  q.value
    ? semilleros.value.filter((s) => s.nombre.toLowerCase().includes(q.value.toLowerCase()))
    : semilleros.value
)

function mostrarToast(msg: string) {
  clearTimeout(toastTimer)
  toast.value = msg
  toastTimer = setTimeout(() => (toast.value = ''), 3000)
}

async function cargar() {
  semilleros.value = await get<Semillero[]>('/semilleros')
}

function abrirCrear() {
  editando.value = null
  form.nombre = ''
  form.activo = true
  errorForm.value = ''
  panelAbierto.value = true
}

function abrirEditar(s: Semillero) {
  editando.value = s
  form.nombre = s.nombre
  form.activo = s.activo
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
    if (editando.value) {
      await patch(`/semilleros/${editando.value._id}`, { nombre: form.nombre.trim(), activo: form.activo })
      mostrarToast('Semillero actualizado')
    } else {
      await post('/semilleros', { nombre: form.nombre.trim(), activo: form.activo })
      mostrarToast('Semillero creado')
    }
    cerrarPanel()
    await cargar()
  } finally {
    guardando.value = false
  }
}

async function toggleActivo(s: Semillero) {
  await patch(`/semilleros/${s._id}`, { activo: !s.activo })
  await cargar()
  mostrarToast(s.activo ? 'Semillero desactivado' : 'Semillero activado')
}

function confirmarEliminar(s: Semillero) {
  eliminandoItem.value = s
}

async function eliminar() {
  if (!eliminandoItem.value) return
  guardando.value = true
  try {
    await del(`/semilleros/${eliminandoItem.value._id}`)
    eliminandoItem.value = null
    mostrarToast('Semillero eliminado')
    await cargar()
  } finally {
    guardando.value = false
  }
}

async function importarPredeterminados() {
  importando.value = true
  try {
    const res = await post<{ insertados: number }>('/semilleros/seed', { nombres: SEMILLEROS_PREDETERMINADOS })
    await cargar()
    mostrarToast(res.insertados > 0 ? `${res.insertados} semilleros importados` : 'No hay nuevos semilleros para importar')
  } finally {
    importando.value = false
  }
}

onMounted(() => {
  if (!localStorage.getItem('token')) navigateTo('/login')
  else cargar()
})
</script>
