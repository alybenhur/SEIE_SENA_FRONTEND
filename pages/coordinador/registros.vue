<template>
  <NuxtLayout name="coordinador">

    <!-- Encabezado + filtros -->
    <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
      <div>
        <h2 class="text-xl font-bold text-gray-800">Registros públicos</h2>
        <p v-if="miEvento" class="text-sm text-green-700 mt-0.5">
          Evento: <strong>{{ miEvento?.nombre ?? miEvento }}</strong>
        </p>
        <p v-else class="text-sm text-red-500 mt-0.5">⚠ No tienes un evento asignado. Contacta al administrador.</p>
      </div>
      <div class="flex gap-2 flex-wrap">
        <select v-model="filtroRol"
          class="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-green-300">
          <option value="">Todos los tipos</option>
          <option value="evaluador">Evaluador</option>
          <option value="investigador">Investigador</option>
          <option value="emprendedor">Emprendedor</option>
          <option value="lider_semillero">Líder de semillero</option>
        </select>
        <select v-model="filtroEstado"
          class="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-green-300">
          <option value="">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="aprobado">Aprobado</option>
          <option value="rechazado">Rechazado</option>
        </select>
      </div>
    </div>

    <!-- Sin resultados -->
    <div v-if="usuariosFiltrados.length === 0"
      class="bg-white rounded-2xl border border-gray-200 shadow-sm text-center py-16 text-gray-400">
      <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
      </svg>
      <p class="font-medium">No hay registros con estos filtros.</p>
    </div>

    <!-- Cards de registros -->
    <div class="space-y-5">
      <div v-for="u in usuariosFiltrados" :key="u._id"
        class="rounded-2xl overflow-hidden shadow-md border border-gray-200 bg-white">

        <!-- ── Cabecera oscura ── -->
        <div class="px-6 py-4 card-header flex flex-wrap items-center justify-between gap-3">
          <div class="flex-1 min-w-0">
            <h3 class="font-bold text-white text-base leading-snug">{{ u.nombreCompleto }}</h3>
            <p class="text-green-300 text-xs mt-0.5">{{ u.email }}</p>
          </div>
          <div class="flex items-center gap-2 shrink-0">
            <span :class="badgeRolHeader(u.rol)"
              class="px-2.5 py-0.5 rounded-full text-xs font-medium border">
              {{ labelRol(u.rol) }}
            </span>
            <span :class="badgeEstadoHeader(u.estado)"
              class="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide border">
              {{ u.estado }}
            </span>
          </div>
        </div>

        <!-- ── Cuerpo ── -->
        <div class="px-6 py-5 space-y-5">

          <!-- Sección: Información general -->
          <div>
            <div class="section-title">
              <svg class="w-4 h-4 text-green-600 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
              <span>Información general</span>
              <div class="flex-1 h-px bg-gray-200"></div>
            </div>

            <div class="data-box grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <div class="flex gap-2">
                <span class="text-gray-400 w-32 shrink-0">Identificación</span>
                <span class="text-gray-700 font-medium">{{ u.numeroIdentificacion || '—' }}</span>
              </div>
              <div v-if="u.whatsappTelefono" class="flex gap-2">
                <span class="text-gray-400 w-32 shrink-0">WhatsApp/Tel</span>
                <span class="text-gray-700 font-medium">{{ u.whatsappTelefono }}</span>
              </div>
              <div v-if="u.nacionalidad" class="flex gap-2">
                <span class="text-gray-400 w-32 shrink-0">Nacionalidad</span>
                <span class="text-gray-700 font-medium">{{ u.nacionalidad }}</span>
              </div>
              <div v-if="u.institucion" class="flex gap-2">
                <span class="text-gray-400 w-32 shrink-0">Institución</span>
                <span class="text-gray-700 font-medium">{{ u.institucion }}</span>
              </div>
              <div v-if="u.cargoActual" class="flex gap-2">
                <span class="text-gray-400 w-32 shrink-0">Cargo actual</span>
                <span class="text-gray-700 font-medium">{{ u.cargoActual }}</span>
              </div>
              <div v-if="u.modalidadAsistencia" class="flex gap-2">
                <span class="text-gray-400 w-32 shrink-0">Modalidad</span>
                <span class="text-gray-700 font-medium capitalize">{{ u.modalidadAsistencia }}</span>
              </div>
              <div class="flex gap-2">
                <span class="text-gray-400 w-32 shrink-0">Fecha registro</span>
                <span class="text-gray-700 font-medium">{{ formatFecha(u.createdAt) }}</span>
              </div>
            </div>
          </div>

          <!-- Botón ver detalle -->
          <button @click="toggleDetalle(u._id)"
            class="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-green-700 hover:text-green-900 transition-colors select-none group">
            <span class="flex items-center justify-center w-5 h-5 rounded-full border border-green-300 group-hover:border-green-600 transition-colors">
              <svg class="w-3 h-3 transition-transform duration-200" :class="detalleAbierto === u._id ? 'rotate-180' : ''"
                fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="m19 9-7 7-7-7" />
              </svg>
            </span>
            {{ detalleAbierto === u._id ? 'Ocultar detalle' : 'Ver detalle completo' }}
          </button>

          <!-- Secciones colapsables -->
          <div v-if="detalleAbierto === u._id" class="space-y-5">

            <!-- Perfil académico -->
            <div v-if="u.perfilAcademico">
              <div class="section-title">
                <svg class="w-4 h-4 text-green-600 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 10.741-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                </svg>
                <span>Perfil académico</span>
                <div class="flex-1 h-px bg-gray-200"></div>
              </div>
              <div class="data-box grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                <div v-if="u.perfilAcademico.nivelFormacion" class="flex gap-2">
                  <span class="text-gray-400 w-36 shrink-0">Nivel formación</span>
                  <span class="text-gray-700 font-medium capitalize">{{ u.perfilAcademico.nivelFormacion }}</span>
                </div>
                <div v-if="u.perfilAcademico.areasDisciplinares?.length" class="flex gap-2 sm:col-span-2">
                  <span class="text-gray-400 w-36 shrink-0">Áreas discipl.</span>
                  <span class="text-gray-700 font-medium">{{ u.perfilAcademico.areasDisciplinares.join(', ') }}</span>
                </div>
                <div v-if="u.perfilAcademico.grupoRedInvestigacion" class="flex gap-2">
                  <span class="text-gray-400 w-36 shrink-0">Grupo/Red</span>
                  <span class="text-gray-700 font-medium">{{ u.perfilAcademico.grupoRedInvestigacion }}</span>
                </div>
                <div v-if="u.perfilAcademico.enlaceCvlac" class="flex gap-2">
                  <span class="text-gray-400 w-36 shrink-0">CVLAC</span>
                  <a :href="u.perfilAcademico.enlaceCvlac" target="_blank" class="text-green-700 hover:underline font-medium text-sm">Ver enlace</a>
                </div>
                <div v-if="u.perfilAcademico.enlaceOrcid" class="flex gap-2">
                  <span class="text-gray-400 w-36 shrink-0">ORCID</span>
                  <a :href="u.perfilAcademico.enlaceOrcid" target="_blank" class="text-green-700 hover:underline font-medium text-sm">Ver enlace</a>
                </div>
                <div v-if="u.perfilAcademico.enlaceGoogleScholar" class="flex gap-2">
                  <span class="text-gray-400 w-36 shrink-0">Google Scholar</span>
                  <a :href="u.perfilAcademico.enlaceGoogleScholar" target="_blank" class="text-green-700 hover:underline font-medium text-sm">Ver enlace</a>
                </div>
              </div>
            </div>

            <!-- Perfil investigación -->
            <div v-if="u.perfilInvestigacion">
              <div class="section-title">
                <svg class="w-4 h-4 text-green-600 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 1-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                </svg>
                <span>Perfil de investigación</span>
                <div class="flex-1 h-px bg-gray-200"></div>
              </div>
              <div class="data-box grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                <div v-if="u.perfilInvestigacion.areasDisciplinares?.length" class="flex gap-2 sm:col-span-2">
                  <span class="text-gray-400 w-36 shrink-0">Áreas discipl.</span>
                  <span class="text-gray-700 font-medium">{{ u.perfilInvestigacion.areasDisciplinares.join(', ') }}</span>
                </div>
                <div v-if="u.perfilInvestigacion.grupoRedInvestigacion" class="flex gap-2">
                  <span class="text-gray-400 w-36 shrink-0">Grupo/Red</span>
                  <span class="text-gray-700 font-medium">{{ u.perfilInvestigacion.grupoRedInvestigacion }}</span>
                </div>
                <div v-if="u.perfilInvestigacion.anosExperiencia" class="flex gap-2">
                  <span class="text-gray-400 w-36 shrink-0">Años experiencia</span>
                  <span class="text-gray-700 font-medium">{{ u.perfilInvestigacion.anosExperiencia }}</span>
                </div>
                <div v-if="u.perfilInvestigacion.lineaPrincipalInvestigacion" class="flex gap-2 sm:col-span-2">
                  <span class="text-gray-400 w-36 shrink-0">Línea principal</span>
                  <span class="text-gray-700 font-medium">{{ u.perfilInvestigacion.lineaPrincipalInvestigacion }}</span>
                </div>
              </div>
            </div>

            <!-- Experiencia científica -->
            <div v-if="u.experienciaCientifica">
              <div class="section-title">
                <svg class="w-4 h-4 text-green-600 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                </svg>
                <span>Experiencia científica</span>
                <div class="flex-1 h-px bg-gray-200"></div>
              </div>
              <div class="data-box grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                <div v-if="u.experienciaCientifica.anosExperiencia" class="flex gap-2">
                  <span class="text-gray-400 w-36 shrink-0">Años exp.</span>
                  <span class="text-gray-700 font-medium">{{ u.experienciaCientifica.anosExperiencia }}</span>
                </div>
                <div class="flex gap-2">
                  <span class="text-gray-400 w-36 shrink-0">Evalúa proyectos</span>
                  <span class="font-medium" :class="u.experienciaCientifica.experienciaEvaluandoProyectos ? 'text-green-700' : 'text-gray-500'">
                    {{ u.experienciaCientifica.experienciaEvaluandoProyectos ? 'Sí' : 'No' }}
                  </span>
                </div>
                <div class="flex gap-2">
                  <span class="text-gray-400 w-36 shrink-0">Revisión pares</span>
                  <span class="font-medium" :class="u.experienciaCientifica.experienciaRevisionPares ? 'text-green-700' : 'text-gray-500'">
                    {{ u.experienciaCientifica.experienciaRevisionPares ? 'Sí' : 'No' }}
                  </span>
                </div>
                <div class="flex gap-2">
                  <span class="text-gray-400 w-36 shrink-0">Eventos intern.</span>
                  <span class="font-medium" :class="u.experienciaCientifica.participacionEventosInternacionales ? 'text-green-700' : 'text-gray-500'">
                    {{ u.experienciaCientifica.participacionEventosInternacionales ? 'Sí' : 'No' }}
                  </span>
                </div>
                <div class="flex gap-2">
                  <span class="text-gray-400 w-36 shrink-0">Publ. indexadas</span>
                  <span class="font-medium" :class="u.experienciaCientifica.publicacionesIndexadas ? 'text-green-700' : 'text-gray-500'">
                    {{ u.experienciaCientifica.publicacionesIndexadas ? 'Sí' : 'No' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Emprendimiento -->
            <div v-if="u.infoEmprendimiento">
              <div class="section-title">
                <svg class="w-4 h-4 text-green-600 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
                </svg>
                <span>Emprendimiento</span>
                <div class="flex-1 h-px bg-gray-200"></div>
              </div>
              <div class="data-box grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                <div v-if="u.infoEmprendimiento.nombreEmprendimiento" class="flex gap-2">
                  <span class="text-gray-400 w-36 shrink-0">Nombre</span>
                  <span class="text-gray-700 font-medium">{{ u.infoEmprendimiento.nombreEmprendimiento }}</span>
                </div>
                <div v-if="u.infoEmprendimiento.organizacion" class="flex gap-2">
                  <span class="text-gray-400 w-36 shrink-0">Organización</span>
                  <span class="text-gray-700 font-medium">{{ u.infoEmprendimiento.organizacion }}</span>
                </div>
                <div v-if="u.infoEmprendimiento.etapa" class="flex gap-2">
                  <span class="text-gray-400 w-36 shrink-0">Etapa</span>
                  <span class="text-gray-700 font-medium">{{ u.infoEmprendimiento.etapa }}</span>
                </div>
                <div v-if="u.infoEmprendimiento.sector" class="flex gap-2">
                  <span class="text-gray-400 w-36 shrink-0">Sector</span>
                  <span class="text-gray-700 font-medium">{{ u.infoEmprendimiento.sector }}</span>
                </div>
                <div v-if="u.infoEmprendimiento.descripcion" class="flex gap-2 sm:col-span-2">
                  <span class="text-gray-400 w-36 shrink-0">Descripción</span>
                  <span class="text-gray-700 font-medium">{{ u.infoEmprendimiento.descripcion }}</span>
                </div>
              </div>
            </div>

            <!-- Ejes temáticos -->
            <div v-if="u.ejesTematicos?.length">
              <div class="section-title">
                <svg class="w-4 h-4 text-green-600 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6Z" />
                </svg>
                <span>Ejes temáticos</span>
                <div class="flex-1 h-px bg-gray-200"></div>
              </div>
              <div class="flex flex-wrap gap-2">
                <span v-for="eje in u.ejesTematicos" :key="eje"
                  class="px-3 py-1 bg-green-50 text-green-700 border border-green-200 text-xs rounded-full font-semibold">
                  {{ eje }}
                </span>
              </div>
            </div>

            <!-- Observación de rechazo -->
            <div v-if="u.observacion"
              class="flex items-start gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              <svg class="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
              <div><span class="font-semibold">Observación de rechazo:</span> {{ u.observacion }}</div>
            </div>

          </div>
        </div>

        <!-- ── Footer de acciones ── -->
        <div class="px-6 py-4 bg-gray-50 border-t border-gray-100">

          <div v-if="accionActiva !== u._id" class="flex flex-wrap gap-3 items-center">
            <button v-if="u.estado !== 'aprobado'" @click.stop="iniciarAccion(u._id, 'aprobar')"
              class="action-btn action-btn-green">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              Aprobar registro
            </button>
            <button v-if="u.estado !== 'rechazado'" @click.stop="iniciarAccion(u._id, 'rechazar')"
              class="action-btn action-btn-red">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
              Rechazar registro
            </button>
            <span v-if="u.estado === 'aprobado'"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-100 text-green-700 text-xs font-semibold border border-green-200">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              Ya aprobado
            </span>
            <span v-if="u.estado === 'rechazado'"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-100 text-red-600 text-xs font-semibold border border-red-200">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
              Ya rechazado
            </span>
          </div>

          <!-- Panel de confirmación -->
          <div v-if="accionActiva === u._id" @click.stop
            class="bg-white border border-gray-200 rounded-xl p-5 max-w-lg">
            <p class="font-semibold text-gray-800 mb-4">
              {{ tipoAccion === 'aprobar' ? '¿Confirmar aprobación del registro?' : 'Rechazar registro' }}
            </p>
            <div v-if="tipoAccion === 'rechazar'" class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Motivo del rechazo <span class="text-red-500">*</span>
              </label>
              <textarea v-model="observacionTexto" rows="3"
                class="w-full text-sm border border-gray-300 rounded-xl px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-red-300"
                placeholder="Describe el motivo por el cual se rechaza este registro..." />
              <p v-if="errorObservacion" class="text-xs text-red-500 mt-1">{{ errorObservacion }}</p>
            </div>
            <div class="flex gap-3">
              <button @click.stop="confirmarAccion(u._id)" :disabled="procesando"
                :class="tipoAccion === 'aprobar' ? 'action-btn action-btn-green' : 'action-btn action-btn-red'"
                class="disabled:opacity-50">
                {{ procesando ? 'Guardando...' : (tipoAccion === 'aprobar' ? 'Confirmar aprobación' : 'Confirmar rechazo') }}
              </button>
              <button @click.stop="cancelarAccion" class="action-btn action-btn-ghost">Cancelar</button>
            </div>
          </div>

        </div>
      </div>
    </div>

  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({ roles: ['coordinador'] })
const { get, patch } = useApi()

const usuarios = ref<any[]>([])
const filtroRol = ref('')
const filtroEstado = ref('pendiente')
const detalleAbierto = ref<string | null>(null)
const accionActiva = ref<string | null>(null)
const tipoAccion = ref<'aprobar' | 'rechazar'>('aprobar')
const observacionTexto = ref('')
const errorObservacion = ref('')
const procesando = ref(false)

const rolesPublicos = ['evaluador', 'investigador', 'emprendedor', 'lider_semillero']
const miEvento = ref<any>(null)

const usuariosFiltrados = computed(() => {
  return usuarios.value.filter(u => {
    const matchRol = !filtroRol.value || u.rol === filtroRol.value
    const matchEstado = !filtroEstado.value || u.estado === filtroEstado.value
    return matchRol && matchEstado
  })
})

function toggleDetalle(id: string) {
  detalleAbierto.value = detalleAbierto.value === id ? null : id
  accionActiva.value = null
}

function iniciarAccion(id: string, tipo: 'aprobar' | 'rechazar') {
  accionActiva.value = id
  tipoAccion.value = tipo
  observacionTexto.value = ''
  errorObservacion.value = ''
}

function cancelarAccion() {
  accionActiva.value = null
  observacionTexto.value = ''
  errorObservacion.value = ''
}

async function confirmarAccion(id: string) {
  if (tipoAccion.value === 'rechazar' && !observacionTexto.value.trim()) {
    errorObservacion.value = 'La observación es obligatoria para rechazar un registro.'
    return
  }
  procesando.value = true
  try {
    const body: any = { estado: tipoAccion.value === 'aprobar' ? 'aprobado' : 'rechazado' }
    if (tipoAccion.value === 'rechazar') body.observacion = observacionTexto.value.trim()
    await patch(`/usuarios/${id}/estado`, body)
    const idx = usuarios.value.findIndex(u => u._id === id)
    if (idx !== -1) {
      usuarios.value[idx].estado = body.estado
      if (body.observacion) usuarios.value[idx].observacion = body.observacion
    }
    accionActiva.value = null
    observacionTexto.value = ''
  } finally {
    procesando.value = false
  }
}

const labelRol = (r: string) => ({ evaluador: 'Evaluador', investigador: 'Investigador', emprendedor: 'Emprendedor', lider_semillero: 'Líder semillero' }[r] ?? r)

const badgeRolHeader = (r: string) => ({
  evaluador:      'bg-blue-400/20 text-blue-200 border-blue-400/30',
  investigador:   'bg-teal-400/20 text-teal-200 border-teal-400/30',
  emprendedor:    'bg-orange-400/20 text-orange-200 border-orange-400/30',
  lider_semillero:'bg-purple-400/20 text-purple-200 border-purple-400/30',
}[r] ?? 'bg-white/10 text-white/60 border-white/20')

const badgeEstadoHeader = (e: string) => ({
  pendiente: 'bg-yellow-400/20 text-yellow-200 border-yellow-400/30',
  aprobado:  'bg-green-400/20 text-green-200 border-green-400/30',
  rechazado: 'bg-red-400/20 text-red-200 border-red-400/30',
}[e] ?? 'bg-white/10 text-white/60 border-white/20')

const parseFecha = (f: string) => new Date(f.substring(0, 10) + 'T12:00:00')
const formatFecha = (f: string) => f ? parseFecha(f).toLocaleDateString('es-CO') : '—'

async function cargar() {
  const perfil = await get<any>('/usuarios/me')
  miEvento.value = perfil?.eventoRef ?? null
  if (!miEvento.value) { usuarios.value = []; return }

  const eventoId = typeof miEvento.value === 'object' ? miEvento.value._id : miEvento.value
  const resultados = await Promise.all(
    rolesPublicos.map(rol => get<any[]>(`/usuarios?rol=${rol}&eventoRef=${eventoId}`))
  )
  usuarios.value = resultados.flat().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

onMounted(cargar)
</script>

<style scoped>
.card-header {
  background: linear-gradient(100deg, #1a3a1a 0%, #1e5c2a 55%, #2d8a3e 100%);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}
.section-title span {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #4b5563;
  white-space: nowrap;
}

.data-box {
  border: 1px solid #f0f0f0;
  border-radius: 0.75rem;
  background: rgba(249, 250, 251, 0.6);
  padding: 0.75rem 1rem;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  border-radius: 0.625rem;
  font-size: 0.8125rem;
  font-weight: 600;
  transition: all 0.15s;
  white-space: nowrap;
}

.action-btn-green {
  background: linear-gradient(90deg, #1e5c2a, #2d8a3e);
  color: #fff;
}
.action-btn-green:hover { background: linear-gradient(90deg, #164d22, #237033); }

.action-btn-red {
  background-color: #ef4444;
  color: #fff;
}
.action-btn-red:hover { background-color: #dc2626; }

.action-btn-ghost {
  border: 1px solid #d1d5db;
  color: #6b7280;
  background: transparent;
}
.action-btn-ghost:hover {
  border-color: #9ca3af;
  color: #374151;
  background: #f9fafb;
}
</style>
