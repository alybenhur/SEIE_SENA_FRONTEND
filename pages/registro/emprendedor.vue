<template>
  <NuxtLayout name="public">
    <div class="rounded-2xl overflow-hidden shadow-lg border border-gray-200 bg-white">

      <!-- ── Cabecera oscura ── -->
      <div class="px-8 py-5 card-header">
        <NuxtLink to="/registro" class="inline-flex items-center gap-1.5 text-green-300 hover:text-white text-xs font-medium mb-3 transition-colors">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Volver al selector
        </NuxtLink>
        <div class="flex items-center gap-3">
          <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 border border-white/20">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
            </svg>
          </div>
          <div>
            <p class="text-white font-bold text-base leading-tight">Registro de Emprendedor</p>
            <p class="text-green-300 text-xs mt-0.5">Diligencia todos los campos del formulario</p>
          </div>
        </div>
      </div>

      <!-- ── Cuerpo ── -->
      <div class="px-8 py-6">
        <form @submit.prevent="enviar" class="space-y-8" novalidate>

          <!-- 1. Información General -->
          <section>
            <div class="section-title">
              <svg class="w-4 h-4 text-green-600 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
              <span>1. Información General</span>
              <div class="flex-1 h-px bg-gray-200"></div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div><input v-model="form.nombreCompleto" class="form-input" placeholder="Nombre completo" required /><p class="form-error">{{ errores.nombreCompleto }}</p></div>
              <div><input v-model="form.email" type="email" class="form-input" placeholder="Correo electrónico" required /></div>
              <div><input v-model="form.numeroIdentificacion" class="form-input" placeholder="Número de identificación" required /></div>
              <div><input v-model="form.whatsappTelefono" class="form-input" placeholder="WhatsApp / Teléfono" /></div>
              <div><input v-model="form.password" type="password" class="form-input" placeholder="Contraseña" required /></div>
              <div><input v-model="confirmarPassword" type="password" class="form-input" placeholder="Confirmar contraseña" /></div>
            </div>
          </section>

          <!-- 2. Información del Emprendimiento -->
          <section>
            <div class="section-title">
              <svg class="w-4 h-4 text-green-600 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
              </svg>
              <span>2. Información del Emprendimiento</span>
              <div class="flex-1 h-px bg-gray-200"></div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <label class="form-label">Organización / Institución</label>
                <SelectBusqueda v-model="form.infoEmprendimiento.organizacion" :opciones="listaInstituciones" placeholder="Selecciona una institución..." />
              </div>
              <div><input v-model="form.infoEmprendimiento.nombreEmprendimiento" class="form-input" placeholder="Nombre del emprendimiento/proyecto" /></div>
              <div>
                <label class="form-label">Semillero</label>
                <SelectBusqueda v-model="form.semilleroRef" :opciones="listaSemilleros" placeholder="Selecciona un semillero..." />
              </div>
              <div>
                <label class="form-label">Etapa</label>
                <select v-model="form.infoEmprendimiento.etapa" class="form-input">
                  <option value="">Selecciona etapa</option>
                  <option v-for="e in etapas" :key="e" :value="e">{{ e }}</option>
                </select>
              </div>
              <div><input v-model="form.infoEmprendimiento.sector" class="form-input" placeholder="Sector o área" /></div>
              <div class="md:col-span-2">
                <textarea v-model="form.infoEmprendimiento.descripcion" class="form-input resize-none" rows="3" maxlength="500" placeholder="Descripción breve del emprendimiento"></textarea>
              </div>
            </div>
          </section>

          <!-- Modalidad -->
          <section>
            <div class="section-title">
              <svg class="w-4 h-4 text-green-600 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
              </svg>
              <span>Modalidad de asistencia</span>
              <div class="flex-1 h-px bg-gray-200"></div>
            </div>
            <div class="flex gap-4">
              <label class="flex items-center gap-2 text-sm cursor-pointer"><input type="radio" v-model="form.modalidadAsistencia" value="virtual" class="accent-green-600" /> Virtual</label>
              <label class="flex items-center gap-2 text-sm cursor-pointer"><input type="radio" v-model="form.modalidadAsistencia" value="presencial" class="accent-green-600" /> Presencial</label>
            </div>
          </section>

          <!-- 3. Ejes Temáticos -->
          <section>
            <div class="section-title">
              <svg class="w-4 h-4 text-green-600 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6Z" />
              </svg>
              <span>3. Líneas en las que Puede Evaluar <span class="normal-case font-normal text-gray-400">(máx. 2)</span></span>
              <div class="flex-1 h-px bg-gray-200"></div>
            </div>
            <div class="data-box space-y-3">
              <label v-for="eje in ejes" :key="eje.id" class="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" :value="eje.id" v-model="form.ejesTematicos"
                  :disabled="form.ejesTematicos.length >= 2 && !form.ejesTematicos.includes(eje.id)"
                  class="mt-1 accent-green-600" />
                <div>
                  <span class="text-sm font-medium">Eje {{ eje.id }}: {{ eje.nombre }}</span>
                  <p class="text-xs text-teal-700">{{ eje.descripcion }}</p>
                </div>
              </label>
            </div>
          </section>

          <!-- 4. Evento activo -->
          <section>
            <div class="section-title">
              <svg class="w-4 h-4 text-green-600 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 0 .375 5.913v0a3.001 3.001 0 0 0 .375-5.913V6.375c0-.621.504-1.125 1.125-1.125h9.75c.621 0 1.125.504 1.125 1.125v3.026a3.001 3.001 0 0 0 .375 5.913v0a2.999 2.999 0 0 0 .375-5.913V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" />
              </svg>
              <span>4. Evento activo</span>
              <div class="flex-1 h-px bg-gray-200"></div>
            </div>
            <select v-model="form.eventoRef" class="form-input">
              <option value="">Selecciona un evento activo</option>
              <option v-for="e in eventos" :key="e._id" :value="e._id">{{ e.nombre }}</option>
            </select>
            <p v-if="!eventos.length" class="form-error">No hay eventos activos para registro en este momento.</p>
          </section>

          <!-- Submit -->
          <div class="pt-2">
            <div v-if="mensaje" class="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium mb-4"
              :class="exito ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-600'">
              {{ mensaje }}
            </div>
            <button type="submit" :disabled="enviando" class="btn-submit disabled:opacity-50">
              <svg v-if="!enviando" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              <svg v-else class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              {{ enviando ? 'Registrando...' : 'Registrar Emprendedor' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
const { cargarEventosActivos, cargarEjes, eventos, ejes } = useRegistroData()
const { post } = useApi()
const { listaInstituciones } = useInstituciones()
const { listaSemilleros } = useSemilleros()

const form = reactive({
  nombreCompleto: '', email: '', numeroIdentificacion: '', whatsappTelefono: '',
  password: '', modalidadAsistencia: '', semilleroRef: '', eventoRef: '',
  ejesTematicos: [] as number[],
  infoEmprendimiento: { nombreEmprendimiento: '', organizacion: '', etapa: '', sector: '', descripcion: '' },
})
const confirmarPassword = ref('')
const errores = reactive<Record<string, string>>({})
const mensaje = ref('')
const exito = ref(false)
const enviando = ref(false)
const etapas = ['Idea de negocio', 'Plan de negocio', 'Emprendimiento']

async function enviar() {
  errores.nombreCompleto = form.nombreCompleto ? '' : 'Campo requerido'
  if (form.password !== confirmarPassword.value) { errores.password = 'Las contraseñas no coinciden'; return }
  enviando.value = true
  try {
    await post('/auth/register/emprendedor', form)
    exito.value = true; mensaje.value = '¡Registro exitoso! Tu solicitud está en revisión.'
  } catch (e: any) {
    exito.value = false; mensaje.value = e?.data?.message || 'Error al registrar.'
  } finally { enviando.value = false }
}
onMounted(() => { cargarEventosActivos(); cargarEjes() })
</script>

<style scoped>
.card-header { background: linear-gradient(100deg, #1a3a1a 0%, #1e5c2a 55%, #2d8a3e 100%); }
.section-title { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; }
.section-title span { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #4b5563; white-space: nowrap; }
.data-box { border: 1px solid #f0f0f0; border-radius: 0.75rem; background: rgba(249,250,251,0.6); padding: 0.75rem 1rem; }
.btn-submit { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.625rem 1.5rem; border-radius: 0.75rem; font-size: 0.875rem; font-weight: 700; color: #fff; background: linear-gradient(90deg, #1a3a1a 0%, #1e5c2a 50%, #2d8a3e 100%); transition: all 0.15s; }
.btn-submit:hover:not(:disabled) { background: linear-gradient(90deg, #142b14 0%, #164d22 50%, #237033 100%); box-shadow: 0 4px 12px rgba(45,138,62,0.3); }
</style>
