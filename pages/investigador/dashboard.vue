<template>
  <NuxtLayout name="investigador">

    <!-- Saludo -->
    <div class="mb-10">
      <h2 class="text-3xl font-bold text-gray-800">
        Hola, <span class="text-teal-600">{{ store.user?.nombreCompleto || 'Investigador' }}</span> 👋
      </h2>
      <p class="text-gray-500 mt-1">¿Qué deseas hacer hoy?</p>
    </div>

    <!-- Tarjetas -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">

      <!-- Proyectos -->
      <NuxtLink to="/investigador/proyectos"
        class="group relative overflow-hidden rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        style="background: linear-gradient(135deg, #0f766e 0%, #0d9488 50%, #14b8a6 100%)">
        <div class="absolute -right-6 -top-6 w-32 h-32 rounded-full opacity-20 bg-white" />
        <div class="absolute -right-2 bottom-4 w-20 h-20 rounded-full opacity-10 bg-white" />
        <div class="relative z-10">
          <div class="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-4 group-hover:bg-white/30 transition-colors">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
          </div>
          <h3 class="text-white font-bold text-lg mb-1">Proyectos</h3>
          <p class="text-teal-100 text-sm leading-snug">Consulta y gestión de proyectos según rol.</p>
          <div class="mt-4 flex items-center gap-1 text-white/80 text-xs font-medium group-hover:text-white transition-colors">
            Ir a proyectos
            <svg class="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </div>
        </div>
      </NuxtLink>

      <!-- Eventos (deshabilitado) -->
      <div
        class="group relative overflow-hidden rounded-2xl p-6 shadow-md opacity-60 cursor-not-allowed"
        style="background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #3b82f6 100%)">
        <div class="absolute -right-6 -top-6 w-32 h-32 rounded-full opacity-20 bg-white" />
        <div class="absolute -right-2 bottom-4 w-20 h-20 rounded-full opacity-10 bg-white" />
        <div class="relative z-10">
          <div class="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-4 group-hover:bg-white/30 transition-colors">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
            </svg>
          </div>
          <h3 class="text-white font-bold text-lg mb-1">Eventos</h3>
          <p class="text-blue-100 text-sm leading-snug">Programación, cupos y consulta de eventos.</p>
          <div class="mt-4 inline-flex items-center gap-1 text-white/70 text-xs font-medium">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
            No disponible
          </div>
        </div>
      </div>

      <!-- Histórico (deshabilitado) -->
      <div
        class="group relative overflow-hidden rounded-2xl p-6 shadow-md opacity-60 cursor-not-allowed"
        style="background: linear-gradient(135deg, #7c3aed 0%, #8b5cf6 50%, #a78bfa 100%)">
        <div class="absolute -right-6 -top-6 w-32 h-32 rounded-full opacity-20 bg-white" />
        <div class="absolute -right-2 bottom-4 w-20 h-20 rounded-full opacity-10 bg-white" />
        <div class="relative z-10">
          <div class="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-4 group-hover:bg-white/30 transition-colors">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <h3 class="text-white font-bold text-lg mb-1">Histórico</h3>
          <p class="text-purple-100 text-sm leading-snug">Consulta de historial y trazabilidad.</p>
          <div class="mt-4 inline-flex items-center gap-1 text-white/70 text-xs font-medium">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
            No disponible
          </div>
        </div>
      </div>

      <!-- Certificados (deshabilitado) -->
      <div
        class="group relative overflow-hidden rounded-2xl p-6 shadow-md opacity-60 cursor-not-allowed"
        style="background: linear-gradient(135deg, #b45309 0%, #d97706 50%, #f59e0b 100%)">
        <div class="absolute -right-6 -top-6 w-32 h-32 rounded-full opacity-20 bg-white" />
        <div class="absolute -right-2 bottom-4 w-20 h-20 rounded-full opacity-10 bg-white" />
        <div class="relative z-10">
          <div class="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-4 group-hover:bg-white/30 transition-colors">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
            </svg>
          </div>
          <h3 class="text-white font-bold text-lg mb-1">Certificados</h3>
          <p class="text-amber-100 text-sm leading-snug">Descarga de certificados cuando estén habilitados.</p>
          <div class="mt-4 inline-flex items-center gap-1 text-white/70 text-xs font-medium">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
            No disponible
          </div>
        </div>
      </div>

    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({ roles: ['investigador'] })
const store = useAuthStore()
</script>
