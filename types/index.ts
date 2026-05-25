export interface Departamento {
  id: number
  departamento: string
  ciudades: string[]
}

export enum RolUsuario {
  EVALUADOR = 'evaluador',
  INVESTIGADOR = 'investigador',
  EMPRENDEDOR = 'emprendedor',
  LIDER_SEMILLERO = 'lider_semillero',
}

export enum EstadoUsuario {
  PENDIENTE = 'pendiente',
  APROBADO = 'aprobado',
  RECHAZADO = 'rechazado',
}

export interface EjeTematico {
  id: number
  nombre: string
  descripcion: string
}

export interface Evento {
  _id: string
  nombre: string
  fechaInicio: string
  fechaFin: string
  modalidades: string[]
  lugar?: string
}

export interface Semillero {
  _id: string
  nombre: string
  institucion?: string
  ciudad?: string
  departamento?: string
}