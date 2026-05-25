<template>
  <NuxtLayout name="admin">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-bold text-gray-800">Mis proyectos</h2>
      <NuxtLink to="/proyecto/nuevo" class="btn-primary bg-teal-600 hover:bg-teal-700 text-sm">+ Presentar proyecto</NuxtLink>
    </div>
    <div v-if="!proyectos.length" class="card text-center py-12 text-gray-400">
      <p class="text-lg mb-2">No tienes proyectos presentados</p>
      <NuxtLink to="/proyecto/nuevo" class="text-teal-600 underline text-sm">Presenta tu primer proyecto</NuxtLink>
    </div>
    <div class="space-y-4">
      <div v-for="p in proyectos" :key="p._id" class="card hover:shadow-md transition-shadow">
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <span :class="tipoClass(p.tipo)" class="text-xs px-2 py-0.5 rounded-full font-medium">{{ p.tipo }}</span>
              <span :class="estadoClass(p.estado)" class="text-xs px-2 py-0.5 rounded-full font-medium">{{ p.estado }}</span>
            </div>
            <h3 class="font-semibold text-gray-800">{{ p.titulo }}</h3>
            <p class="text-sm text-gray-500 mt-1 line-clamp-2">{{ p.resumen }}</p>
            <div class="text-xs text-gray-400 mt-2">{{ formatFecha(p.createdAt) }}</div>
          </div>
          <div class="text-right shrink-0">
            <div v-if="p.puntajeFinal" class="text-2xl font-bold" :class="p.puntajeFinal >= 70 ? 'text-teal-600' : 'text-orange-500'">
              {{ p.puntajeFinal }}<span class="text-sm font-normal text-gray-400">/100</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({ roles: ['investigador','emprendedor','lider_semillero','admin'] })
const { get } = useApi()
const proyectos = ref([])
const tipoClass = (t) => t === 'investigacion' ? 'bg-teal-100 text-teal-700' : 'bg-orange-100 text-orange-700'
const estadoClasses = { enviado: 'bg-yellow-100 text-yellow-700', en_evaluacion: 'bg-blue-100 text-blue-700', evaluado: 'bg-purple-100 text-purple-700', aprobado: 'bg-green-100 text-green-700', rechazado: 'bg-red-100 text-red-700' }
const estadoClass = (e) => estadoClasses[e] || 'bg-gray-100 text-gray-500'
const formatFecha = (f) => f ? new Date(f).toLocaleDateString('es-CO') : ''
onMounted(async () => {
  if (!localStorage.getItem('token')) { navigateTo('/login'); return }
  proyectos.value = await get('/proyectos/mis-proyectos')
})
</script>