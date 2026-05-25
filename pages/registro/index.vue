<template>
  <NuxtLayout name="public">
    <div class="max-w-lg mx-auto">
      <div class="rounded-2xl overflow-hidden shadow-lg border border-gray-200 bg-white">

        <!-- ── Cabecera oscura ── -->
        <div class="px-8 py-6 card-header">
          <NuxtLink to="/" class="inline-flex items-center gap-1.5 text-green-300 hover:text-white text-xs font-medium mb-3 transition-colors">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Volver al inicio
          </NuxtLink>
          <div class="flex items-center gap-3">
            <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 border border-white/20">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
              </svg>
            </div>
            <div>
              <p class="text-white font-bold text-base leading-tight">Registro público</p>
              <p class="text-green-300 text-xs mt-0.5">Sistema SEIE — SENA Investigación</p>
            </div>
          </div>
        </div>

        <!-- ── Cuerpo ── -->
        <div class="px-8 py-6">

          <!-- Sección: tipo de participación -->
          <div class="section-title">
            <svg class="w-4 h-4 text-green-600 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
            </svg>
            <span>Selecciona tu tipo de participación</span>
            <div class="flex-1 h-px bg-gray-200"></div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
            <NuxtLink v-for="tipo in tipos" :key="tipo.ruta" :to="tipo.ruta"
              class="tipo-card group">
              <div class="flex items-center justify-center w-10 h-10 rounded-xl border transition-colors duration-150 mb-3"
                :style="{ backgroundColor: tipo.color + '18', borderColor: tipo.color + '40' }">
                <svg class="w-5 h-5" :style="{ color: tipo.color }" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" :d="tipo.svgPath" />
                </svg>
              </div>
              <p class="font-bold text-gray-800 text-sm group-hover:text-gray-900">{{ tipo.titulo }}</p>
              <p class="text-xs text-gray-500 mt-0.5">{{ tipo.descripcion }}</p>
              <div class="mt-3 flex items-center gap-1 text-xs font-semibold transition-colors duration-150"
                :style="{ color: tipo.color }">
                Registrarse
                <svg class="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </div>
            </NuxtLink>
          </div>
        </div>

        <!-- ── Footer ── -->
        <div class="px-8 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <p class="text-xs text-gray-500">¿Ya tienes una cuenta?</p>
          <NuxtLink to="/login"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold btn-login text-white transition-all">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25" />
            </svg>
            Iniciar sesión
          </NuxtLink>
        </div>

      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
const tipos = [
  {
    titulo: 'Evaluador',
    descripcion: 'Formulario de registro para evaluadores',
    ruta: '/registro/evaluador',
    color: '#2563eb',
    svgPath: 'M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z',
  },
  {
    titulo: 'Investigador',
    descripcion: 'Formulario de registro para investigadores',
    ruta: '/registro/investigador',
    color: '#0d9488',
    svgPath: 'M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 1-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5',
  },
  {
    titulo: 'Emprendedor',
    descripcion: 'Formulario de registro para emprendedores',
    ruta: '/registro/emprendedor',
    color: '#ea580c',
    svgPath: 'M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941',
  },
  {
    titulo: 'Líder de semillero',
    descripcion: 'Formulario de registro para líderes',
    ruta: '/registro/lider',
    color: '#7c3aed',
    svgPath: 'M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z',
  },
]
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

.tipo-card {
  display: flex;
  flex-direction: column;
  padding: 1.125rem;
  border-radius: 0.875rem;
  border: 1px solid #e5e7eb;
  background: #fafafa;
  transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
  cursor: pointer;
}
.tipo-card:hover {
  border-color: #86efac;
  background: #f0fdf4;
  box-shadow: 0 2px 8px rgba(45, 138, 62, 0.10);
}

.btn-login {
  background: linear-gradient(90deg, #1e5c2a, #2d8a3e);
}
.btn-login:hover {
  background: linear-gradient(90deg, #164d22, #237033);
}
</style>
