<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">

    <!-- Navbar -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

        <!-- Logo + nombre -->
        <div class="flex items-center gap-3 flex-shrink-0">
          <img src="/logoaplicacion.png" alt="SIGIEM" class="h-12 w-auto" />
          <div>
            <p class="font-bold text-teal-700 leading-tight text-base tracking-wide">SEIE</p>
            <p class="text-[10px] text-gray-600 leading-tight max-w-[180px] uppercase font-medium tracking-wide">Sistema de eventos de investigación y emprendimiento</p>
          </div>
        </div>


        <!-- Botones de acción -->
        <div class="flex items-center gap-2 flex-shrink-0">
          <NuxtLink to="/registro"
            class="hidden sm:flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-teal-700 border border-teal-600 rounded-lg hover:bg-teal-50 transition-colors">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Registro público
          </NuxtLink>
          <NuxtLink to="/login"
            class="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Iniciar sesión
          </NuxtLink>
        </div>
      </div>
    </header>

    <!-- Hero — evento activo -->
    <main id="inicio" class="flex-1">
      <section v-if="eventoActivo" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          <!-- Texto -->
          <div>
            <span class="inline-block text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 rounded-full px-3 py-1 mb-4">
              Evento activo
            </span>
            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-2">
              {{ eventoActivo.nombre }}
            </h1>
            <p v-if="eventoActivo.lugar" class="text-lg font-semibold text-teal-600 mb-5">{{ eventoActivo.lugar }}</p>

            <!-- Descripción HTML del WYSIWYG -->
            <div v-if="eventoActivo.descripcion"
              class="prose prose-sm text-gray-600 mb-6 max-w-none"
              v-html="eventoActivo.descripcion" />
            <p v-else class="text-gray-500 mb-6 text-sm">
              Participa en este evento de investigación, innovación y emprendimiento.
            </p>

            <!-- Fechas -->
            <div class="flex flex-wrap gap-4 mb-8">
              <div class="flex items-center gap-2 text-sm text-gray-600">
                <svg class="w-4 h-4 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span><strong>Inicio:</strong> {{ formatFecha(eventoActivo.fechaInicio) }}</span>
              </div>
              <div v-if="eventoActivo.fechaFin" class="flex items-center gap-2 text-sm text-gray-600">
                <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span><strong>Cierre:</strong> {{ formatFecha(eventoActivo.fechaFin) }}</span>
              </div>
            </div>

            <!-- CTA -->
            <div class="flex flex-wrap gap-3">
              <NuxtLink to="/registro"
                class="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-colors shadow-sm">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Registrarme ahora
              </NuxtLink>
              <NuxtLink to="/login"
                class="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors">
                Ya tengo cuenta
              </NuxtLink>
            </div>
          </div>

          <!-- Imagen / banner del evento -->
          <div class="flex justify-center lg:justify-end">
            <div class="w-full max-w-md">
              <div class="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <img v-if="eventoActivo.imagen" :src="eventoActivo.imagen"
                  :alt="eventoActivo.nombre"
                  class="w-full object-cover" />
                <!-- Placeholder si no hay imagen -->
                <div v-else class="w-full aspect-[4/3] bg-gradient-to-br from-teal-600 to-teal-900 flex flex-col items-center justify-center p-8 text-white text-center">
                  <svg class="w-16 h-16 opacity-30 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p class="text-lg font-bold opacity-80">{{ eventoActivo.nombre }}</p>
                  <p v-if="eventoActivo.lugar" class="text-sm opacity-60 mt-1">{{ eventoActivo.lugar }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Sin eventos activos -->
      <section v-else-if="cargado" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div class="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 class="text-xl font-bold text-gray-700 mb-2">No hay eventos activos</h2>
        <p class="text-gray-500 text-sm mb-6">Próximamente se habilitarán nuevos eventos. Vuelve pronto.</p>
        <NuxtLink to="/login" class="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-xl transition-colors">
          Iniciar sesión
        </NuxtLink>
      </section>

      <!-- Cargando -->
      <section v-else class="flex items-center justify-center py-32">
        <div class="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 py-6 text-center text-xs text-gray-400">
      © {{ new Date().getFullYear() }} SIGIEM — Sistema de Gestión de Eventos Investigativos y Emprendimiento
    </footer>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ auth: false } as any)

const config = useRuntimeConfig()
const eventoActivo = ref<any>(null)
const cargado = ref(false)

// Las fechas del backend llegan como "YYYY-MM-DD" (UTC medianoche).
// Sin corrección, en UTC-5 (Colombia) se mostraría el día anterior.
// Anclar al mediodía evita el desfase sin importar la zona horaria del usuario.
const parseFecha = (f: string): Date =>
  f.includes('T') ? new Date(f) : new Date(f + 'T12:00:00')

const formatFecha = (f: string) =>
  f ? parseFecha(f).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' }) : ''

const formatFechaLarga = (f: string) =>
  f ? parseFecha(f).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' }) : ''

onMounted(async () => {
  try {
    const eventos = await $fetch<any[]>(`${config.public.apiBase}/eventos/activos`)
    eventoActivo.value = eventos?.[0] ?? null
  } catch {
    eventoActivo.value = null
  } finally {
    cargado.value = true
  }
})
</script>

<style scoped>
.prose :deep(p) { margin-bottom: 0.75rem; }
.prose :deep(ul) { list-style: disc; padding-left: 1.25rem; margin-bottom: 0.75rem; }
.prose :deep(ol) { list-style: decimal; padding-left: 1.25rem; margin-bottom: 0.75rem; }
.prose :deep(strong) { font-weight: 600; }
.prose :deep(em) { font-style: italic; }
.prose :deep(h2) { font-size: 1.1rem; font-weight: 700; margin-bottom: 0.5rem; }
.prose :deep(h3) { font-size: 1rem; font-weight: 600; margin-bottom: 0.25rem; }
</style>
