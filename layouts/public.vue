<template>
  <div class="public-bg min-h-screen flex flex-col relative overflow-hidden">

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
        <NuxtLink to="/" class="flex items-center gap-2.5">
          <img src="/logoaplicacion.png" alt="SEIE" class="h-8 w-auto" />
          <div>
            <p class="text-sm font-bold text-white leading-tight tracking-wide">SEIE</p>
            <p class="text-[9px] text-green-200 leading-tight uppercase font-medium tracking-widest">
              Sistema de eventos
            </p>
            <p class="text-[9px] text-green-200 leading-tight uppercase font-medium tracking-widest">
              Investigación y emprendimiento
            </p>
          </div>
        </NuxtLink>

        <!-- Botón login -->
        <NuxtLink to="/login"
          class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide rounded-lg border transition-colors"
          style="color: #1e5c2a; border-color: #2d8a3e;"
          onmouseover="this.style.background='#2d8a3e18'"
          onmouseout="this.style.background='transparent'">
          Iniciar sesión
        </NuxtLink>
      </div>
    </header>

    <!-- Contenido -->
    <main class="relative z-10 flex-1 max-w-3xl w-full mx-auto px-4 py-10">
      <slot />
    </main>

    <footer class="relative z-10 text-center text-xs text-gray-400 py-5">
      © {{ new Date().getFullYear() }} SEIE — Sistema de Gestión de Eventos Investigativos y Emprendimiento
    </footer>
  </div>
</template>

<script setup lang="ts">
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
.public-bg {
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
</style>
