<template>
  <NuxtLayout name="public">
    <div class="max-w-sm mx-auto">
      <div class="rounded-2xl overflow-hidden shadow-lg border border-gray-200 bg-white">

        <!-- ── Cabecera oscura ── -->
        <div class="px-8 py-6 card-header">
          <NuxtLink to="/login" class="inline-flex items-center gap-1.5 text-green-300 hover:text-white text-xs font-medium mb-3 transition-colors">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Volver al inicio de sesión
          </NuxtLink>
          <div class="flex items-center gap-3">
            <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 border border-white/20">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
            </div>
            <div>
              <p class="text-white font-bold text-base leading-tight">Recuperar contraseña</p>
              <p class="text-green-300 text-xs mt-0.5">Te enviaremos un código a tu correo</p>
            </div>
          </div>
        </div>

        <!-- ── Cuerpo ── -->
        <div class="px-8 py-6">

          <!-- Sección -->
          <div class="section-title">
            <svg class="w-4 h-4 text-green-600 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
            </svg>
            <span>Correo registrado</span>
            <div class="flex-1 h-px bg-gray-200"></div>
          </div>

          <form @submit.prevent="enviar" class="space-y-4">
            <div class="relative">
              <span class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
              </span>
              <input v-model="email" type="email" required placeholder="correo@ejemplo.com"
                class="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50/60 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 focus:bg-white transition-colors" />
            </div>

            <!-- Error -->
            <div v-if="error" class="flex items-center gap-2 px-3 py-2.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
              {{ error }}
            </div>

            <!-- Éxito -->
            <div v-if="enviado" class="flex items-start gap-2 px-3 py-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
              <svg class="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              <div>
                Si el correo está registrado, recibirás el código en tu bandeja de entrada.
                <NuxtLink :to="`/restablecer-password?email=${encodeURIComponent(email)}`"
                  class="block mt-2 font-semibold underline text-green-800">
                  Ingresar código →
                </NuxtLink>
              </div>
            </div>

            <button v-if="!enviado" type="submit" :disabled="cargando"
              class="w-full py-2.5 rounded-xl text-sm font-bold text-white btn-primary disabled:opacity-50 flex items-center justify-center gap-2">
              <svg v-if="!cargando" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
              </svg>
              <svg v-else class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              {{ cargando ? 'Enviando...' : 'Enviar código' }}
            </button>
          </form>
        </div>

        <!-- Footer -->
        <div class="px-8 py-3 bg-gray-50 border-t border-gray-100 text-center">
          <NuxtLink to="/restablecer-password" class="text-xs text-green-700 font-semibold hover:underline">
            Ya tengo un código →
          </NuxtLink>
        </div>

      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
const { post } = useApi()
const email = ref('')
const cargando = ref(false)
const error = ref('')
const enviado = ref(false)

async function enviar() {
  cargando.value = true
  error.value = ''
  try {
    await post('/auth/forgot-password', { email: email.value })
    enviado.value = true
  } catch (e: any) {
    error.value = e?.data?.message || 'Error al enviar el correo. Intenta nuevamente.'
  } finally {
    cargando.value = false
  }
}
</script>

<style scoped>
.card-header { background: linear-gradient(100deg, #1a3a1a 0%, #1e5c2a 55%, #2d8a3e 100%); }
.section-title { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.875rem; }
.section-title span { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #4b5563; white-space: nowrap; }
.btn-primary { background: linear-gradient(90deg, #1a3a1a 0%, #1e5c2a 50%, #2d8a3e 100%); transition: all 0.15s; }
.btn-primary:hover:not(:disabled) { background: linear-gradient(90deg, #142b14 0%, #164d22 50%, #237033 100%); box-shadow: 0 4px 12px rgba(45,138,62,0.3); }
</style>
