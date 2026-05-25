<template>
  <div class="flex items-center justify-between py-1">
    <span class="text-sm text-gray-700">{{ label }}</span>
    <div class="flex gap-3">
      <label class="flex items-center gap-1 text-sm cursor-pointer">
        <input type="radio" :value="true" v-model="model" :name="uid" class="accent-blue-600" /> Sí
      </label>
      <label class="flex items-center gap-1 text-sm cursor-pointer">
        <input type="radio" :value="false" v-model="model" :name="uid" class="accent-blue-600" /> No
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
const model = defineModel<boolean>()
defineProps<{ label: string }>()
const uid = Math.random().toString(36).slice(2)
</script>