<template>
  <div class="min-h-screen investigador-bg">
    <header class="relative z-10 px-6 py-3 flex items-center justify-between shadow-md"
      style="background: linear-gradient(90deg, #1a1a1a 0%, #00693e 50%, #004d2c 100%)">
      <div class="flex items-center gap-3">
        <img src="/logosena.png" alt="SEIE" class="h-8 w-auto brightness-0 invert" />
        <div>
          <p class="font-semibold text-sm leading-tight text-white">Portal Investigador</p>
          <p class="text-green-300 text-xs leading-tight">{{ store.user?.nombreCompleto || store.user?.email }}</p>
        </div>
      </div>
      <div class="flex items-center gap-5">
        <NuxtLink to="/investigador/dashboard" class="text-sm text-white/80 hover:text-white transition-colors font-medium">Inicio</NuxtLink>
        <button class="text-sm text-white/80 hover:text-white transition-colors font-medium" @click="logout">Cerrar sesión</button>
      </div>
    </header>
    <main class="relative z-10 max-w-5xl mx-auto px-4 py-8">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const store = useAuthStore()
function logout() {
  store.logout()
  navigateTo('/login')
}
</script>

<style scoped>
.investigador-bg {
  min-height: 100vh;
  background-color: #fdf8f0;
  background-image:
    radial-gradient(ellipse 90% 55% at 5% 0%,   rgba(254, 215, 170, 0.7) 0%, transparent 55%),
    radial-gradient(ellipse 70% 50% at 95% 5%,  rgba(253, 186, 116, 0.4) 0%, transparent 50%),
    radial-gradient(ellipse 60% 50% at 80% 95%, rgba(216, 180, 254, 0.35) 0%, transparent 50%),
    radial-gradient(ellipse 55% 45% at 10% 90%, rgba(167, 243, 208, 0.35) 0%, transparent 50%),
    radial-gradient(ellipse 40% 40% at 50% 50%, rgba(254, 240, 138, 0.2) 0%, transparent 60%);
}
</style>
