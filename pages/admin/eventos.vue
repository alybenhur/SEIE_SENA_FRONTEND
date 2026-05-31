<template>
  <NuxtLayout name="admin">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-bold text-gray-800">Eventos</h2>
      <button @click="abrirNuevo" class="btn-primary bg-teal-600 hover:bg-teal-700 text-sm">+ Nuevo evento</button>
    </div>

    <!-- Formulario crear / editar -->
    <div v-if="mostrarFormulario" class="card mb-6">
      <h3 class="text-base font-semibold mb-4">{{ editandoId ? 'Editar evento' : 'Crear evento' }}</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">

        <!-- Nombre -->
        <div class="md:col-span-2">
          <label class="form-label">Nombre del evento</label>
          <input v-model="form.nombre" class="form-input" placeholder="Ej: Feria de Investigación SENA 2026" />
        </div>

        <!-- Descripción WYSIWYG -->
        <div class="md:col-span-2">
          <label class="form-label">Descripción del evento</label>
          <ClientOnly>
            <WysiwygEditor v-model="form.descripcion" />
            <template #fallback>
              <textarea v-model="form.descripcion" class="form-input resize-none" rows="4"
                placeholder="Descripción del evento..." />
            </template>
          </ClientOnly>
        </div>

        <!-- Fechas -->
        <div>
          <label class="form-label">Fecha de inicio</label>
          <input v-model="form.fechaInicio" type="date" class="form-input" />
        </div>
        <div>
          <label class="form-label">Fecha de cierre del evento</label>
          <input v-model="form.fechaFin" type="date" class="form-input" />
        </div>
        <div>
          <label class="form-label">Fecha límite de registro de participantes</label>
          <input v-model="form.fechaLimiteRegistro" type="date" class="form-input" :max="maxFechaLimite" />
          <p v-if="form.fechaInicio" class="text-xs text-gray-400 mt-1">
            Debe ser máximo el {{ maxFechaLimiteTexto }} (7 días antes del inicio)
          </p>
          <p v-if="errorFechaLimite" class="form-error">{{ errorFechaLimite }}</p>
        </div>

        <!-- Lugar -->
        <div>
          <label class="form-label">Lugar (opcional)</label>
          <input v-model="form.lugar" class="form-input" placeholder="Ciudad o plataforma virtual" />
        </div>

        <!-- Estado -->
        <div>
          <label class="form-label">Estado</label>
          <select v-model="form.estado" class="form-input">
            <option value="inactivo">Inactivo</option>
            <option value="activo">Activo</option>
            <option value="finalizado">Finalizado</option>
          </select>
        </div>

        <!-- Imagen -->
        <div class="md:col-span-2">
          <label class="form-label">Imagen del evento</label>
          <div class="flex items-start gap-4">
            <!-- Preview -->
            <div v-if="form.imagen || imagenPreview"
              class="w-32 h-20 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
              <img :src="imagenPreview || form.imagen" class="w-full h-full object-cover" alt="Preview" />
            </div>
            <!-- Upload -->
            <div class="flex-1">
              <label class="flex items-center gap-2 cursor-pointer w-fit">
                <span class="btn-primary bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs border border-gray-300">
                  {{ subiendoImagen ? 'Subiendo...' : '📁 Seleccionar imagen' }}
                </span>
                <input type="file" accept="image/*" class="hidden"
                  :disabled="subiendoImagen" @change="subirImagen" />
              </label>
              <p class="text-xs text-gray-400 mt-1">PNG, JPG o WEBP · Máx. 5 MB</p>
              <p v-if="errorImagen" class="form-error">{{ errorImagen }}</p>
              <p v-if="form.imagen && !imagenPreview" class="text-xs text-teal-600 mt-1">✓ Imagen cargada</p>
            </div>
          </div>
        </div>

      </div>

      <div class="flex gap-3 mt-5">
        <button @click="guardar" :disabled="subiendoImagen" class="btn-primary bg-teal-600 text-sm disabled:opacity-50">
          {{ editandoId ? 'Guardar cambios' : 'Crear evento' }}
        </button>
        <button @click="cerrarFormulario" class="text-sm text-gray-500 underline">Cancelar</button>
      </div>
    </div>

    <!-- Tabla -->
    <div class="card overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-gray-200 text-left text-gray-500">
            <th class="pb-3 pr-3 font-medium w-10"></th>
            <th class="pb-3 pr-4 font-medium">Nombre</th>
            <th class="pb-3 pr-4 font-medium">Inicio</th>
            <th class="pb-3 pr-4 font-medium">Fin</th>
            <th class="pb-3 pr-4 font-medium">Límite registro</th>
            <th class="pb-3 pr-4 font-medium">Estado</th>
            <th class="pb-3 font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="e in eventos" :key="e._id" class="border-b border-gray-100 hover:bg-gray-50">
            <td class="py-3 pr-3">
              <img v-if="e.imagen" :src="e.imagen" class="w-10 h-7 object-cover rounded" alt="" />
              <div v-else class="w-10 h-7 bg-gray-100 rounded flex items-center justify-center text-gray-300 text-xs">—</div>
            </td>
            <td class="py-3 pr-4 font-medium">{{ e.nombre }}</td>
            <td class="py-3 pr-4 text-gray-500">{{ formatFecha(e.fechaInicio) }}</td>
            <td class="py-3 pr-4 text-gray-500">{{ formatFecha(e.fechaFin) }}</td>
            <td class="py-3 pr-4 text-gray-500">{{ formatFecha(e.fechaLimiteRegistro) }}</td>
            <td class="py-3 pr-4">
              <select :value="e.estado" @change="(ev: any) => cambiarEstado(e._id, ev.target.value)"
                class="text-xs border border-gray-300 rounded px-2 py-1">
                <option value="inactivo">Inactivo</option>
                <option value="activo">Activo</option>
                <option value="finalizado">Finalizado</option>
              </select>
            </td>
            <td class="py-3">
              <button @click="abrirEditar(e)"
                class="text-xs text-teal-600 hover:text-teal-800 font-medium underline">
                Editar
              </button>
            </td>
          </tr>
          <tr v-if="!eventos.length">
            <td colspan="7" class="py-8 text-center text-gray-400">No hay eventos registrados</td>
          </tr>
        </tbody>
      </table>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({ roles: ['admin'] })
const { get, post, patch } = useApi()
const store = useAuthStore()

const eventos = ref<any[]>([])
const mostrarFormulario = ref(false)
const editandoId = ref<string | null>(null)
const subiendoImagen = ref(false)
const imagenPreview = ref('')
const errorImagen = ref('')

const formVacio = () => ({
  nombre: '',
  descripcion: '',
  fechaInicio: '',
  fechaFin: '',
  fechaLimiteRegistro: '',
  estado: 'inactivo',
  lugar: '',
  imagen: '',
})
const form = reactive(formVacio())

async function cargar() {
  eventos.value = await get('/eventos') as any[]
}

function abrirNuevo() {
  editandoId.value = null
  Object.assign(form, formVacio())
  imagenPreview.value = ''
  errorImagen.value = ''
  mostrarFormulario.value = true
}

function abrirEditar(e: any) {
  editandoId.value = e._id
  form.nombre = e.nombre ?? ''
  form.descripcion = e.descripcion ?? ''
  form.fechaInicio = toInputDate(e.fechaInicio)
  form.fechaFin = toInputDate(e.fechaFin)
  form.fechaLimiteRegistro = toInputDate(e.fechaLimiteRegistro)
  form.estado = e.estado ?? 'inactivo'
  form.lugar = e.lugar ?? ''
  form.imagen = e.imagen ?? ''
  imagenPreview.value = ''
  errorImagen.value = ''
  mostrarFormulario.value = true
}

function cerrarFormulario() {
  mostrarFormulario.value = false
  editandoId.value = null
}

async function subirImagen(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  errorImagen.value = ''
  subiendoImagen.value = true
  const config = useRuntimeConfig()
  try {
    const fd = new FormData()
    fd.append('file', file)
    const res = await $fetch<{ url: string }>(`${config.public.apiBase}/upload`, {
      method: 'POST',
      body: fd,
      headers: store.token ? { Authorization: `Bearer ${store.token}` } : {},
    })
    form.imagen = res.url
    imagenPreview.value = res.url
  } catch {
    errorImagen.value = 'Error al subir la imagen. Intenta nuevamente.'
  } finally {
    subiendoImagen.value = false
    input.value = ''
  }
}

async function cambiarEstado(id: string, estado: string) {
  await patch(`/eventos/${id}`, { estado })
  await cargar()
}

const parseFecha = (f: string) => f.includes('T') ? new Date(f) : new Date(f + 'T12:00:00')
const formatFecha = (f: string) => f ? parseFecha(f).toLocaleDateString('es-CO') : '—'
const toInputDate = (f: string) => f ? new Date(f).toISOString().split('T')[0] : ''

const maxFechaLimite = computed(() => {
  if (!form.fechaInicio) return ''
  const d = new Date(form.fechaInicio)
  d.setDate(d.getDate() - 7)
  return toInputDate(d.toISOString())
})

const maxFechaLimiteTexto = computed(() => {
  if (!maxFechaLimite.value) return ''
  return new Date(maxFechaLimite.value + 'T12:00:00').toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })
})

const errorFechaLimite = computed(() => {
  if (!form.fechaLimiteRegistro || !form.fechaInicio) return ''
  if (form.fechaLimiteRegistro > maxFechaLimite.value) {
    return `La fecha límite debe ser al menos 7 días antes del inicio (máximo ${maxFechaLimiteTexto.value}).`
  }
  return ''
})

async function guardar() {
  if (errorFechaLimite.value) return
  if (editandoId.value) {
    await patch(`/eventos/${editandoId.value}`, { ...form })
  } else {
    await post('/eventos', { ...form })
  }
  cerrarFormulario()
  await cargar()
}

onMounted(cargar)
</script>
