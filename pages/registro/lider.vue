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
              <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
            </svg>
          </div>
          <div>
            <p class="text-white font-bold text-base leading-tight">Registro de Líder de Semillero</p>
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
              <div><input v-model="form.nacionalidad" class="form-input" placeholder="Nacionalidad" /></div>
              <div><input v-model="form.numeroIdentificacion" class="form-input" placeholder="Número de identificación" required /></div>
              <div>
                <label class="form-label">Institución / Organización</label>
                <SelectBusqueda v-model="form.institucion" :opciones="listaInstituciones" placeholder="Selecciona una institución..." />
              </div>
              <div><input v-model="form.email" type="email" class="form-input" placeholder="Correo electrónico" required /></div>
              <div><input v-model="form.whatsappTelefono" class="form-input" placeholder="WhatsApp / Teléfono" /></div>
              <div><input v-model="form.cargoActual" class="form-input" placeholder="Cargo actual" /></div>
              <div><input v-model="form.nombreSemillero" class="form-input" placeholder="Nombre del semillero" /></div>
              <div><input v-model="form.password" type="password" class="form-input" placeholder="Contraseña" required /></div>
              <div><input v-model="confirmarPassword" type="password" class="form-input" placeholder="Confirmar contraseña" /></div>
            </div>
          </section>

          <!-- 2. Perfil Académico -->
          <section>
            <div class="section-title">
              <svg class="w-4 h-4 text-green-600 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 10.741-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
              </svg>
              <span>2. Perfil Académico</span>
              <div class="flex-1 h-px bg-gray-200"></div>
            </div>
            <div class="mb-4">
              <label class="form-label">Nivel de formación</label>
              <div class="flex flex-wrap gap-4">
                <label v-for="n in nivelesFormacion" :key="n.value" class="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="radio" v-model="form.perfilAcademico.nivelFormacion" :value="n.value" class="accent-green-600" /> {{ n.label }}
                </label>
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div class="md:col-span-2">
                <label class="form-label">Área(s) disciplinar(es)</label>
                <SelectMultiple v-model="form.perfilAcademico.areasDisciplinares" :grupos="areasDisciplinaresGrupos" placeholder="Selecciona una o más áreas..." />
              </div>
              <div><input v-model="form.perfilAcademico.grupoRedInvestigacion" class="form-input" placeholder="Grupo / Red de investigación" /></div>
              <div><input v-model="form.perfilAcademico.enlaceCvlac" class="form-input" placeholder="Enlace CVLAC" /></div>
              <div><input v-model="form.perfilAcademico.enlaceOrcid" class="form-input" placeholder="Enlace de ORCID" /></div>
              <div><input v-model="form.perfilAcademico.enlaceGoogleScholar" class="form-input" placeholder="Enlace Google Scholar" /></div>
            </div>
          </section>

          <!-- 3. Experiencia Científica -->
          <section>
            <div class="section-title">
              <svg class="w-4 h-4 text-green-600 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
              </svg>
              <span>3. Experiencia Científica</span>
              <div class="flex-1 h-px bg-gray-200"></div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div><input v-model.number="form.experienciaCientifica.anosExperiencia" type="number" min="0" class="form-input" placeholder="Años de experiencia en investigación" /></div>
              <div class="space-y-2">
                <BoolRadio v-model="form.experienciaCientifica.experienciaEvaluandoProyectos" label="Experiencia evaluando proyectos de investigación" />
                <BoolRadio v-model="form.experienciaCientifica.experienciaRevisionPares" label="Experiencia en revisión por pares (peer review)" />
                <BoolRadio v-model="form.experienciaCientifica.participacionEventosInternacionales" label="Ha participado como evaluador en eventos científicos internacionales" />
                <BoolRadio v-model="form.experienciaCientifica.publicacionesIndexadas" label="Publicaciones indexadas" />
              </div>
              <div class="md:col-span-2">
                <textarea v-model="form.experienciaCientifica.experienciaEmprendimiento" class="form-input resize-none" rows="3" maxlength="500" placeholder="Experiencia en emprendimiento / innovación (breve descripción, máx. 3 líneas)"></textarea>
              </div>
            </div>
          </section>

          <!-- 4. Declaración Ética -->
          <section>
            <div class="section-title">
              <svg class="w-4 h-4 text-green-600 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
              </svg>
              <span>4. Declaración Ética y Científica</span>
              <div class="flex-1 h-px bg-gray-200"></div>
            </div>
            <div class="data-box space-y-2">
              <label v-for="dec in declaraciones" :key="dec" class="flex items-start gap-2 text-sm cursor-pointer">
                <input type="checkbox" v-model="declaracionesAceptadas" :value="dec" class="mt-0.5 accent-green-600" />
                {{ dec }}
              </label>
            </div>
          </section>

          <!-- 5. Modalidad -->
          <section>
            <div class="section-title">
              <svg class="w-4 h-4 text-green-600 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
              </svg>
              <span>5. Modalidad de asistencia</span>
              <div class="flex-1 h-px bg-gray-200"></div>
            </div>
            <div class="flex gap-4">
              <label class="flex items-center gap-2 text-sm cursor-pointer"><input type="radio" v-model="form.modalidadAsistencia" value="virtual" class="accent-green-600" /> Virtual</label>
              <label class="flex items-center gap-2 text-sm cursor-pointer"><input type="radio" v-model="form.modalidadAsistencia" value="presencial" class="accent-green-600" /> Presencial</label>
            </div>
          </section>

          <!-- 6. Evento activo -->
          <section>
            <div class="section-title">
              <svg class="w-4 h-4 text-green-600 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 0 .375 5.913v0a3.001 3.001 0 0 0 .375-5.913V6.375c0-.621.504-1.125 1.125-1.125h9.75c.621 0 1.125.504 1.125 1.125v3.026a3.001 3.001 0 0 0 .375 5.913v0a2.999 2.999 0 0 0 .375-5.913V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" />
              </svg>
              <span>6. Evento activo</span>
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
              {{ enviando ? 'Registrando...' : 'Registrar Líder de Semillero' }}
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
const { listaInstituciones } = useInstituciones()

const form = reactive({
  nombreCompleto: '', nacionalidad: '', numeroIdentificacion: '', email: '',
  whatsappTelefono: '', cargoActual: '', nombreSemillero: '', institucion: '',
  password: '', modalidadAsistencia: '', eventoRef: '', declaracionEtica: false,
  perfilAcademico: { nivelFormacion: '', areasDisciplinares: [] as string[], grupoRedInvestigacion: '', enlaceCvlac: '', enlaceOrcid: '', enlaceGoogleScholar: '' },
  experienciaCientifica: { anosExperiencia: 0, experienciaEvaluandoProyectos: false, experienciaRevisionPares: false, participacionEventosInternacionales: false, publicacionesIndexadas: false, experienciaEmprendimiento: '' },
})
const confirmarPassword = ref('')
const errores = reactive<Record<string, string>>({})
const declaracionesAceptadas = ref<string[]>([])
const mensaje = ref('')
const exito = ref(false)
const enviando = ref(false)

const areasDisciplinaresGrupos = [
  { label: 'Ciencias Agrarias y Tecnológicas', opciones: ['Ciencias Agrícolas', 'Biotecnología Agrícola', 'Ciencias Veterinarias', 'Ciencias Animales y Lechería'] },
  { label: 'Humanidades y Artes', opciones: ['Arte', 'Idiomas y Literatura', 'Historia y Arqueología'] },
  { label: 'Ciencias Sociales', opciones: ['Periodismo y Comunicaciones', 'Geografía Social y Económica', 'Ciencias Políticas', 'Derecho', 'Sociología', 'Ciencias de la Educación', 'Economía y Negocios', 'Psicología'] },
  { label: 'Ciencias Médicas y de la Salud', opciones: ['Medicina Clínica', 'Ciencias de la Salud', 'Biotecnología en Salud', 'Otras Ciencias Médicas'] },
  { label: 'Ingeniería y Tecnología', opciones: ['Ingeniería Civil', 'Ingeniería Eléctrica, Electrónica e Informática', 'Ingeniería Mecánica', 'Ingeniería Química', 'Ingeniería de los Materiales', 'Ingeniería Médica', 'Ingeniería Ambiental', 'Ingeniería Industrial', 'Nanotecnología', 'Biotecnología Industrial', 'Biotecnología Medioambiental', 'Tecnologías y Ciencias de la Información y la Comunicación (TIC)'] },
  { label: 'Ciencias Naturales', opciones: ['Matemáticas', 'Ciencias Físicas', 'Ciencias Biológicas', 'Ciencias de la Tierra y Medioambientales', 'Otras Ciencias Naturales'] },
  { label: 'Emprendimiento e Innovación', opciones: ['Emprendimiento e Innovación'] },
]
const nivelesFormacion = [
  { value: 'profesional', label: 'Profesional' }, { value: 'especialista', label: 'Especialista' },
  { value: 'magister', label: 'Magíster' }, { value: 'doctor', label: 'Doctor(a)' }, { value: 'postdoctorado', label: 'Postdoctorado' },
]
const declaraciones = [
  'Declaro actuar con objetividad, confidencialidad y rigor científico.',
  'Declaro no tener conflicto de interés con los proyectos asignados.',
  'En caso de conflicto, lo informaré oportunamente.',
]

async function enviar() {
  errores.nombreCompleto = form.nombreCompleto ? '' : 'Campo requerido'
  if (form.password !== confirmarPassword.value) { errores.password = 'Las contraseñas no coinciden'; return }
  form.declaracionEtica = declaracionesAceptadas.value.length === declaraciones.length
  enviando.value = true
  try {
    await post('/auth/register/lider', form)
    exito.value = true; mensaje.value = '¡Registro exitoso! Tu solicitud está en revisión.'
  } catch (e: any) {
    exito.value = false; mensaje.value = e?.data?.message || 'Error al registrar.'
  } finally { enviando.value = false }
}
onMounted(() => cargarEventosActivos())
</script>

<style scoped>
.card-header { background: linear-gradient(100deg, #1a3a1a 0%, #1e5c2a 55%, #2d8a3e 100%); }
.section-title { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; }
.section-title span { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #4b5563; white-space: nowrap; }
.data-box { border: 1px solid #f0f0f0; border-radius: 0.75rem; background: rgba(249,250,251,0.6); padding: 0.75rem 1rem; }
.btn-submit { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.625rem 1.5rem; border-radius: 0.75rem; font-size: 0.875rem; font-weight: 700; color: #fff; background: linear-gradient(90deg, #1a3a1a 0%, #1e5c2a 50%, #2d8a3e 100%); transition: all 0.15s; }
.btn-submit:hover:not(:disabled) { background: linear-gradient(90deg, #142b14 0%, #164d22 50%, #237033 100%); box-shadow: 0 4px 12px rgba(45,138,62,0.3); }
</style>
