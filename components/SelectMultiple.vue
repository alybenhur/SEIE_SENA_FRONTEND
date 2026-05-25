<template>
  <div class="relative" ref="wrapper">
    <!-- Trigger -->
    <button type="button" @click="abierto = !abierto"
      class="w-full flex items-center justify-between border-0 border-b border-gray-300 bg-transparent text-sm py-2 focus:outline-none focus:border-teal-500 text-left">
      <span :class="seleccionados.length ? 'text-gray-800' : 'text-gray-400'">
        {{ seleccionados.length ? seleccionados.join(', ') : placeholder }}
      </span>
      <svg class="w-4 h-4 text-gray-400 flex-shrink-0 transition-transform" :class="{ 'rotate-180': abierto }"
        viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
      </svg>
    </button>

    <!-- Dropdown -->
    <div v-if="abierto"
      class="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-72 overflow-y-auto">
      <!-- Búsqueda -->
      <div class="sticky top-0 bg-white border-b border-gray-100 px-3 py-2">
        <input v-model="busqueda" type="text" placeholder="Buscar área..."
          class="w-full text-sm bg-gray-50 border border-gray-200 rounded px-2 py-1 focus:outline-none focus:border-teal-400"
          @click.stop />
      </div>

      <div class="py-1">
        <template v-for="grupo in gruposFiltrados" :key="grupo.label">
          <!-- Encabezado de grupo -->
          <p class="px-3 pt-2 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">
            {{ grupo.label }}
          </p>
          <!-- Opciones -->
          <label v-for="opcion in grupo.opciones" :key="opcion"
            class="flex items-center gap-2 px-3 py-1.5 text-sm cursor-pointer hover:bg-teal-50">
            <input type="checkbox" :value="opcion" v-model="seleccionados"
              class="accent-teal-600 rounded" @click.stop />
            <span>{{ opcion }}</span>
          </label>
        </template>
        <p v-if="gruposFiltrados.every(g => g.opciones.length === 0)"
          class="px-3 py-3 text-sm text-gray-400 text-center">Sin resultados</p>
      </div>

      <!-- Footer: resumen + cerrar -->
      <div class="sticky bottom-0 bg-white border-t border-gray-100 px-3 py-2 flex items-center justify-between">
        <span class="text-xs text-gray-500">{{ seleccionados.length }} seleccionada(s)</span>
        <button type="button" @click="abierto = false"
          class="text-xs text-teal-600 font-medium hover:underline">Listo</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string[]
  grupos: { label: string; opciones: string[] }[]
  placeholder?: string
}>()
const emit = defineEmits<{ 'update:modelValue': [val: string[]] }>()

const abierto = ref(false)
const busqueda = ref('')
const wrapper = ref<HTMLElement | null>(null)

const seleccionados = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const gruposFiltrados = computed(() => {
  if (!busqueda.value.trim()) return props.grupos
  const q = busqueda.value.toLowerCase()
  return props.grupos.map(g => ({
    label: g.label,
    opciones: g.opciones.filter(o => o.toLowerCase().includes(q)),
  })).filter(g => g.opciones.length > 0)
})

// Cerrar al hacer clic fuera
function onClickOutside(e: MouseEvent) {
  if (wrapper.value && !wrapper.value.contains(e.target as Node)) {
    abierto.value = false
  }
}
onMounted(() => document.addEventListener('mousedown', onClickOutside))
onUnmounted(() => document.removeEventListener('mousedown', onClickOutside))
</script>
