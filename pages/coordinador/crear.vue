<template>
  <NuxtLayout name="coordinador">

    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-800">Crear proyecto e investigadores</h2>
      <p class="text-sm text-gray-500 mt-1">Registra un proyecto nuevo y sus autores (según la estructura de la matriz). El evaluador se asigna aparte.</p>
    </div>

    <form @submit.prevent="guardar" class="space-y-6">

      <!-- Datos del proyecto -->
      <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h3 class="text-base font-bold text-gray-800">Datos del proyecto</h3>
        </div>
        <div class="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="sm:col-span-2">
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Nombre del proyecto <span class="text-red-500">*</span></label>
            <input v-model.trim="form.titulo" type="text" required
              class="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Regional</label>
            <input v-model.trim="form.regional" type="text" placeholder="Ej. Antioquia"
              class="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Centro de formación</label>
            <input v-model.trim="form.centro" type="text" placeholder="Ej. CTMEA"
              class="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Tipo (modalidad) <span class="text-red-500">*</span></label>
            <select v-model="form.modalidad" required
              class="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-white">
              <option value="poster">Póster o Cartel</option>
              <option value="poster_prototipo">Póster y Prototipo</option>
              <option value="ponencia">Conferencia o Ponencia</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Línea</label>
            <select v-model="form.linea"
              class="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-white">
              <option value="TIC's e IA">TIC's e IA</option>
              <option value="Usuario y Comercialización">Usuario y Comercialización</option>
              <option value="Logistica">Logistica</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Autores -->
      <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <h3 class="text-base font-bold text-gray-800">Autores / investigadores</h3>
          <button type="button" @click="agregarAutor"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-green-300 text-green-700 hover:bg-green-50 transition-colors">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            Agregar autor
          </button>
        </div>
        <div class="px-6 py-5 space-y-4">
          <div v-for="(a, i) in form.autores" :key="i"
            class="rounded-xl border border-gray-100 bg-gray-50/60 p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 relative">
            <div class="sm:col-span-2 flex items-center justify-between">
              <span class="text-xs font-bold text-gray-500 uppercase tracking-wide">Autor {{ i + 1 }}</span>
              <button v-if="form.autores.length > 1" type="button" @click="quitarAutor(i)"
                class="text-xs text-red-500 hover:text-red-700 font-semibold">Quitar</button>
            </div>
            <div>
              <label class="block text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1">Nombre completo <span class="text-red-500">*</span></label>
              <input v-model.trim="a.nombreCompleto" type="text"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300" />
            </div>
            <div>
              <label class="block text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1">Cédula <span class="text-red-500">*</span></label>
              <input v-model.trim="a.documento" type="text" inputmode="numeric"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300" />
            </div>
            <div>
              <label class="block text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1">Celular</label>
              <input v-model.trim="a.telefono" type="text" inputmode="numeric"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300" />
            </div>
            <div>
              <label class="block text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1">Correo <span class="text-gray-400 font-normal normal-case">(si no, se genera con la cédula)</span></label>
              <input v-model.trim="a.email" type="email"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300" />
            </div>
          </div>
        </div>
      </div>

      <!-- Acciones -->
      <div class="flex flex-wrap items-center gap-3">
        <button type="submit" :disabled="guardando"
          class="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:shadow-md disabled:opacity-50"
          style="background: linear-gradient(90deg,#1e5c2a,#2d8a3e)">
          {{ guardando ? 'Guardando...' : 'Crear proyecto' }}
        </button>
        <button type="button" @click="limpiar" :disabled="guardando"
          class="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50">
          Limpiar
        </button>
      </div>

      <!-- Mensaje -->
      <div v-if="mensaje" class="px-5 py-4 rounded-xl text-sm font-medium"
        :class="ok ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'">
        {{ mensaje }}
        <div v-if="ok && creado" class="mt-2 text-xs text-green-600">
          <p>Proyecto: <b>{{ creado.proyecto?.titulo }}</b></p>
          <p v-if="creado.usuariosCreados?.length">Investigadores nuevos: {{ creado.usuariosCreados.join(', ') }}</p>
          <p class="mt-1">Recuerda asignarle un evaluador desde <NuxtLink to="/coordinador/proyectos" class="underline font-semibold">Proyectos</NuxtLink>.</p>
        </div>
      </div>

    </form>

  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({ roles: ['coordinador'] })

const { post } = useApi()

function autorVacio() { return { nombreCompleto: '', documento: '', telefono: '', email: '' } }

const form = reactive({
  titulo: '',
  regional: '',
  centro: '',
  modalidad: 'poster',
  linea: "TIC's e IA",
  autores: [autorVacio()],
})

const guardando = ref(false)
const mensaje = ref('')
const ok = ref(false)
const creado = ref<any>(null)

function agregarAutor() { form.autores.push(autorVacio()) }
function quitarAutor(i: number) { form.autores.splice(i, 1) }

function limpiar() {
  form.titulo = ''; form.regional = ''; form.centro = ''
  form.modalidad = 'poster'; form.linea = "TIC's e IA"
  form.autores = [autorVacio()]
  mensaje.value = ''; creado.value = null
}

async function guardar() {
  mensaje.value = ''
  creado.value = null
  const autoresValidos = form.autores.filter(a => a.nombreCompleto.trim() && a.documento.trim())
  if (!form.titulo.trim()) { ok.value = false; mensaje.value = 'El nombre del proyecto es obligatorio.'; return }
  if (!autoresValidos.length) { ok.value = false; mensaje.value = 'Debe indicar al menos un autor con nombre y cédula.'; return }

  guardando.value = true
  try {
    const r = await post<any>('/proyectos/coordinador-crear', {
      titulo: form.titulo,
      regional: form.regional,
      centro: form.centro,
      modalidad: form.modalidad,
      linea: form.linea,
      autores: autoresValidos,
    })
    ok.value = true
    creado.value = r
    mensaje.value = r?.mensaje || 'Proyecto creado correctamente.'
    // Reiniciar el formulario dejando el mensaje visible
    form.titulo = ''; form.regional = ''; form.centro = ''
    form.modalidad = 'poster'; form.linea = "TIC's e IA"
    form.autores = [autorVacio()]
  } catch (e: any) {
    ok.value = false
    mensaje.value = e?.data?.message || 'Error al crear el proyecto.'
  } finally {
    guardando.value = false
  }
}

onMounted(() => { if (!localStorage.getItem('token')) navigateTo('/login') })
</script>
