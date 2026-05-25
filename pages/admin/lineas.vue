<template>
  <NuxtLayout name="admin">
    <!-- Cabecera -->
    <div class="flex flex-wrap items-center justify-between gap-3 mb-6">
      <h2 class="text-xl font-bold text-gray-800">Líneas de Investigación</h2>
      <div class="flex gap-2">
        <button @click="importarIniciales" :disabled="importando" class="text-sm px-3 py-1.5 rounded-md border border-indigo-300 text-indigo-700 hover:bg-indigo-50 disabled:opacity-50">
          {{ importando ? 'Importando...' : 'Cargar líneas iniciales' }}
        </button>
        <button @click="abrirCrear" class="btn-primary text-sm px-4 py-1.5">+ Nueva línea</button>
      </div>
    </div>

    <!-- Tabla -->
    <div class="space-y-3">
      <div v-for="l in lineas" :key="l._id" class="card">
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <span class="font-semibold text-gray-800">{{ l.linea }}</span>
              <span :class="l.activa ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'" class="px-2 py-0.5 rounded-full text-xs font-medium">
                {{ l.activa ? 'Activa' : 'Inactiva' }}
              </span>
            </div>
            <p class="text-sm text-gray-500 whitespace-pre-line">{{ l.descripcion || '—' }}</p>
          </div>
          <div class="flex gap-3 shrink-0 text-xs">
            <button @click="toggleActiva(l)" class="text-gray-500 hover:text-gray-800 underline">
              {{ l.activa ? 'Desactivar' : 'Activar' }}
            </button>
            <button @click="abrirEditar(l)" class="text-indigo-600 hover:text-indigo-800 underline">Editar</button>
            <button @click="confirmarEliminar(l)" class="text-red-500 hover:text-red-700 underline">Eliminar</button>
          </div>
        </div>
      </div>
      <div v-if="!lineas.length" class="card text-center text-gray-400 py-8">
        No hay líneas de investigación. Usa "Cargar líneas iniciales" para empezar.
      </div>
    </div>

    <!-- Panel lateral: crear / editar -->
    <div v-if="panelAbierto" class="fixed inset-0 z-40 flex">
      <div class="flex-1 bg-black/30" @click="cerrarPanel" />
      <div class="w-full max-w-md bg-white shadow-xl h-full overflow-y-auto p-6 flex flex-col gap-5">
        <h3 class="text-lg font-semibold text-gray-800">{{ editando ? 'Editar línea' : 'Nueva línea de investigación' }}</h3>

        <div>
          <label class="form-label">Línea <span class="text-red-500">*</span></label>
          <input v-model="form.linea" class="form-input" placeholder="Nombre de la línea" />
          <p v-if="errorForm" class="form-error mt-1">{{ errorForm }}</p>
        </div>

        <div>
          <label class="form-label">Descripción</label>
          <textarea v-model="form.descripcion" class="form-input resize-none" rows="5" placeholder="Descripción de la línea de investigación..." />
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
        <h4 class="font-semibold text-gray-800 mb-2">Eliminar línea</h4>
        <p class="text-sm text-gray-600 mb-5">¿Estás seguro de eliminar <strong>{{ eliminandoItem.linea }}</strong>?</p>
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
definePageMeta({ roles: ['admin'] })

const { get, post, patch, del } = useApi()

interface Linea { _id: string; linea: string; descripcion?: string; activa: boolean }

const LINEAS_INICIALES = [
  {
    linea: "Tecnológica TIC's e Inteligencia Artificial",
    descripcion: "Propuestas asociadas a la analítica de datos, desarrollo de software, automatización inteligente, ciberseguridad, experiencia de usuario y transformación digital.",
  },
  {
    linea: 'Usuario',
    descripcion: 'Soluciones innovadoras enfocadas en atención al usuario.',
  },
  {
    linea: 'Comercialización y Logística',
    descripcion: 'Soluciones innovadoras enfocadas en la gestión comercial, logística inteligente y optimización de cadenas de suministro.',
  },
]

const lineas = ref<Linea[]>([])
const panelAbierto = ref(false)
const editando = ref<Linea | null>(null)
const eliminandoItem = ref<Linea | null>(null)
const guardando = ref(false)
const importando = ref(false)
const errorForm = ref('')
const toast = ref('')
let toastTimer: ReturnType<typeof setTimeout>

const form = reactive({ linea: '', descripcion: '', activa: true })

function mostrarToast(msg: string) {
  clearTimeout(toastTimer)
  toast.value = msg
  toastTimer = setTimeout(() => (toast.value = ''), 3000)
}

async function cargar() {
  lineas.value = await get<Linea[]>('/lineas-investigacion')
}

function abrirCrear() {
  editando.value = null
  form.linea = ''
  form.descripcion = ''
  form.activa = true
  errorForm.value = ''
  panelAbierto.value = true
}

function abrirEditar(l: Linea) {
  editando.value = l
  form.linea = l.linea
  form.descripcion = l.descripcion ?? ''
  form.activa = l.activa
  errorForm.value = ''
  panelAbierto.value = true
}

function cerrarPanel() {
  panelAbierto.value = false
  editando.value = null
}

async function guardar() {
  if (!form.linea.trim()) { errorForm.value = 'El nombre de la línea es obligatorio'; return }
  errorForm.value = ''
  guardando.value = true
  try {
    if (editando.value) {
      await patch(`/lineas-investigacion/${editando.value._id}`, { linea: form.linea.trim(), descripcion: form.descripcion.trim(), activa: form.activa })
      mostrarToast('Línea actualizada')
    } else {
      await post('/lineas-investigacion', { linea: form.linea.trim(), descripcion: form.descripcion.trim(), activa: form.activa })
      mostrarToast('Línea creada')
    }
    cerrarPanel()
    await cargar()
  } finally {
    guardando.value = false
  }
}

async function toggleActiva(l: Linea) {
  await patch(`/lineas-investigacion/${l._id}`, { activa: !l.activa })
  await cargar()
  mostrarToast(l.activa ? 'Línea desactivada' : 'Línea activada')
}

function confirmarEliminar(l: Linea) {
  eliminandoItem.value = l
}

async function eliminar() {
  if (!eliminandoItem.value) return
  guardando.value = true
  try {
    await del(`/lineas-investigacion/${eliminandoItem.value._id}`)
    eliminandoItem.value = null
    mostrarToast('Línea eliminada')
    await cargar()
  } finally {
    guardando.value = false
  }
}

async function importarIniciales() {
  importando.value = true
  try {
    const res = await post<{ insertados: number }>('/lineas-investigacion/seed', { items: LINEAS_INICIALES })
    await cargar()
    mostrarToast(res.insertados > 0 ? `${res.insertados} líneas cargadas` : 'Las líneas ya estaban registradas')
  } finally {
    importando.value = false
  }
}

onMounted(() => {
  if (!localStorage.getItem('token')) navigateTo('/login')
  else cargar()
})
</script>
