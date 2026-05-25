<template>
  <NuxtLayout name="evaluador">

    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-800">Mi perfil</h2>
      <p class="text-sm text-gray-500 mt-1">Información de tu cuenta y ajustes de seguridad.</p>
    </div>

    <div v-if="cargando" class="text-center py-16 text-gray-400 text-sm">Cargando...</div>

    <div v-else class="space-y-6">

      <!-- Datos personales -->
      <section class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h3 class="text-sm font-semibold text-gray-600 uppercase tracking-wide">Datos personales</h3>
        </div>
        <div class="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
          <div>
            <p class="text-xs text-gray-400 mb-0.5">Nombre completo</p>
            <p class="font-medium text-gray-800">{{ perfil.nombreCompleto || '—' }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-400 mb-0.5">Correo electrónico</p>
            <p class="font-medium text-gray-800">{{ perfil.email || '—' }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-400 mb-0.5">N.º identificación</p>
            <p class="font-medium text-gray-800">{{ perfil.numeroIdentificacion || '—' }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-400 mb-0.5">WhatsApp / Teléfono</p>
            <p class="font-medium text-gray-800">{{ perfil.whatsappTelefono || '—' }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-400 mb-0.5">Institución</p>
            <p class="font-medium text-gray-800">{{ perfil.institucion || '—' }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-400 mb-0.5">Cargo actual</p>
            <p class="font-medium text-gray-800">{{ perfil.cargoActual || '—' }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-400 mb-0.5">Modalidad de asistencia</p>
            <p class="font-medium text-gray-800 capitalize">{{ perfil.modalidadAsistencia || '—' }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-400 mb-0.5">Estado de cuenta</p>
            <span :class="perfil.estado === 'aprobado' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'"
              class="inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize">
              {{ perfil.estado || '—' }}
            </span>
          </div>
        </div>
      </section>

      <!-- Perfil académico -->
      <section v-if="perfil.perfilAcademico" class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h3 class="text-sm font-semibold text-gray-600 uppercase tracking-wide">Perfil académico</h3>
        </div>
        <div class="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
          <div>
            <p class="text-xs text-gray-400 mb-0.5">Nivel de formación</p>
            <p class="font-medium text-gray-800">{{ perfil.perfilAcademico.nivelFormacion || '—' }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-400 mb-0.5">Áreas disciplinares</p>
            <p class="font-medium text-gray-800">{{ perfil.perfilAcademico.areasDisciplinares?.join(', ') || '—' }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-400 mb-0.5">Grupo / Red de investigación</p>
            <p class="font-medium text-gray-800">{{ perfil.perfilAcademico.grupoRedInvestigacion || '—' }}</p>
          </div>
          <div class="flex flex-col gap-1">
            <p class="text-xs text-gray-400 mb-0.5">Enlaces</p>
            <a v-if="perfil.perfilAcademico.enlaceCvlac" :href="perfil.perfilAcademico.enlaceCvlac" target="_blank"
              class="text-indigo-600 hover:underline text-xs">CvLAC</a>
            <a v-if="perfil.perfilAcademico.enlaceOrcid" :href="perfil.perfilAcademico.enlaceOrcid" target="_blank"
              class="text-indigo-600 hover:underline text-xs">ORCID</a>
            <a v-if="perfil.perfilAcademico.enlaceGoogleScholar" :href="perfil.perfilAcademico.enlaceGoogleScholar" target="_blank"
              class="text-indigo-600 hover:underline text-xs">Google Scholar</a>
            <span v-if="!perfil.perfilAcademico.enlaceCvlac && !perfil.perfilAcademico.enlaceOrcid && !perfil.perfilAcademico.enlaceGoogleScholar"
              class="text-gray-800">—</span>
          </div>
        </div>
      </section>

      <!-- Cambiar contraseña -->
      <section class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h3 class="text-sm font-semibold text-gray-600 uppercase tracking-wide">Cambiar contraseña</h3>
        </div>
        <div class="px-6 py-5 max-w-md">

          <div v-if="mensajePassword"
            :class="errorPassword ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'"
            class="mb-4 flex items-center gap-2 px-4 py-3 rounded-xl border text-sm">
            <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path v-if="errorPassword" stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
            {{ mensajePassword }}
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña actual</label>
              <input v-model="formPwd.actual" type="password" autocomplete="current-password"
                class="w-full text-sm border border-gray-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                placeholder="Ingresa tu contraseña actual" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nueva contraseña</label>
              <input v-model="formPwd.nueva" type="password" autocomplete="new-password"
                class="w-full text-sm border border-gray-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                placeholder="Mínimo 6 caracteres" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Confirmar nueva contraseña</label>
              <input v-model="formPwd.confirmar" type="password" autocomplete="new-password"
                class="w-full text-sm border border-gray-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                placeholder="Repite la nueva contraseña" />
            </div>
            <button @click="cambiarPassword" :disabled="guardandoPwd"
              class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-xl font-semibold transition-colors disabled:opacity-50">
              {{ guardandoPwd ? 'Guardando...' : 'Actualizar contraseña' }}
            </button>
          </div>
        </div>
      </section>

    </div>

  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({ roles: ['evaluador'] })

const { get, patch } = useApi()

const perfil = ref<any>({})
const cargando = ref(true)

const formPwd = reactive({ actual: '', nueva: '', confirmar: '' })
const guardandoPwd = ref(false)
const mensajePassword = ref('')
const errorPassword = ref(false)

async function cambiarPassword() {
  mensajePassword.value = ''
  errorPassword.value = false

  if (!formPwd.actual || !formPwd.nueva || !formPwd.confirmar) {
    mensajePassword.value = 'Completa todos los campos.'
    errorPassword.value = true
    return
  }
  if (formPwd.nueva.length < 6) {
    mensajePassword.value = 'La nueva contraseña debe tener al menos 6 caracteres.'
    errorPassword.value = true
    return
  }
  if (formPwd.nueva !== formPwd.confirmar) {
    mensajePassword.value = 'Las contraseñas nuevas no coinciden.'
    errorPassword.value = true
    return
  }

  guardandoPwd.value = true
  try {
    const res = await patch<any>('/usuarios/me/password', {
      passwordActual: formPwd.actual,
      passwordNueva: formPwd.nueva,
    })
    mensajePassword.value = res?.message || 'Contraseña actualizada correctamente.'
    errorPassword.value = false
    formPwd.actual = ''
    formPwd.nueva = ''
    formPwd.confirmar = ''
  } catch (e: any) {
    mensajePassword.value = e?.data?.message || 'Error al actualizar la contraseña.'
    errorPassword.value = true
  } finally {
    guardandoPwd.value = false
  }
}

onMounted(async () => {
  if (!localStorage.getItem('token')) { navigateTo('/login'); return }
  try {
    perfil.value = await get<any>('/usuarios/me') ?? {}
  } finally {
    cargando.value = false
  }
})
</script>
