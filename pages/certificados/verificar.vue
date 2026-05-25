<template>
  <NuxtLayout name="public">
    <div class="card max-w-lg mx-auto">
      <h2 class="text-xl font-bold text-gray-800 mb-1">Verificar certificado</h2>
      <p class="text-sm text-gray-500 mb-5">Ingresa el codigo del certificado para validar su autenticidad.</p>
      <div class="flex gap-3 mb-6">
        <input v-model="codigo" class="form-input flex-1 uppercase" placeholder="CERT-XXXXXXXX" @keyup.enter="verificar" />
        <button @click="verificar" class="btn-primary bg-teal-600 hover:bg-teal-700 focus:ring-teal-500">Verificar</button>
      </div>
      <div v-if="error" class="text-red-600 text-sm mb-4">{{ error }}</div>
      <div v-if="resultado" class="border border-teal-200 rounded-xl p-5 bg-teal-50">
        <div class="flex items-center gap-2 text-teal-700 font-bold text-lg mb-4">
          <span>✓</span> Certificado valido
        </div>
        <dl class="space-y-2 text-sm">
          <div class="flex gap-2"><dt class="text-gray-500 w-28 shrink-0">Persona:</dt><dd class="font-medium">{{ resultado.usuarioRef?.nombreCompleto }}</dd></div>
          <div class="flex gap-2"><dt class="text-gray-500 w-28 shrink-0">Tipo:</dt><dd>{{ resultado.tipo }}</dd></div>
          <div class="flex gap-2"><dt class="text-gray-500 w-28 shrink-0">Evento:</dt><dd>{{ resultado.eventoRef?.nombre }}</dd></div>
          <div class="flex gap-2"><dt class="text-gray-500 w-28 shrink-0">Proyecto:</dt><dd>{{ resultado.proyectoRef?.titulo || '---' }}</dd></div>
          <div class="flex gap-2"><dt class="text-gray-500 w-28 shrink-0">Codigo:</dt><dd class="font-mono text-xs">{{ resultado.codigo }}</dd></div>
        </dl>
        <a :href="apiBase + '/certificados/pdf/' + resultado.codigo" target="_blank"
          class="btn-primary bg-teal-600 hover:bg-teal-700 focus:ring-teal-500 text-sm mt-4 inline-block">
          Descargar PDF
        </a>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
const { get } = useApi()
const config = useRuntimeConfig()
const apiBase = config.public.apiBase
const codigo = ref('')
const resultado = ref<any>(null)
const error = ref('')
async function verificar() {
  error.value = ''
  resultado.value = null
  if (!codigo.value.trim()) return
  try { resultado.value = await get('/certificados/verificar/' + codigo.value.trim()) }
  catch { error.value = 'Certificado no encontrado o invalido.' }
}
</script>