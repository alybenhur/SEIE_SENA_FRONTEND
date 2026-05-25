<template>
  <NuxtLayout name="admin">
    <h2 class="text-xl font-bold text-gray-800 mb-6">Dashboard</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div v-for="stat in stats" :key="stat.label" class="card flex items-center gap-4">
        <span class="text-3xl">{{ stat.icono }}</span>
        <div>
          <div class="text-2xl font-bold text-gray-800">{{ stat.valor }}</div>
          <div class="text-sm text-gray-500">{{ stat.label }}</div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({ roles: ['admin'] })
const { get } = useApi()

const stats = ref([
  { label: 'Evaluadores', icono: '📋', valor: 0 },
  { label: 'Investigadores', icono: '🔬', valor: 0 },
  { label: 'Emprendedores', icono: '🚀', valor: 0 },
  { label: 'Líderes de Semillero', icono: '👥', valor: 0 },
])

onMounted(async () => {
  try {
    const roles = ['evaluador', 'investigador', 'emprendedor', 'lider_semillero']
    const resultados = await Promise.all(roles.map(r => get<any[]>(`/usuarios?rol=${r}`)))
    resultados.forEach((r, i) => { stats.value[i].valor = r.length })
  } catch { /* el middleware ya redirige si no hay sesión */ }
})
</script>