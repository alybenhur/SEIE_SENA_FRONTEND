<template>
  <NuxtLayout name="admin">
    <div class="max-w-2xl">
      <NuxtLink to="/proyecto/mis-proyectos" class="text-gray-400 text-sm block mb-4">← Mis proyectos</NuxtLink>
      <div class="card">
        <h2 class="text-xl font-bold text-gray-800 mb-1">Presentar proyecto</h2>
        <form @submit.prevent="enviar" class="space-y-6">
          <div>
            <label class="form-label">Tipo de proyecto</label>
            <div class="flex gap-6 mt-1">
              <label class="flex items-center gap-2 text-sm cursor-pointer"><input type="radio" v-model="form.tipo" value="investigacion" class="accent-teal-600" /> Investigacion</label>
              <label class="flex items-center gap-2 text-sm cursor-pointer"><input type="radio" v-model="form.tipo" value="emprendimiento" class="accent-orange-500" /> Emprendimiento</label>
            </div>
          </div>
          <div>
            <label class="form-label">Titulo del proyecto</label>
            <input v-model="form.titulo" class="form-input" placeholder="Titulo completo" required />
            <p class="form-error">{{ errores.titulo }}</p>
          </div>
          <div>
            <label class="form-label">Eje tematico</label>
            <select v-model.number="form.ejeTematico" class="form-input">
              <option :value="0">Selecciona un eje</option>
              <option v-for="eje in ejes" :key="eje.id" :value="eje.id">Eje {{ eje.id }}: {{ eje.nombre }}</option>
            </select>
            <p class="form-error">{{ errores.ejeTematico }}</p>
          </div>
          <div>
            <label class="form-label">Resumen ejecutivo (max. 2000 caracteres)</label>
            <textarea v-model="form.resumen" class="form-input resize-none" rows="5" maxlength="2000" placeholder="Describe el problema, metodologia e impacto." required></textarea>
            <div class="text-right text-xs text-gray-400 mt-1">{{ form.resumen.length }}/2000</div>
          </div>
          <div>
            <label class="form-label">Descripcion completa (opcional)</label>
            <textarea v-model="form.descripcion" class="form-input resize-none" rows="5" maxlength="5000" placeholder="Antecedentes, metodologia, resultados detallados."></textarea>
          </div>
          <div><label class="form-label">Palabras clave</label><input v-model="form.palabrasClave" class="form-input" placeholder="p.ej.: IA, salud, innovacion" /></div>
          <div><label class="form-label">Institucion</label><input v-model="form.institucion" class="form-input" placeholder="Institucion responsable" /></div>
          <div>
            <label class="form-label">Modalidad</label>
            <div class="flex gap-6 mt-1">
              <label class="flex items-center gap-2 text-sm cursor-pointer"><input type="radio" v-model="form.modalidad" value="virtual" class="accent-teal-600" /> Virtual</label>
              <label class="flex items-center gap-2 text-sm cursor-pointer"><input type="radio" v-model="form.modalidad" value="presencial" class="accent-teal-600" /> Presencial</label>
            </div>
          </div>
          <div><label class="form-label">Enlace al archivo (Google Drive / OneDrive)</label><input v-model="form.urlArchivo" type="url" class="form-input" placeholder="https://..." /></div>
          <div>
            <label class="form-label">Evento</label>
            <select v-model="form.eventoRef" class="form-input">
              <option value="">Selecciona un evento</option>
              <option v-for="e in eventos" :key="e._id" :value="e._id">{{ e.nombre }}</option>
            </select>
            <p class="form-error">{{ errores.eventoRef }}</p>
          </div>
          <div>
            <label class="form-label">Semillero asociado</label>
            <input v-model="semilleroQuery" class="form-input" placeholder="Buscar semillero..." @input="buscarSemilleroHandler" />
            <ul v-if="semilleros.length" class="border border-gray-200 rounded-md mt-1 max-h-40 overflow-y-auto bg-white shadow-sm">
              <li v-for="s in semilleros" :key="s._id" @click="seleccionarSemillero(s)" class="px-3 py-2 text-sm hover:bg-teal-50 cursor-pointer">{{ s.nombre }}</li>
            </ul>
          </div>
          <div class="pt-2">
            <p v-if="mensaje" class="text-sm mb-3" :class="exito ? 'text-teal-700' : 'text-red-600'">{{ mensaje }}</p>
            <button type="submit" :disabled="enviando" class="btn-primary bg-teal-600 hover:bg-teal-700 focus:ring-teal-500 disabled:opacity-50">{{ enviando ? 'Enviando...' : 'Presentar proyecto' }}</button>
          </div>
        </form>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({ roles: ['investigador','emprendedor','lider_semillero','admin'] })
const { get, post } = useApi()
const { buscarSemilleros, semilleros } = useRegistroData()
const form = reactive({ titulo: '', tipo: 'investigacion', ejeTematico: 0, resumen: '', descripcion: '', palabrasClave: '', institucion: '', modalidad: 'virtual', urlArchivo: '', eventoRef: '', semilleroRef: '' })
const semilleroQuery = ref('')
const errores = reactive({ titulo: '', ejeTematico: '', resumen: '', eventoRef: '' })
const mensaje = ref(''); const exito = ref(false); const enviando = ref(false)
const eventos = ref([]); const ejes = ref([])
let debounce: ReturnType<typeof setTimeout>
async function buscarSemilleroHandler() { clearTimeout(debounce); debounce = setTimeout(() => buscarSemilleros(semilleroQuery.value), 300) }
function seleccionarSemillero(s: any) { form.semilleroRef = s._id; semilleroQuery.value = s.nombre; semilleros.value = [] }
async function enviar() {
  errores.titulo = form.titulo ? '' : 'El titulo es requerido'
  errores.ejeTematico = form.ejeTematico > 0 ? '' : 'Selecciona un eje'
  errores.resumen = form.resumen.length >= 50 ? '' : 'Minimo 50 caracteres'
  errores.eventoRef = form.eventoRef ? '' : 'Selecciona un evento'
  if (Object.values(errores).some(Boolean)) return
  enviando.value = true
  try {
    await post('/proyectos', form)
    exito.value = true; mensaje.value = 'Proyecto presentado. Quedara en revision hasta ser asignado a un evaluador.'
    setTimeout(() => navigateTo('/proyecto/mis-proyectos'), 2500)
  } catch (e: any) { exito.value = false; mensaje.value = e?.data?.message || 'Error al presentar.' }
  finally { enviando.value = false }
}
onMounted(async () => {
  if (!localStorage.getItem('token')) { navigateTo('/login'); return }
  ;[eventos.value, ejes.value] = await Promise.all([get('/eventos/activos'), get('/ejes-tematicos')]) as any
})
</script>
