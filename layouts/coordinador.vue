<template>
  <div class="min-h-screen coordinador-bg relative overflow-hidden">

    <!-- Burbujas animadas de fondo -->
    <div class="bubbles" aria-hidden="true">
      <span v-for="b in bubbles" :key="b.id" class="bubble"
        :style="{
          left: b.left + '%',
          width: b.size + 'px',
          height: b.size + 'px',
          animationDuration: b.duration + 's',
          animationDelay: b.delay + 's',
          opacity: b.opacity,
        }" />
    </div>

    <!-- Header estilo geométrico -->
    <header class="relative z-10 h-20 shadow-md overflow-hidden flex items-stretch">

      <!-- Fondo blanco base -->
      <div class="absolute inset-0 bg-white"></div>

      <!-- Bloque verde izquierdo con corte diagonal -->
      <div class="absolute inset-y-0 left-0 w-[30%] header-green"></div>

      <!-- Triángulo de corte diagonal -->
      <div class="absolute inset-y-0 header-triangle" style="left: calc(30% - 1px)"></div>

      <!-- Líneas verdes de acento -->
      <div class="absolute header-line-1"></div>
      <div class="absolute header-line-2"></div>

      <!-- Contenido -->
      <div class="relative z-10 w-full flex items-center justify-between px-6">

        <!-- Logo -->
        <div class="flex items-center gap-2.5">
          <img src="/logoaplicacion.png" alt="SEIE" class="h-8 w-auto" />
          <div>
            <p class="text-sm font-bold text-white leading-tight tracking-wide">SEIE</p>
            <p class="text-[9px] text-green-200 leading-tight uppercase font-medium tracking-widest">
              Panel Coordinador
            </p>
            <p class="text-[9px] text-green-200 leading-tight uppercase font-medium tracking-widest">
              {{ store.user?.email }}
            </p>
          </div>
        </div>

        <!-- Nav -->
        <nav class="flex items-center gap-2">

          <!-- Registros -->
          <NuxtLink to="/coordinador/registros"
            class="nav-pill"
            :class="$route.path.startsWith('/coordinador/registros') ? 'nav-pill-active' : 'nav-pill-idle'">
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
            </svg>
            <span>Registros</span>
          </NuxtLink>

          <!-- Proyectos -->
          <NuxtLink to="/coordinador/proyectos"
            class="nav-pill"
            :class="$route.path.startsWith('/coordinador/proyectos') ? 'nav-pill-active' : 'nav-pill-idle'">
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
            </svg>
            <span>Proyectos</span>
          </NuxtLink>

          <!-- Separador -->
          <div class="w-px h-5 bg-gray-300 mx-1"></div>

          <!-- Cerrar sesión -->
          <button @click="logout" class="nav-pill nav-pill-logout">
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
            </svg>
            <span>Cerrar sesión</span>
          </button>

        </nav>
      </div>
    </header>

    <!-- Contenido -->
    <main class="relative z-10 max-w-7xl mx-auto px-4 py-6">
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

const bubbles = Array.from({ length: 18 }, (_, i) => {
  const seed = (i + 1) * 137.508
  return {
    id:       i,
    left:     Math.round((seed * 1.3) % 100),
    size:     Math.round(20 + (seed * 2.7) % 80),
    duration: Math.round(10 + (seed * 0.9) % 16),
    delay:    Math.round((seed * 0.4) % 8),
    opacity:  parseFloat((0.06 + (seed * 0.003) % 0.10).toFixed(2)),
  }
})
</script>

<style scoped>
.coordinador-bg {
  background: linear-gradient(
    150deg,
    #f0faf4 0%,
    #e6f4ea 20%,
    #f5fff8 40%,
    #edf7f1 60%,
    #f2faf5 80%,
    #e8f5ec 100%
  );
  background-attachment: fixed;
}

/* ── Header geométrico ── */
.header-green {
  background: linear-gradient(90deg, #1a3a1a 0%, #1e5c2a 60%, #2d8a3e 100%);
}

.header-triangle {
  width: 0;
  height: 0;
  border-top: 80px solid #2d8a3e;
  border-right: 80px solid transparent;
}

.header-line-1 {
  top: 30%;
  left: 24%;
  right: 0;
  height: 5.5px;
  background: linear-gradient(90deg, #2d8a3e 0%, #4ade80 50%, transparent 100%);
  opacity: 0.85;
}

.header-line-2 {
  top: 58%;
  left: 28%;
  right: 5%;
  height: 4.5px;
  background: linear-gradient(90deg, #1e5c2a 0%, #86efac 60%, transparent 100%);
  opacity: 0.6;
}

/* ── Burbujas ── */
.bubbles {
  position: fixed;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}

.bubble {
  position: absolute;
  bottom: -160px;
  border-radius: 50%;
  background: radial-gradient(
    circle at 35% 35%,
    rgba(255, 255, 255, 0.80),
    rgba(45, 138, 62, 0.15) 60%,
    rgba(134, 239, 172, 0.10) 100%
  );
  border: 1px solid rgba(45, 138, 62, 0.20);
  backdrop-filter: blur(2px);
  animation: floatUp linear infinite;
  will-change: transform, opacity;
}

.bubble:nth-child(odd)  { animation-name: floatUp; }
.bubble:nth-child(even) { animation-name: floatUpB; }

@keyframes floatUp {
  0%   { transform: translateY(0)      scale(1);    opacity: inherit; }
  50%  { transform: translateY(-52vh)  scale(0.97) rotate(-6deg); }
  100% { transform: translateY(-105vh) scale(0.95) rotate(-3deg); opacity: 0; }
}

@keyframes floatUpB {
  0%   { transform: translateY(0)      scale(1);    opacity: inherit; }
  33%  { transform: translateY(-28vh)  scale(1.04) rotate(8deg); }
  100% { transform: translateY(-105vh) scale(0.95) rotate(4deg); opacity: 0; }
}

/* ── Nav pills ── */
.nav-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.875rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: background-color 0.15s, color 0.15s;
  white-space: nowrap;
}

.nav-pill-active {
  background-color: rgba(45, 138, 62, 0.18);
  color: #1a3a1a;
  box-shadow: inset 0 0 0 1px rgba(45, 138, 62, 0.35);
}

.nav-pill-idle {
  color: #374151;
  background-color: transparent;
}
.nav-pill-idle:hover {
  background-color: rgba(45, 138, 62, 0.10);
  color: #1e5c2a;
}

.nav-pill-logout {
  color: #374151;
  background-color: transparent;
}
.nav-pill-logout:hover {
  background-color: rgba(220, 38, 38, 0.08);
  color: #b91c1c;
}
</style>
