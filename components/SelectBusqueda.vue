<template>
  <div class="relative" ref="wrapper">
    <!-- Trigger -->
    <button type="button" @click="abierto = !abierto"
      class="w-full flex items-center justify-between border-0 border-b border-gray-300 bg-transparent text-sm py-2 focus:outline-none focus:border-teal-500 text-left">
      <span :class="modelValue ? 'text-gray-800' : 'text-gray-400'">
        {{ modelValue || placeholder }}
      </span>
      <div class="flex items-center gap-1">
        <button v-if="modelValue" type="button" @click.stop="limpiar"
          class="text-gray-300 hover:text-gray-500 leading-none">✕</button>
        <svg class="w-4 h-4 text-gray-400 flex-shrink-0 transition-transform" :class="{ 'rotate-180': abierto }"
          viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
        </svg>
      </div>
    </button>

    <!-- Dropdown -->
    <div v-if="abierto"
      class="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
      <!-- Búsqueda -->
      <div class="px-3 py-2 border-b border-gray-100">
        <input ref="inputBusqueda" v-model="busqueda" type="text" placeholder="Buscar institución..."
          class="w-full text-sm bg-gray-50 border border-gray-200 rounded px-2 py-1.5 focus:outline-none focus:border-teal-400"
          @click.stop />
      </div>

      <!-- Lista -->
      <ul class="max-h-64 overflow-y-auto py-1">
        <li v-for="opcion in opcionesFiltradas" :key="opcion"
          @click="seleccionar(opcion)"
          class="px-3 py-2 text-sm cursor-pointer hover:bg-teal-50 flex items-center justify-between"
          :class="{ 'bg-teal-50 text-teal-700 font-medium': opcion === modelValue }">
          {{ opcion }}
          <svg v-if="opcion === modelValue" class="w-4 h-4 text-teal-600 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
          </svg>
        </li>
        <li v-if="!opcionesFiltradas.length" class="px-3 py-3 text-sm text-gray-400 text-center">
          Sin resultados
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string
  opciones: string[]
  placeholder?: string
}>()
const emit = defineEmits<{ 'update:modelValue': [val: string] }>()

const abierto = ref(false)
const busqueda = ref('')
const wrapper = ref<HTMLElement | null>(null)
const inputBusqueda = ref<HTMLInputElement | null>(null)

const opcionesFiltradas = computed(() => {
  const q = busqueda.value.toLowerCase().trim()
  return q ? props.opciones.filter(o => o.toLowerCase().includes(q)) : props.opciones
})

function seleccionar(opcion: string) {
  emit('update:modelValue', opcion)
  abierto.value = false
  busqueda.value = ''
}

function limpiar() {
  emit('update:modelValue', '')
}

watch(abierto, (val) => {
  if (val) nextTick(() => inputBusqueda.value?.focus())
  else busqueda.value = ''
})

function onClickOutside(e: MouseEvent) {
  if (wrapper.value && !wrapper.value.contains(e.target as Node)) {
    abierto.value = false
  }
}
onMounted(() => document.addEventListener('mousedown', onClickOutside))
onUnmounted(() => document.removeEventListener('mousedown', onClickOutside))
</script>
