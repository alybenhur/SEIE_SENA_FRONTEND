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
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 1-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
            </svg>
          </div>
          <div>
            <p class="text-white font-bold text-base leading-tight">Registro de Investigador</p>
            <p class="text-green-300 text-xs mt-0.5">Diligencia todos los campos del formulario</p>
          </div>
        </div>
      </div>

      <!-- ── Cuerpo ── -->
      <div class="px-8 py-6">
        <form @submit.prevent="enviar" class="space-y-8" novalidate>

          <!-- Información General -->
          <section>
            <div class="section-title">
              <svg class="w-4 h-4 text-green-600 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
              <span>Información General</span>
              <div class="flex-1 h-px bg-gray-200"></div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div><input v-model="form.nombreCompleto" class="form-input" placeholder="Nombre completo" required /><p class="form-error">{{ errores.nombreCompleto }}</p></div>
              <div><input v-model="form.email" type="email" class="form-input" placeholder="Correo electrónico" required /><p class="form-error">{{ errores.email }}</p></div>
              <div><input v-model="form.numeroIdentificacion" class="form-input" placeholder="Número de identificación" required /></div>
              <div><input v-model="form.whatsappTelefono" class="form-input" placeholder="WhatsApp / Teléfono" /></div>
              <div>
                <label class="form-label">Institución / Organización</label>
                <SelectBusqueda v-model="form.institucion" :opciones="listaInstituciones" placeholder="Selecciona una institución..." />
              </div>
              <div>
                <label class="form-label">Semillero</label>
                <SelectBusqueda v-model="form.semilleroRef" :opciones="listaSemilleros" placeholder="Selecciona un semillero..." />
              </div>
              <div><input v-model="form.password" type="password" class="form-input" placeholder="Contraseña" required /><p class="form-error">{{ errores.password }}</p></div>
              <div><input v-model="confirmarPassword" type="password" class="form-input" placeholder="Confirmar contraseña" /></div>
            </div>
          </section>

          <!-- Perfil de Investigación -->
          <section>
            <div class="section-title">
              <svg class="w-4 h-4 text-green-600 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 1-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
              </svg>
              <span>Perfil de Investigación</span>
              <div class="flex-1 h-px bg-gray-200"></div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div class="md:col-span-2">
                <label class="form-label">Área(s) disciplinar(es)</label>
                <SelectMultiple v-model="form.perfilInvestigacion.areasDisciplinares" :grupos="areasDisciplinaresGrupos" placeholder="Selecciona una o más áreas..." />
              </div>
              <div><input v-model="form.perfilInvestigacion.grupoRedInvestigacion" class="form-input" placeholder="Grupo / Red de investigación" /></div>
              <div><input v-model.number="form.perfilInvestigacion.anosExperiencia" type="number" min="0" class="form-input" placeholder="Años de experiencia" /></div>
              <div>
                <label class="form-label">Línea principal de investigación</label>
                <SelectBusqueda v-model="form.perfilInvestigacion.lineaPrincipalInvestigacion" :opciones="listaLineas" placeholder="Selecciona una línea..." />
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

          <!-- Evento activo -->
          <section>
            <div class="section-title">
              <svg class="w-4 h-4 text-green-600 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 0 .375 5.913v0a3.001 3.001 0 0 0 .375-5.913V6.375c0-.621.504-1.125 1.125-1.125h9.75c.621 0 1.125.504 1.125 1.125v3.026a3.001 3.001 0 0 0 .375 5.913v0a2.999 2.999 0 0 0 .375-5.913V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" />
              </svg>
              <span>Evento activo</span>
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
              {{ enviando ? 'Registrando...' : 'Registrar Investigador' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
const { cargarEventosActivos, eventos } = useRegistroData()
const { post } = useApi()
const form = reactive({
  nombreCompleto: '', email: '', numeroIdentificacion: '', whatsappTelefono: '',
  institucion: '', semilleroRef: '', password: '', modalidadAsistencia: '', eventoRef: '',
  perfilInvestigacion: { areasDisciplinares: [] as string[], grupoRedInvestigacion: '', anosExperiencia: 0, lineaPrincipalInvestigacion: '' },
})
const confirmarPassword = ref('')
const errores = reactive<Record<string, string>>({})
const mensaje = ref('')
const exito = ref(false)
const enviando = ref(false)
const { listaInstituciones } = useInstituciones()
const { listaSemilleros } = useSemilleros()
const { listaLineas } = useLineasInvestigacion()

const areasDisciplinaresGrupos = [
  { label: 'Ciencias Agrarias y Tecnológicas', opciones: ['Ciencias Agrícolas', 'Biotecnología Agrícola', 'Ciencias Veterinarias', 'Ciencias Animales y Lechería'] },
  { label: 'Humanidades y Artes', opciones: ['Arte', 'Idiomas y Literatura', 'Historia y Arqueología'] },
  { label: 'Ciencias Sociales', opciones: ['Periodismo y Comunicaciones', 'Geografía Social y Económica', 'Ciencias Políticas', 'Derecho', 'Sociología', 'Ciencias de la Educación', 'Economía y Negocios', 'Psicología'] },
  { label: 'Ciencias Médicas y de la Salud', opciones: ['Medicina Clínica', 'Ciencias de la Salud', 'Biotecnología en Salud', 'Otras Ciencias Médicas'] },
  { label: 'Ingeniería y Tecnología', opciones: ['Ingeniería Civil', 'Ingeniería Eléctrica, Electrónica e Informática', 'Ingeniería Mecánica', 'Ingeniería Química', 'Ingeniería de los Materiales', 'Ingeniería Médica', 'Ingeniería Ambiental', 'Ingeniería Industrial', 'Nanotecnología', 'Biotecnología Industrial', 'Biotecnología Medioambiental', 'Tecnologías y Ciencias de la Información y la Comunicación (TIC)'] },
  { label: 'Ciencias Naturales', opciones: ['Matemáticas', 'Ciencias Físicas', 'Ciencias Biológicas', 'Ciencias de la Tierra y Medioambientales', 'Otras Ciencias Naturales'] },
  { label: 'Emprendimiento e Innovación', opciones: ['Emprendimiento e Innovación'] },
]

async function enviar() {
  errores.nombreCompleto = form.nombreCompleto ? '' : 'Campo requerido'
  errores.email = form.email ? '' : 'Campo requerido'
  errores.password = form.password !== confirmarPassword.value ? 'Las contraseñas no coinciden' : (form.password ? '' : 'Campo requerido')
  if (Object.values(errores).some(Boolean)) return
  enviando.value = true
  try {
    await post('/auth/register/investigador', form)
    exito.value = true; mensaje.value = '¡Registro exitoso! Tu solicitud está en revisión.'
  } catch (e: any) {
    exito.value = false; mensaje.value = e?.data?.message || 'Error al registrar. Intenta nuevamente.'
  } finally { enviando.value = false }
}
onMounted(() => cargarEventosActivos())
</script>

<style scoped>
.card-header { background: linear-gradient(100deg, #1a3a1a 0%, #1e5c2a 55%, #2d8a3e 100%); }
.section-title { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; }
.section-title span { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #4b5563; white-space: nowrap; }
.btn-submit { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.625rem 1.5rem; border-radius: 0.75rem; font-size: 0.875rem; font-weight: 700; color: #fff; background: linear-gradient(90deg, #1a3a1a 0%, #1e5c2a 50%, #2d8a3e 100%); transition: all 0.15s; }
.btn-submit:hover:not(:disabled) { background: linear-gradient(90deg, #142b14 0%, #164d22 50%, #237033 100%); box-shadow: 0 4px 12px rgba(45,138,62,0.3); }
</style>
