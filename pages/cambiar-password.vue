<template>
  <NuxtLayout name="public">
    <div class="max-w-sm mx-auto">
      <div class="rounded-2xl overflow-hidden shadow-lg border border-gray-200 bg-white">

        <!-- Cabecera -->
        <div class="px-8 py-6 card-header">
          <div class="flex items-center gap-3">
            <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 border border-white/20">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
            </div>
            <div>
              <p class="text-white font-bold text-base leading-tight">Configuración inicial de cuenta</p>
              <p class="text-green-300 text-xs mt-0.5">Requerido antes de continuar</p>
            </div>
          </div>
        </div>

        <!-- Cuerpo -->
        <div class="px-8 py-6 space-y-5">

          <!-- Aviso -->
          <div class="flex items-start gap-3 px-3 py-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700">
            <svg class="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
            <span>
              Para continuar debes actualizar tu <strong>correo real</strong> y establecer una <strong>nueva contraseña</strong>.
              Tu correo temporal fue <em>{cédula}@seie.sena.edu.co</em> y tu contraseña temporal fue tu número de identificación.
            </span>
          </div>

          <form @submit.prevent="cambiar" class="space-y-4">

            <!-- ── Correo real ───────────────────────────────────────── -->
            <div>
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Correo electrónico real <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <span class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                </span>
                <input
                  v-model="nuevoEmail"
                  type="email"
                  required
                  placeholder="tucorreo@ejemplo.com"
                  class="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50/60 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 focus:bg-white transition-colors"
                />
              </div>
              <p class="text-xs text-gray-400 mt-1">No puede ser el correo temporal asignado por el sistema.</p>
            </div>

            <!-- ── Nueva contraseña ──────────────────────────────────── -->
            <div>
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Nueva contraseña <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <input
                  v-model="nuevaPassword"
                  :type="verPass ? 'text' : 'password'"
                  required
                  minlength="6"
                  placeholder="Mínimo 6 caracteres"
                  class="w-full pl-4 pr-10 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50/60 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 focus:bg-white transition-colors"
                />
                <button type="button" @click="verPass = !verPass"
                  class="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600">
                  <svg v-if="!verPass" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- ── Confirmar contraseña ──────────────────────────────── -->
            <div>
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Confirmar contraseña <span class="text-red-500">*</span>
              </label>
              <input
                v-model="confirmar"
                :type="verPass ? 'text' : 'password'"
                required
                minlength="6"
                placeholder="Repite la contraseña"
                class="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50/60 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 focus:bg-white transition-colors"
              />
            </div>

            <!-- Error -->
            <div v-if="error"
              class="flex items-start gap-2 px-3 py-2.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              <svg class="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
              <span>{{ error }}</span>
            </div>

            <!-- Botón -->
            <button type="submit" :disabled="cargando"
              class="w-full py-2.5 rounded-xl text-sm font-bold text-white shadow-sm transition-all disabled:opacity-50 btn-cambiar flex items-center justify-center gap-2">
              <svg v-if="!cargando" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              <svg v-else class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              {{ cargando ? 'Guardando...' : 'Activar mi cuenta' }}
            </button>

          </form>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const store = useAuthStore()
const { post } = useApi()

const nuevoEmail    = ref('')
const nuevaPassword = ref('')
const confirmar     = ref('')
const error         = ref('')
const cargando      = ref(false)
const verPass       = ref(false)

const dashboards: Record<string, string> = {
  admin:           '/admin/dashboard',
  coordinador:     '/coordinador/registros',
  evaluador:       '/evaluador/mis-asignaciones',
  investigador:    '/investigador/dashboard',
  emprendedor:     '/proyecto/mis-proyectos',
  lider_semillero: '/proyecto/mis-proyectos',
}

async function cambiar() {
  error.value = ''

  if (!nuevoEmail.value.trim()) {
    error.value = 'El correo electrónico es obligatorio.'
    return
  }
  if (nuevaPassword.value.length < 6) {
    error.value = 'La contraseña debe tener al menos 6 caracteres.'
    return
  }
  if (nuevaPassword.value !== confirmar.value) {
    error.value = 'Las contraseñas no coinciden.'
    return
  }

  cargando.value = true
  try {
    const res = await post<{ access_token: string }>('/auth/change-password', {
      nuevoEmail: nuevoEmail.value.trim(),
      nuevaPassword: nuevaPassword.value,
    })
    store.setToken(res.access_token, false)
    navigateTo(dashboards[store.rol ?? ''] ?? '/login')
  } catch (e: any) {
    error.value = e?.data?.message || 'Error al actualizar la cuenta.'
  } finally {
    cargando.value = false
  }
}
</script>

<style scoped>
.card-header {
  background: linear-gradient(100deg, #1a3a1a 0%, #1e5c2a 55%, #2d8a3e 100%);
}
.btn-cambiar {
  background: linear-gradient(90deg, #1a3a1a 0%, #1e5c2a 50%, #2d8a3e 100%);
}
.btn-cambiar:hover:not(:disabled) {
  background: linear-gradient(90deg, #142b14 0%, #164d22 50%, #237033 100%);
  box-shadow: 0 4px 12px rgba(45, 138, 62, 0.35);
}
</style>
