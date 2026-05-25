<template>
  <NuxtLayout name="investigador">
    <div class="max-w-3xl mx-auto">

      <!-- Cabecera -->
      <div class="flex items-center gap-3 mb-6">
        <NuxtLink to="/investigador/proyectos" class="text-gray-400 hover:text-gray-600 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </NuxtLink>
        <div>
          <h2 class="text-2xl font-bold text-gray-800">Nuevo Proyecto</h2>
          <p class="text-sm text-gray-500">Complete todos los campos requeridos para presentar su proyecto</p>
        </div>
      </div>

      <div class="space-y-6">

        <!-- ── SECCIÓN 1: Información General ── -->
        <section class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-100" style="background: linear-gradient(135deg,#0f766e,#14b8a6)">
            <h3 class="text-white font-semibold text-sm flex items-center gap-2">
              <span class="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">1</span>
              Información General
            </h3>
          </div>
          <div class="p-6 space-y-5">

            <!-- Título -->
            <div>
              <label class="form-label">Título del proyecto <span class="text-red-500">*</span></label>
              <input v-model="form.titulo" class="form-input" placeholder="Título completo del proyecto" />
              <p class="form-error">{{ errores.titulo }}</p>
            </div>

            <!-- Línea de Investigación + Categoría -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="form-label">Línea de investigación <span class="text-red-500">*</span></label>
                <select v-model="form.lineaInvestigacion" class="form-input">
                  <option value="">Selecciona una línea</option>
                  <option v-for="linea in listaLineas" :key="linea" :value="linea">{{ linea }}</option>
                </select>
                <p class="form-error">{{ errores.lineaInvestigacion }}</p>
              </div>
              <div>
                <label class="form-label">Categoría</label>
                <select v-model="form.categoria" class="form-input">
                  <option value="">Selecciona una categoría</option>
                  <option value="propuesta">Propuesta</option>
                  <option value="en_curso">En curso</option>
                  <option value="terminado">Terminado</option>
                </select>
                <p class="form-error">{{ errores.categoria }}</p>
              </div>
            </div>

            <!-- Evento -->
            <div>
              <label class="form-label">Evento <span class="text-red-500">*</span></label>
              <select v-model="form.eventoRef" class="form-input" :disabled="sinEventosDisponibles">
                <option value="">{{ sinEventosDisponibles ? 'Sin eventos disponibles' : 'Selecciona un evento' }}</option>
                <option v-for="e in eventos" :key="e._id" :value="e._id">
                  {{ e.nombre }} — cierra {{ fechaCorta(e.fechaLimiteRegistro) }}
                </option>
              </select>
              <p class="form-error">{{ errores.eventoRef }}</p>
            </div>

          </div>
        </section>

        <!-- ── SECCIÓN 2: Información Académica y Ubicación ── -->
        <section class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-100" style="background: linear-gradient(135deg,#1d4ed8,#3b82f6)">
            <h3 class="text-white font-semibold text-sm flex items-center gap-2">
              <span class="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">2</span>
              Información Académica y Ubicación
            </h3>
          </div>
          <div class="p-6 space-y-5">

            <!-- Institución -->
            <div>
              <label class="form-label">Institución</label>
              <select v-model="form.institucion" class="form-input">
                <option value="">Selecciona una institución</option>
                <option v-for="inst in instituciones" :key="inst" :value="inst">{{ inst }}</option>
              </select>
            </div>

            <!-- Área + Programa -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="form-label">Área</label>
                <select v-model="form.area" class="form-input">
                  <option value="">Selecciona un área</option>
                  <option v-for="a in AREAS" :key="a" :value="a">{{ a }}</option>
                </select>
              </div>
              <div>
                <label class="form-label">Programa académico</label>
                <input v-model="form.programaAcademico" class="form-input" placeholder="Ej: Tecnología en Sistemas" />
              </div>
            </div>

            <!-- Departamento + Municipio -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="form-label">Departamento</label>
                <select v-model="form.departamento" class="form-input" @change="form.municipio = ''">
                  <option value="">Selecciona un departamento</option>
                  <option v-for="dep in DEPARTAMENTOS" :key="dep" :value="dep">{{ dep }}</option>
                </select>
              </div>
              <div>
                <label class="form-label">Municipio</label>
                <select v-model="form.municipio" class="form-input" :disabled="!form.departamento">
                  <option value="">Selecciona un municipio</option>
                  <option v-for="mun in municipiosActuales" :key="mun" :value="mun">{{ mun }}</option>
                </select>
              </div>
            </div>

            <!-- Modalidad -->
            <div>
              <label class="form-label">Modalidad</label>
              <div class="flex gap-6 mt-1">
                <label class="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="radio" v-model="form.modalidad" value="virtual" class="accent-teal-600" /> Virtual
                </label>
                <label class="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="radio" v-model="form.modalidad" value="presencial" class="accent-teal-600" /> Presencial
                </label>
              </div>
            </div>

            <!-- Semillero -->
            <div>
              <label class="form-label">Semillero asociado</label>
              <select v-model="form.semilleroNombre" class="form-input">
                <option value="">Selecciona un semillero</option>
                <option v-for="s in listaSemilleros" :key="s" :value="s">{{ s }}</option>
              </select>
            </div>

            <!-- Palabras clave -->
            <div>
              <label class="form-label">Palabras clave</label>
              <div class="flex gap-2">
                <input v-model="nuevaPalabraClave" class="form-input flex-1" placeholder="Escribe y presiona Enter o Agregar"
                  @keydown.enter.prevent="agregarPalabraClave"
                  :disabled="form.palabrasClaveArr.length >= 5" />
                <button type="button" @click="agregarPalabraClave"
                  class="px-4 py-2 rounded-lg text-sm font-medium transition-colors border"
                  :class="form.palabrasClaveArr.length >= 5
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    : 'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100'"
                  :disabled="form.palabrasClaveArr.length >= 5">
                  Agregar
                </button>
              </div>
              <div class="flex items-center justify-between mt-1">
                <p v-if="form.palabrasClaveArr.length >= 5" class="text-xs text-amber-600">Máximo 5 palabras clave alcanzado.</p>
                <p v-else class="text-xs text-gray-400">{{ form.palabrasClaveArr.length }}/5 palabras clave</p>
              </div>
              <div v-if="form.palabrasClaveArr.length" class="flex flex-wrap gap-2 mt-1">
                <span v-for="(p, i) in form.palabrasClaveArr" :key="i"
                  class="flex items-center gap-1 px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-medium border border-teal-200">
                  {{ p }}
                  <button @click="form.palabrasClaveArr.splice(i, 1)" class="text-teal-400 hover:text-red-500 ml-1">×</button>
                </span>
              </div>
            </div>

          </div>
        </section>

        <!-- ── SECCIÓN 3: Equipo ── -->
        <section class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-100" style="background: linear-gradient(135deg,#7c3aed,#a78bfa)">
            <h3 class="text-white font-semibold text-sm flex items-center gap-2">
              <span class="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">3</span>
              Equipo de Trabajo
            </h3>
          </div>
          <div class="p-6 space-y-6">

            <!-- Autores Principales -->
            <div>
              <div class="flex items-center justify-between mb-3">
                <label class="form-label mb-0">Autores / Investigadores principales</label>
                <button type="button" @click="agregarAutor(form.autoresPrincipales)"
                  class="text-xs px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition-colors">
                  + Agregar
                </button>
              </div>
              <div v-for="(a, i) in form.autoresPrincipales" :key="i" class="bg-gray-50 rounded-xl p-4 mb-3 relative border border-gray-200">
                <button @click="form.autoresPrincipales.splice(i,1)" class="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-lg leading-none">×</button>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input v-model="a.nombreCompleto" class="form-input text-sm" placeholder="Nombre completo" />
                  <input v-model="a.documento" class="form-input text-sm" placeholder="No. Documento" />
                  <input v-model="a.email" class="form-input text-sm" placeholder="Correo electrónico" />
                  <input v-model="a.telefono" class="form-input text-sm" placeholder="Teléfono / WhatsApp" />
                  <div class="sm:col-span-2">
                    <select v-model="a.rol" class="form-input text-sm">
                      <option value="">Rol en el proyecto</option>
                      <option value="Investigador principal">Investigador principal</option>
                      <option value="Aprendiz líder">Aprendiz líder</option>
                      <option value="Co-investigador">Co-investigador</option>
                    </select>
                  </div>
                </div>
              </div>
              <p v-if="!form.autoresPrincipales.length" class="text-xs text-gray-400 italic">No se han agregado autores principales.</p>
            </div>

            <!-- Coautores -->
            <div>
              <div class="flex items-center justify-between mb-3">
                <label class="form-label mb-0">Coautores / Aprendices</label>
                <button type="button" @click="agregarAutor(form.coautores)"
                  class="text-xs px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition-colors">
                  + Agregar
                </button>
              </div>
              <div v-for="(a, i) in form.coautores" :key="i" class="bg-gray-50 rounded-xl p-4 mb-3 relative border border-gray-200">
                <button @click="form.coautores.splice(i,1)" class="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-lg leading-none">×</button>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input v-model="a.nombreCompleto" class="form-input text-sm" placeholder="Nombre completo" />
                  <input v-model="a.documento" class="form-input text-sm" placeholder="No. Documento" />
                  <input v-model="a.email" class="form-input text-sm" placeholder="Correo electrónico" />
                  <input v-model="a.telefono" class="form-input text-sm" placeholder="Teléfono / WhatsApp" />
                </div>
              </div>
              <p v-if="!form.coautores.length" class="text-xs text-gray-400 italic">No se han agregado coautores.</p>
            </div>

            <!-- Autores Docentes -->
            <div>
              <div class="flex items-center justify-between mb-3">
                <label class="form-label mb-0">Instructores / Docentes</label>
                <button type="button" @click="agregarAutor(form.autoresDocentes)"
                  class="text-xs px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition-colors">
                  + Agregar
                </button>
              </div>
              <div v-for="(a, i) in form.autoresDocentes" :key="i" class="bg-gray-50 rounded-xl p-4 mb-3 relative border border-gray-200">
                <button @click="form.autoresDocentes.splice(i,1)" class="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-lg leading-none">×</button>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input v-model="a.nombreCompleto" class="form-input text-sm" placeholder="Nombre completo" />
                  <input v-model="a.documento" class="form-input text-sm" placeholder="No. Documento" />
                  <input v-model="a.email" class="form-input text-sm" placeholder="Correo electrónico" />
                  <input v-model="a.telefono" class="form-input text-sm" placeholder="Teléfono / WhatsApp" />
                </div>
              </div>
              <p v-if="!form.autoresDocentes.length" class="text-xs text-gray-400 italic">No se han agregado instructores.</p>
            </div>

            <!-- Ponentes -->
            <div>
              <div class="flex items-center justify-between mb-3">
                <label class="form-label mb-0">Ponentes</label>
                <button type="button" @click="agregarAutor(form.ponentes)"
                  class="text-xs px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition-colors">
                  + Agregar
                </button>
              </div>
              <div v-for="(a, i) in form.ponentes" :key="i" class="bg-gray-50 rounded-xl p-4 mb-3 relative border border-gray-200">
                <button @click="form.ponentes.splice(i,1)" class="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-lg leading-none">×</button>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input v-model="a.nombreCompleto" class="form-input text-sm" placeholder="Nombre completo" />
                  <input v-model="a.email" class="form-input text-sm" placeholder="Correo electrónico" />
                  <input v-model="a.telefono" class="form-input text-sm" placeholder="Teléfono / WhatsApp" />
                </div>
              </div>
              <p v-if="!form.ponentes.length" class="text-xs text-gray-400 italic">No se han agregado ponentes.</p>
            </div>

            <!-- Contacto -->
            <div class="pt-4 border-t border-gray-100">
              <label class="form-label">Información de contacto del proyecto</label>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <div>
                  <input v-model="form.emailContacto" type="email" class="form-input" placeholder="Email de contacto" />
                </div>
                <div>
                  <div class="flex gap-2">
                    <input v-model="nuevoTelefono" class="form-input flex-1" placeholder="Teléfono de contacto"
                      @keydown.enter.prevent="agregarTelefono" />
                    <button type="button" @click="agregarTelefono"
                      class="px-3 py-2 rounded-lg bg-purple-50 text-purple-700 text-sm border border-purple-200 hover:bg-purple-100">+</button>
                  </div>
                  <div v-if="form.telefonosContacto.length" class="flex flex-wrap gap-2 mt-2">
                    <span v-for="(t, i) in form.telefonosContacto" :key="i"
                      class="flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs border border-purple-200">
                      {{ t }}
                      <button @click="form.telefonosContacto.splice(i,1)" class="text-purple-400 hover:text-red-500 ml-1">×</button>
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        <!-- ── SECCIÓN 4: Contenido Académico ── -->
        <section class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-100" style="background: linear-gradient(135deg,#b45309,#f59e0b)">
            <h3 class="text-white font-semibold text-sm flex items-center gap-2">
              <span class="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">4</span>
              Contenido Académico
            </h3>
          </div>
          <div class="p-6 space-y-5">

            <!-- Resumen -->
            <div>
              <label class="form-label">Resumen ejecutivo <span class="text-red-500">*</span></label>
              <p class="text-xs text-gray-400 mb-1">Máx. 2000 caracteres — describe el problema, metodología e impacto.</p>
              <textarea v-model="form.resumen" class="form-input resize-none" rows="4" maxlength="2000"
                placeholder="Describe el problema, metodología e impacto." />
              <div class="text-right text-xs text-gray-400 mt-1">{{ form.resumen.length }}/2000</div>
              <p class="form-error">{{ errores.resumen }}</p>
            </div>

            <!-- Introducción -->
            <div>
              <label class="form-label">Introducción <span class="text-xs text-gray-400">(opcional)</span></label>
              <textarea v-model="form.introduccion" class="form-input resize-none" rows="3" maxlength="5000"
                placeholder="Contexto y antecedentes del proyecto." />
            </div>

            <!-- Planteamiento -->
            <div>
              <label class="form-label">Planteamiento del problema <span class="text-xs text-gray-400">(opcional)</span></label>
              <textarea v-model="form.planteamientoProblema" class="form-input resize-none" rows="3" maxlength="5000"
                placeholder="Descripción del problema o necesidad que aborda el proyecto." />
            </div>

            <!-- Objetivo general -->
            <div>
              <label class="form-label">Objetivo general <span class="text-xs text-gray-400">(opcional)</span></label>
              <textarea v-model="form.objetivoGeneral" class="form-input resize-none" rows="2" maxlength="2000"
                placeholder="Objetivo principal del proyecto." />
            </div>

            <!-- Objetivos específicos -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <label class="form-label mb-0">Objetivos específicos</label>
                <button type="button" @click="form.objetivosEspecificos.push('')"
                  class="text-xs px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors">
                  + Agregar objetivo
                </button>
              </div>
              <div v-for="(obj, i) in form.objetivosEspecificos" :key="i" class="flex gap-2 mb-2">
                <span class="w-6 h-6 mt-2 flex-shrink-0 rounded-full bg-amber-100 text-amber-700 text-xs flex items-center justify-center font-bold">{{ i+1 }}</span>
                <input v-model="form.objetivosEspecificos[i]" class="form-input flex-1 text-sm" :placeholder="`Objetivo específico ${i+1}`" />
                <button @click="form.objetivosEspecificos.splice(i,1)" class="mt-2 text-gray-400 hover:text-red-500">×</button>
              </div>
              <p v-if="!form.objetivosEspecificos.length" class="text-xs text-gray-400 italic">No se han agregado objetivos específicos.</p>
            </div>

            <!-- Referente teórico + Metodología -->
            <div class="grid grid-cols-1 gap-5">
              <div>
                <label class="form-label">Referente teórico <span class="text-xs text-gray-400">(opcional)</span></label>
                <textarea v-model="form.referenteTeorico" class="form-input resize-none" rows="3" maxlength="5000"
                  placeholder="Marco teórico y conceptual del proyecto." />
              </div>
              <div>
                <label class="form-label">Metodología <span class="text-xs text-gray-400">(opcional)</span></label>
                <textarea v-model="form.metodologia" class="form-input resize-none" rows="3" maxlength="5000"
                  placeholder="Metodología de investigación utilizada." />
              </div>
              <div>
                <label class="form-label">Resultados esperados <span class="text-xs text-gray-400">(opcional)</span></label>
                <textarea v-model="form.resultadosEsperados" class="form-input resize-none" rows="3" maxlength="5000"
                  placeholder="Resultados o productos esperados del proyecto." />
              </div>
              <div>
                <label class="form-label">Bibliografía <span class="text-xs text-gray-400">(opcional)</span></label>
                <textarea v-model="form.bibliografia" class="form-input resize-none" rows="3" maxlength="5000"
                  placeholder="Referencias bibliográficas (formato APA preferido)." />
              </div>
            </div>

          </div>
        </section>

        <!-- ── SECCIÓN 5: Documento ── -->
        <section class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-100" style="background: linear-gradient(135deg,#0369a1,#0ea5e9)">
            <h3 class="text-white font-semibold text-sm flex items-center gap-2">
              <span class="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">5</span>
              Documentación
            </h3>
          </div>
          <div class="p-6 space-y-5">

            <!-- Upload documento -->
            <div>
              <label class="form-label">Documento del proyecto <span class="text-xs text-gray-400">(PDF o Word, máx. 15 MB)</span></label>
              <div class="mt-1">
                <label
                  class="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-colors"
                  :class="archivoSubido ? 'border-teal-400 bg-teal-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'">
                  <div v-if="!subiendoArchivo && !archivoSubido" class="text-center px-4">
                    <svg class="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                    </svg>
                    <p class="text-sm text-gray-500">Haz clic para subir o arrastra el archivo aquí</p>
                    <p class="text-xs text-gray-400 mt-1">.pdf, .doc, .docx</p>
                  </div>
                  <div v-else-if="subiendoArchivo" class="text-center">
                    <div class="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <p class="text-sm text-teal-600">Subiendo documento...</p>
                  </div>
                  <div v-else class="text-center px-4">
                    <svg class="w-8 h-8 text-teal-500 mx-auto mb-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    <p class="text-sm text-teal-700 font-medium">{{ nombreArchivo }}</p>
                    <p class="text-xs text-teal-500 mt-0.5">Documento subido correctamente</p>
                  </div>
                  <input type="file" class="hidden" accept=".pdf,.doc,.docx" @change="subirDocumento" />
                </label>
                <p v-if="errorArchivo" class="text-xs text-red-600 mt-1">{{ errorArchivo }}</p>
                <p v-if="form.urlDocumento && archivoSubido" class="text-xs text-gray-400 mt-1 truncate">
                  <a :href="form.urlDocumento" target="_blank" class="text-blue-600 hover:underline">Ver documento subido ↗</a>
                  <button type="button" @click="limpiarArchivo" class="ml-3 text-red-500 hover:text-red-700">Eliminar</button>
                </p>
              </div>
            </div>

            <!-- URL externa -->
            <div>
              <label class="form-label">Enlace externo al archivo <span class="text-xs text-gray-400">(Google Drive / OneDrive)</span></label>
              <input v-model="form.urlArchivo" type="url" class="form-input" placeholder="https://..." />
            </div>

          </div>
        </section>

        <!-- ── ACCIONES ── -->
        <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <!-- Aviso sin eventos -->
          <div v-if="sinEventosDisponibles"
            class="flex items-start gap-3 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm mb-4">
            <svg class="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
            <span>No existen eventos disponibles para registrar proyectos en este momento. El plazo de registro de todos los eventos activos ha vencido.</span>
          </div>
          <!-- Mensaje de éxito / error -->
          <p v-if="mensaje" class="text-sm mb-4 p-3 rounded-xl" :class="exito ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'bg-red-50 text-red-600 border border-red-200'">
            {{ mensaje }}
          </p>
          <div class="flex gap-3">
            <button @click="enviar" :disabled="enviando || sinEventosDisponibles"
              class="flex-1 py-3 rounded-xl text-white text-sm font-semibold shadow transition-all flex items-center justify-center gap-2"
              :class="sinEventosDisponibles ? 'opacity-40 cursor-not-allowed' : 'hover:shadow-md'"
              style="background: linear-gradient(135deg, #0f766e, #14b8a6)">
              <svg v-if="!enviando" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
              </svg>
              <div v-else class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              {{ enviando ? 'Enviando...' : 'Presentar proyecto' }}
            </button>
            <NuxtLink to="/investigador/proyectos"
              class="px-6 py-3 rounded-xl border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 transition-colors text-center">
              Cancelar
            </NuxtLink>
          </div>
        </div>

      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { DEPARTAMENTOS, getMunicipios } from '~/composables/useColombia'

definePageMeta({ roles: ['investigador'] })

const { get, post } = useApi()
const { listaLineas, recargar: recargarLineas } = useLineasInvestigacion()
const { listaSemilleros, recargar: recargarSemilleros } = useSemilleros()

// ── Áreas estáticas ──
const AREAS = [
  'Tecnología e Innovación',
  'Salud y Bienestar',
  'Medio Ambiente y Sostenibilidad',
  'Agroindustria y Alimentaria',
  'Construcción e Infraestructura',
  'Comercio y Servicios',
  'Diseño e Industria Creativa',
  'Minería y Energía',
  'Telecomunicaciones y TIC',
  'Gestión Empresarial',
  'Educación y Formación',
  'Logística y Transporte',
]

// ── Formulario ──
const form = reactive({
  titulo: '', tipo: 'investigacion', lineaInvestigacion: '', categoria: '',
  eventoRef: '', semilleroRef: '', semilleroNombre: '',
  institucion: '', area: '', programaAcademico: '',
  departamento: '', municipio: '', modalidad: 'virtual',
  palabrasClaveArr: [] as string[],
  palabrasClave: '',
  // Equipo
  autoresPrincipales: [] as any[],
  coautores: [] as any[],
  autoresDocentes: [] as any[],
  ponentes: [] as any[],
  emailContacto: '',
  telefonosContacto: [] as string[],
  // Contenido
  resumen: '', introduccion: '', planteamientoProblema: '',
  objetivoGeneral: '', objetivosEspecificos: [] as string[],
  referenteTeorico: '', metodologia: '', resultadosEsperados: '', bibliografia: '',
  // Docs
  urlArchivo: '', urlDocumento: '',
})

const errores = reactive({ titulo: '', lineaInvestigacion: '', resumen: '', eventoRef: '', categoria: '' })
const mensaje = ref('')
const exito = ref(false)
const enviando = ref(false)

// ── Listas ──
const eventos = ref<any[]>([])
const instituciones = ref<string[]>([])

const sinEventosDisponibles = computed(() => eventos.value.length === 0 && !cargandoPagina.value)
const cargandoPagina = ref(true)

// ── Colombia ──
const municipiosActuales = computed(() => getMunicipios(form.departamento))

// ── Archivo ──
const subiendoArchivo = ref(false)
const archivoSubido = ref(false)
const nombreArchivo = ref('')
const errorArchivo = ref('')

// ── Palabras clave ──
const nuevaPalabraClave = ref('')
function agregarPalabraClave() {
  const val = nuevaPalabraClave.value.trim()
  if (val && !form.palabrasClaveArr.includes(val) && form.palabrasClaveArr.length < 5) {
    form.palabrasClaveArr.push(val)
  }
  nuevaPalabraClave.value = ''
}

// ── Teléfonos ──
const nuevoTelefono = ref('')
function agregarTelefono() {
  const val = nuevoTelefono.value.trim()
  if (val) form.telefonosContacto.push(val)
  nuevoTelefono.value = ''
}

// ── Equipo ──
function agregarAutor(lista: any[]) {
  lista.push({ nombreCompleto: '', documento: '', email: '', telefono: '', rol: '' })
}

// ── Upload ──
async function subirDocumento(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  errorArchivo.value = ''
  if (file.size > 15 * 1024 * 1024) {
    errorArchivo.value = 'El archivo supera el límite de 15 MB.'
    return
  }
  subiendoArchivo.value = true
  archivoSubido.value = false
  try {
    const formData = new FormData()
    formData.append('file', file)
    const config = useRuntimeConfig()
    const store = useAuthStore()
    const res = await $fetch<{ url: string }>(`${config.public.apiBase}/upload/documento`, {
      method: 'POST',
      headers: store.token ? { Authorization: `Bearer ${store.token}` } : {},
      body: formData,
    })
    form.urlDocumento = res.url
    nombreArchivo.value = file.name
    archivoSubido.value = true
  } catch (e: any) {
    errorArchivo.value = e?.data?.message || 'Error al subir el archivo.'
  } finally {
    subiendoArchivo.value = false
    input.value = ''
  }
}

function limpiarArchivo() {
  form.urlDocumento = ''
  archivoSubido.value = false
  nombreArchivo.value = ''
  errorArchivo.value = ''
}

// ── Enviar ──
async function enviar() {
  errores.titulo = form.titulo.trim() ? '' : 'El título es requerido'
  errores.lineaInvestigacion = form.lineaInvestigacion ? '' : 'Selecciona una línea de investigación'
  errores.resumen = form.resumen.length >= 50 ? '' : 'Mínimo 50 caracteres'
  errores.eventoRef = form.eventoRef ? '' : 'Selecciona un evento'
  errores.categoria = ''
  if (Object.values(errores).some(Boolean)) return

  enviando.value = true
  try {
    // Construir payload limpio: excluir semilleroRef (vacío) y pasar semilleroNombre como string
    const { semilleroRef: _sr, ...rest } = form
    const payload: any = {
      ...rest,
      palabrasClave: form.palabrasClaveArr.join(', '),
      semilleroNombre: form.semilleroNombre || undefined,
    }
    await post('/proyectos', payload)
    exito.value = true
    mensaje.value = 'Proyecto presentado correctamente. Quedará en revisión hasta ser asignado a un evaluador.'
    setTimeout(() => navigateTo('/investigador/proyectos'), 2500)
  } catch (e: any) {
    exito.value = false
    const msg: string = e?.data?.message || 'Error al presentar el proyecto.'
    // Si el error menciona categoría, mostrarlo junto al campo
    if (msg.toLowerCase().includes('categor')) {
      errores.categoria = msg
    } else {
      mensaje.value = msg
    }
  } finally {
    enviando.value = false
  }
}

// ── Fecha corta ──
function fechaCorta(iso: string) {
  return new Date(iso).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })
}

// ── onMounted ──
onMounted(async () => {
  if (!localStorage.getItem('token')) { navigateTo('/login'); return }
  const [ev, inst] = await Promise.all([
    get('/eventos/registro-abierto'),
    get('/instituciones'),
  ]) as any[]
  eventos.value = ev
  instituciones.value = (inst as any[]).map((i: any) => i.nombre)
  cargandoPagina.value = false
  if (listaLineas.value.length === 0) recargarLineas().catch(() => {})
  if (listaSemilleros.value.length === 0) recargarSemilleros().catch(() => {})
})
</script>
