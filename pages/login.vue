<template>
  <NuxtLayout name="public">
    <div class="max-w-sm mx-auto">

      <!-- Card con cabecera oscura -->
      <div class="rounded-2xl overflow-hidden shadow-lg border border-gray-200 bg-white">

        <!-- ── Cabecera oscura ── -->
        <div class="px-8 py-6 card-header">
          <div class="flex items-center gap-3">
            <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 border border-white/20">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </div>
            <div>
              <p class="text-white font-bold text-base leading-tight">Iniciar sesión</p>
              <p class="text-green-300 text-xs mt-0.5">Accede a tu cuenta SEIE</p>
            </div>
          </div>
        </div>

        <!-- ── Cuerpo ── -->
        <div class="px-8 py-6 space-y-5">

          <!-- Sección credenciales -->
          <div>
            <div class="section-title">
              <svg class="w-4 h-4 text-green-600 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
              <span>Credenciales de acceso</span>
              <div class="flex-1 h-px bg-gray-200"></div>
            </div>

            <form @submit.prevent="enviar" class="space-y-4">
              <!-- Email -->
              <div>
                <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Correo electrónico
                </label>
                <div class="relative">
                  <span class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                    </svg>
                  </span>
                  <input v-model="email" type="email" required
                    placeholder="correo@ejemplo.com"
                    class="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50/60 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 focus:bg-white transition-colors" />
                </div>
              </div>

              <!-- Contraseña -->
              <div>
                <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Contraseña
                </label>
                <div class="relative">
                  <span class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 0 1 21.75 8.25Z" />
                    </svg>
                  </span>
                  <input v-model="password" type="password" required
                    placeholder="••••••••"
                    class="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50/60 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 focus:bg-white transition-colors" />
                </div>
              </div>

              <!-- Éxito: contraseña restablecida -->
              <div v-if="resetOk" class="flex items-center gap-2 px-3 py-2.5 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
                <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                Contraseña actualizada. Ya puedes iniciar sesión.
              </div>

              <!-- Error -->
              <div v-if="error"
                class="flex items-center gap-2 px-3 py-2.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
                {{ error }}
              </div>

              <!-- ¿Olvidaste tu contraseña? -->
              <div class="text-right -mt-1">
                <NuxtLink to="/olvide-password" class="text-xs text-green-700 hover:text-green-900 font-semibold hover:underline transition-colors">
                  ¿Olvidaste tu contraseña?
                </NuxtLink>
              </div>

              <!-- Botón -->
              <button type="submit" :disabled="cargando"
                class="w-full py-2.5 rounded-xl text-sm font-bold text-white shadow-sm transition-all disabled:opacity-50 btn-login flex items-center justify-center gap-2">
                <svg v-if="!cargando" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25" />
                </svg>
                <svg v-else class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                {{ cargando ? 'Ingresando...' : 'Ingresar' }}
              </button>
            </form>
          </div>
        </div>

        <!-- ── Footer de la card ── -->
        <div class="px-8 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-center">
          <NuxtLink to="/certificados/verificar"
            class="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700 hover:text-green-900 uppercase tracking-wide transition-colors">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
            </svg>
            Verificar certificado
          </NuxtLink>
        </div>

      </div>

      <!-- Registro público -->
      <p class="text-center text-xs text-gray-500 mt-5">
        ¿Aún no tienes cuenta?
        <NuxtLink to="/registro" class="text-green-700 font-semibold hover:underline ml-1">Regístrate aquí</NuxtLink>
      </p>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
const store = useAuthStore()
const route = useRoute()
const { post } = useApi()
const email = ref('')
const password = ref('')
const error = ref('')
const cargando = ref(false)
const resetOk = ref(route.query.reset === 'ok')

const dashboards: Record<string, string> = {
  admin: '/admin/dashboard',
  coordinador: '/coordinador/registros',
  evaluador: '/evaluador/mis-asignaciones',
  investigador: '/investigador/dashboard',
  emprendedor: '/proyecto/mis-proyectos',
  lider_semillero: '/proyecto/mis-proyectos',
}

async function enviar() {
  cargando.value = true
  error.value = ''
  try {
    const res = await post<{ access_token: string }>('/auth/login', { email: email.value, password: password.value })
    store.setToken(res.access_token)
    navigateTo(dashboards[store.rol ?? ''] ?? '/login')
  } catch (e: any) {
    error.value = e?.data?.message || 'Credenciales incorrectas'
  } finally {
    cargando.value = false
  }
}
</script>

<style scoped>
.card-header {
  background: linear-gradient(100deg, #1a3a1a 0%, #1e5c2a 55%, #2d8a3e 100%);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.875rem;
}
.section-title span {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #4b5563;
  white-space: nowrap;
}

.btn-login {
  background: linear-gradient(90deg, #1a3a1a 0%, #1e5c2a 50%, #2d8a3e 100%);
}
.btn-login:hover:not(:disabled) {
  background: linear-gradient(90deg, #142b14 0%, #164d22 50%, #237033 100%);
  box-shadow: 0 4px 12px rgba(45, 138, 62, 0.35);
}
</style>
