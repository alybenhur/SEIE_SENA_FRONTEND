<template>
  <NuxtLayout name="admin">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-bold text-gray-800">Coordinadores</h2>
      <button @click="abrirNuevo" class="btn-primary bg-indigo-600 hover:bg-indigo-700 text-sm">
        + Nuevo coordinador
      </button>
    </div>

    <!-- Formulario crear / editar evento del coordinador -->
    <div v-if="mostrarForm" class="card mb-6 max-w-lg">
      <h3 class="text-base font-semibold mb-4">{{ editandoId ? 'Cambiar evento asignado' : 'Crear coordinador' }}</h3>
      <div class="space-y-3">
        <template v-if="!editandoId">
          <div>
            <label class="form-label">Nombre completo</label>
            <input v-model="form.nombreCompleto" class="form-input" placeholder="Nombre completo" />
          </div>
          <div>
            <label class="form-label">Correo electrónico</label>
            <input v-model="form.email" type="email" class="form-input" placeholder="correo@ejemplo.com" />
          </div>
          <div>
            <label class="form-label">Contraseña</label>
            <input v-model="form.password" type="password" class="form-input" placeholder="Contraseña de acceso" />
          </div>
        </template>
        <div>
          <label class="form-label">Evento asignado</label>
          <select v-model="form.eventoRef" class="form-input">
            <option value="">Sin asignar</option>
            <option v-for="e in eventos" :key="e._id" :value="e._id">{{ e.nombre }}</option>
          </select>
          <p class="text-xs text-gray-400 mt-1">El coordinador solo verá los registros de este evento.</p>
        </div>
      </div>
      <p v-if="errorForm" class="text-sm text-red-600 mt-2">{{ errorForm }}</p>
      <div class="flex gap-3 mt-4">
        <button @click="guardar" :disabled="guardando"
          class="btn-primary bg-indigo-600 hover:bg-indigo-700 text-sm disabled:opacity-50">
          {{ guardando ? 'Guardando...' : (editandoId ? 'Guardar cambios' : 'Crear coordinador') }}
        </button>
        <button @click="cerrarForm" class="text-sm text-gray-500 underline">Cancelar</button>
      </div>
    </div>

    <!-- Tabla de coordinadores -->
    <div class="card overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-gray-200 text-left text-gray-500">
            <th class="pb-3 pr-4 font-medium">Nombre</th>
            <th class="pb-3 pr-4 font-medium">Correo</th>
            <th class="pb-3 pr-4 font-medium">Evento asignado</th>
            <th class="pb-3 font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in coordinadores" :key="c._id" class="border-b border-gray-100 hover:bg-gray-50">
            <td class="py-3 pr-4 font-medium text-gray-800">{{ c.nombreCompleto }}</td>
            <td class="py-3 pr-4 text-gray-500">{{ c.email }}</td>
            <td class="py-3 pr-4">
              <span v-if="c.eventoRef" class="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                {{ c.eventoRef?.nombre ?? c.eventoRef }}
              </span>
              <span v-else class="text-gray-400 text-xs">Sin evento asignado</span>
            </td>
            <td class="py-3">
              <button @click="abrirEditar(c)"
                class="text-xs text-indigo-600 hover:text-indigo-800 font-medium underline">
                Cambiar evento
              </button>
            </td>
          </tr>
          <tr v-if="!coordinadores.length">
            <td colspan="4" class="py-8 text-center text-gray-400">No hay coordinadores registrados.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({ roles: ['admin'] })
const { get, post, patch } = useApi()

const coordinadores = ref<any[]>([])
const eventos = ref<any[]>([])
const mostrarForm = ref(false)
const editandoId = ref<string | null>(null)
const guardando = ref(false)
const errorForm = ref('')
const form = reactive({ nombreCompleto: '', email: '', password: '', eventoRef: '' })

async function cargar() {
  const [coords, evs] = await Promise.all([
    get<any[]>('/usuarios/coordinadores'),
    get<any[]>('/eventos'),
  ])
  coordinadores.value = coords
  eventos.value = evs
}

function abrirNuevo() {
  editandoId.value = null
  Object.assign(form, { nombreCompleto: '', email: '', password: '', eventoRef: '' })
  errorForm.value = ''
  mostrarForm.value = true
}

function abrirEditar(c: any) {
  editandoId.value = c._id
  form.eventoRef = c.eventoRef?._id ?? c.eventoRef ?? ''
  errorForm.value = ''
  mostrarForm.value = true
}

function cerrarForm() {
  mostrarForm.value = false
  editandoId.value = null
}

async function guardar() {
  errorForm.value = ''
  if (!editandoId.value && (!form.nombreCompleto || !form.email || !form.password)) {
    errorForm.value = 'Nombre, correo y contraseña son obligatorios.'; return
  }
  guardando.value = true
  try {
    if (editandoId.value) {
      await patch(`/usuarios/${editandoId.value}/evento`, { eventoRef: form.eventoRef })
    } else {
      await post('/usuarios/coordinador', { ...form })
    }
    cerrarForm()
    await cargar()
  } catch (e: any) {
    errorForm.value = e?.data?.message || 'Error al guardar.'
  } finally {
    guardando.value = false
  }
}

onMounted(cargar)
</script>
