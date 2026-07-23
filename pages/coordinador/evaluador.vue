<template>
  <NuxtLayout name="coordinador">

    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-800">Crear evaluador</h2>
      <p class="text-sm text-gray-500 mt-1">Registra un nuevo evaluador. Su contraseña será su número de cédula. Los proyectos se asignan aparte.</p>
    </div>

    <form @submit.prevent="guardar" class="space-y-6 max-w-2xl">

      <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h3 class="text-base font-bold text-gray-800">Datos del evaluador</h3>
        </div>
        <div class="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="sm:col-span-2">
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Nombre completo <span class="text-red-500">*</span></label>
            <input v-model.trim="form.nombreCompleto" type="text" required
              class="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Cédula <span class="text-red-500">*</span></label>
            <input v-model.trim="form.numeroIdentificacion" type="text" inputmode="numeric" required
              class="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Regional</label>
            <select v-model="form.regional"
              class="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-white">
              <option value="">— Selecciona una regional —</option>
              <option v-for="r in regionales" :key="r" :value="r">{{ r }}</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Correo <span class="text-red-500">*</span></label>
            <input v-model.trim="form.email" type="email" required
              class="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Celular</label>
            <input v-model.trim="form.whatsappTelefono" type="text" inputmode="numeric"
              class="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
          </div>
        </div>
        <div class="px-6 pb-4">
          <p class="text-xs text-gray-500 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2">
            <b>Nota:</b> la contraseña inicial del evaluador será su número de cédula. La regla de regional (un evaluador no evalúa proyectos de su misma regional) aplica al momento de asignarle proyectos.
          </p>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <button type="submit" :disabled="guardando"
          class="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:shadow-md disabled:opacity-50"
          style="background: linear-gradient(90deg,#1e5c2a,#2d8a3e)">
          {{ guardando ? 'Guardando...' : 'Crear evaluador' }}
        </button>
        <button type="button" @click="limpiar" :disabled="guardando"
          class="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50">
          Limpiar
        </button>
      </div>

      <div v-if="mensaje" class="px-5 py-4 rounded-xl text-sm font-medium max-w-2xl"
        :class="ok ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'">
        {{ mensaje }}
        <div v-if="ok && creado" class="mt-2 text-xs text-green-600">
          <p><b>{{ creado.usuario?.nombreCompleto }}</b> · cc {{ creado.usuario?.numeroIdentificacion }} · {{ creado.usuario?.email }}<span v-if="creado.usuario?.regional"> · {{ creado.usuario.regional }}</span></p>
          <p class="mt-1">Ahora puedes asignarle proyectos desde <NuxtLink to="/coordinador/proyectos" class="underline font-semibold">Proyectos</NuxtLink>.</p>
        </div>
      </div>

    </form>

  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({ roles: ['coordinador'] })

const { post } = useApi()

// Regionales que ya se manejan en el sistema (lista depurada, sin duplicados por acento)
const regionales = [
  'Antioquia', 'Atlántico', 'Bolívar', 'Boyacá', 'Caldas', 'Cesar', 'Chocó',
  'Córdoba', 'Cundinamarca', 'Distrito Capital', 'Guaviare', 'Huila', 'La Guajira',
  'Magdalena', 'Nariño', 'Norte de Santander', 'Quindío', 'Risaralda', 'Santander',
  'Tolima', 'Valle del Cauca',
]

const form = reactive({
  nombreCompleto: '',
  numeroIdentificacion: '',
  regional: '',
  email: '',
  whatsappTelefono: '',
})

const guardando = ref(false)
const mensaje = ref('')
const ok = ref(false)
const creado = ref<any>(null)

function limpiar() {
  form.nombreCompleto = ''; form.numeroIdentificacion = ''
  form.regional = ''; form.email = ''; form.whatsappTelefono = ''
  mensaje.value = ''; creado.value = null
}

async function guardar() {
  mensaje.value = ''
  creado.value = null
  if (!form.nombreCompleto.trim() || !form.numeroIdentificacion.trim() || !form.email.trim()) {
    ok.value = false
    mensaje.value = 'Nombre, cédula y correo son obligatorios.'
    return
  }
  guardando.value = true
  try {
    const r = await post<any>('/proyectos/coordinador-crear-evaluador', {
      nombreCompleto: form.nombreCompleto,
      numeroIdentificacion: form.numeroIdentificacion,
      regional: form.regional,
      email: form.email,
      whatsappTelefono: form.whatsappTelefono,
    })
    ok.value = true
    creado.value = r
    mensaje.value = r?.mensaje || 'Evaluador creado correctamente.'
    limpiarSoloCampos()
  } catch (e: any) {
    ok.value = false
    mensaje.value = e?.data?.message || 'Error al crear el evaluador.'
  } finally {
    guardando.value = false
  }
}

// Limpia los campos pero mantiene el mensaje de éxito visible
function limpiarSoloCampos() {
  form.nombreCompleto = ''; form.numeroIdentificacion = ''
  form.regional = ''; form.email = ''; form.whatsappTelefono = ''
}

onMounted(() => { if (!localStorage.getItem('token')) navigateTo('/login') })
</script>
