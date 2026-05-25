<template>
  <NuxtLayout name="public">
    <div class="max-w-sm mx-auto">
      <div class="rounded-2xl overflow-hidden shadow-lg border border-gray-200 bg-white">

        <!-- ── Cabecera oscura ── -->
        <div class="px-8 py-6 card-header">
          <NuxtLink to="/olvide-password" class="inline-flex items-center gap-1.5 text-green-300 hover:text-white text-xs font-medium mb-3 transition-colors">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Solicitar nuevo código
          </NuxtLink>
          <div class="flex items-center gap-3">
            <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 border border-white/20">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
              </svg>
            </div>
            <div>
              <p class="text-white font-bold text-base leading-tight">Restablecer contraseña</p>
              <p class="text-green-300 text-xs mt-0.5">Ingresa el código recibido en tu correo</p>
            </div>
          </div>
        </div>

        <!-- ── Cuerpo ── -->
        <div class="px-8 py-6">

          <form @submit.prevent="restablecer" class="space-y-5">

            <!-- Sección: Verificación -->
            <div>
              <div class="section-title">
                <svg class="w-4 h-4 text-green-600 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
                <span>Verificación</span>
                <div class="flex-1 h-px bg-gray-200"></div>
              </div>

              <div class="space-y-3">
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
                    <input v-model="email" type="email" required placeholder="correo@ejemplo.com"
                      class="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50/60 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 focus:bg-white transition-colors" />
                  </div>
                </div>

                <!-- Código -->
                <div>
                  <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    Código de verificación
                  </label>
                  <div class="relative">
                    <span class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M7.864 4.243A7.5 7.5 0 0 1 19.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 0 0 4.5 10.5a7.464 7.464 0 0 1-1.15 3.993m1.989 3.559A11.209 11.209 0 0 0 8.25 10.5a3.75 3.75 0 1 1 7.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 0 1-3.6 9.75m6.633-4.596a18.666 18.666 0 0 1-2.485 5.33" />
                      </svg>
                    </span>
                    <input v-model="codigo" type="text" required maxlength="6" pattern="\d{6}"
                      placeholder="123456"
                      class="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50/60 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 focus:bg-white transition-colors tracking-[0.3em] font-mono" />
                  </div>
                  <p class="mt-1 text-xs text-gray-400">Código de 6 dígitos enviado a tu correo. Válido por 15 minutos.</p>
                </div>
              </div>
            </div>

            <!-- Sección: Nueva contraseña -->
            <div>
              <div class="section-title">
                <svg class="w-4 h-4 text-green-600 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
                <span>Nueva contraseña</span>
                <div class="flex-1 h-px bg-gray-200"></div>
              </div>

              <div class="space-y-3">
                <!-- Nueva contraseña -->
                <div>
                  <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    Nueva contraseña
                  </label>
                  <div class="relative">
                    <span class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 0 1 21.75 8.25Z" />
                      </svg>
                    </span>
                    <input v-model="nuevaPassword" :type="verPass ? 'text' : 'password'" required minlength="6"
                      placeholder="Mínimo 6 caracteres"
                      class="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50/60 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 focus:bg-white transition-colors" />
                    <button type="button" @click="verPass = !verPass"
                      class="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors">
                      <svg v-if="!verPass" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </svg>
                      <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- Confirmar contraseña -->
                <div>
                  <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    Confirmar contraseña
                  </label>
                  <div class="relative">
                    <span class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 0 1 21.75 8.25Z" />
                      </svg>
                    </span>
                    <input v-model="confirmarPassword" :type="verPass ? 'text' : 'password'" required
                      placeholder="Repite la contraseña"
                      :class="['w-full pl-10 pr-4 py-2.5 text-sm border rounded-xl bg-gray-50/60 focus:outline-none focus:ring-2 focus:bg-white transition-colors',
                        confirmarPassword && nuevaPassword !== confirmarPassword
                          ? 'border-red-300 focus:ring-red-200 focus:border-red-400'
                          : 'border-gray-200 focus:ring-green-300 focus:border-green-400']" />
                  </div>
                  <p v-if="confirmarPassword && nuevaPassword !== confirmarPassword" class="mt-1 text-xs text-red-500">
                    Las contraseñas no coinciden.
                  </p>
                </div>
              </div>
            </div>

            <!-- Error -->
            <div v-if="error" class="flex items-center gap-2 px-3 py-2.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
              {{ error }}
            </div>

            <!-- Botón -->
            <button type="submit" :disabled="cargando || (!!confirmarPassword && nuevaPassword !== confirmarPassword)"
              class="w-full py-2.5 rounded-xl text-sm font-bold text-white btn-primary disabled:opacity-50 flex items-center justify-center gap-2">
              <svg v-if="!cargando" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              <svg v-else class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              {{ cargando ? 'Actualizando...' : 'Restablecer contraseña' }}
            </button>
          </form>
        </div>

        <!-- Footer -->
        <div class="px-8 py-3 bg-gray-50 border-t border-gray-100 text-center">
          <NuxtLink to="/login" class="text-xs text-green-700 font-semibold hover:underline">
            Volver al inicio de sesión →
          </NuxtLink>
        </div>

      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
const { post } = useApi()
const route = useRoute()

const email = ref((route.query.email as string) || '')
const codigo = ref('')
const nuevaPassword = ref('')
const confirmarPassword = ref('')
const verPass = ref(false)
const cargando = ref(false)
const error = ref('')

async function restablecer() {
  if (nuevaPassword.value !== confirmarPassword.value) {
    error.value = 'Las contraseñas no coinciden.'
    return
  }
  cargando.value = true
  error.value = ''
  try {
    await post('/auth/reset-password', {
      email: email.value,
      codigo: codigo.value,
      nuevaPassword: nuevaPassword.value,
    })
    await navigateTo('/login?reset=ok')
  } catch (e: any) {
    error.value = e?.data?.message || 'Error al restablecer la contraseña. Intenta nuevamente.'
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
