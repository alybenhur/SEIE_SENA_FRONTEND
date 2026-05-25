<template>
  <NuxtLayout name="admin">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-bold text-gray-800">Usuarios registrados</h2>
      <div class="flex gap-3">
        <select v-model="filtroRol" class="text-sm border border-gray-300 rounded-md px-3 py-1.5">
          <option value="">Todos los roles</option>
          <option value="evaluador">Evaluador</option>
          <option value="investigador">Investigador</option>
          <option value="emprendedor">Emprendedor</option>
          <option value="lider_semillero">Líder de Semillero</option>
        </select>
        <select v-model="filtroEstado" class="text-sm border border-gray-300 rounded-md px-3 py-1.5">
          <option value="">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="aprobado">Aprobado</option>
          <option value="rechazado">Rechazado</option>
        </select>
      </div>
    </div>

    <div class="card overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-gray-200 text-left text-gray-500">
            <th class="pb-3 pr-4 font-medium">Nombre</th>
            <th class="pb-3 pr-4 font-medium">Correo</th>
            <th class="pb-3 pr-4 font-medium">Rol</th>
            <th class="pb-3 pr-4 font-medium">Estado</th>
            <th class="pb-3 font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in usuarios" :key="u._id" class="border-b border-gray-100 hover:bg-gray-50">
            <td class="py-3 pr-4">{{ u.nombreCompleto }}</td>
            <td class="py-3 pr-4 text-gray-500">{{ u.email }}</td>
            <td class="py-3 pr-4"><span :class="rolClass(u.rol)" class="px-2 py-0.5 rounded-full text-xs font-medium">{{ u.rol }}</span></td>
            <td class="py-3 pr-4"><span :class="estadoClass(u.estado)" class="px-2 py-0.5 rounded-full text-xs font-medium">{{ u.estado }}</span></td>
            <td class="py-3">
              <div class="flex gap-2">
                <button v-if="u.estado === 'pendiente'" @click="cambiarEstado(u._id, 'aprobado')" class="text-xs text-teal-600 underline">Aprobar</button>
                <button v-if="u.estado === 'pendiente'" @click="cambiarEstado(u._id, 'rechazado')" class="text-xs text-red-500 underline">Rechazar</button>
              </div>
            </td>
          </tr>
          <tr v-if="!usuarios.length">
            <td colspan="5" class="py-8 text-center text-gray-400">No hay usuarios para mostrar</td>
          </tr>
        </tbody>
      </table>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({ roles: ['admin'] })
const { get, patch } = useApi()
const filtroRol = ref('')
const filtroEstado = ref('')
const usuarios = ref<any[]>([])

async function cargar() {
  const params = new URLSearchParams()
  if (filtroRol.value) params.append('rol', filtroRol.value)
  if (filtroEstado.value) params.append('estado', filtroEstado.value)
  usuarios.value = await get<any[]>(`/usuarios?${params}`)
}

async function cambiarEstado(id: string, estado: string) {
  await patch(`/usuarios/${id}/estado`, { estado })
  await cargar()
}

const rolColors: Record<string, string> = {
  evaluador: 'bg-blue-100 text-blue-700',
  investigador: 'bg-teal-100 text-teal-700',
  emprendedor: 'bg-orange-100 text-orange-700',
  lider_semillero: 'bg-purple-100 text-purple-700',
}
const estadoColors: Record<string, string> = {
  pendiente: 'bg-yellow-100 text-yellow-700',
  aprobado: 'bg-green-100 text-green-700',
  rechazado: 'bg-red-100 text-red-700',
}
const rolClass = (rol: string) => rolColors[rol] || 'bg-gray-100 text-gray-700'
const estadoClass = (estado: string) => estadoColors[estado] || 'bg-gray-100 text-gray-700'

watch([filtroRol, filtroEstado], cargar)
onMounted(() => { if (!localStorage.getItem('token')) navigateTo('/login'); else cargar() })
</script>