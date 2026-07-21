import { defineStore } from 'pinia'

export interface AuthUser {
  userId: string
  email: string
  rol: string
  nombreCompleto: string
  mustChangePassword?: boolean
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null as string | null,
    user: null as AuthUser | null,
    mustChangePassword: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.rol === 'admin',
    isCoordinador: (state) => state.user?.rol === 'coordinador',
    isEvaluador: (state) => state.user?.rol === 'evaluador',
    rol: (state) => state.user?.rol ?? null,
  },

  actions: {
    init() {
      if (import.meta.client) {
        const token = localStorage.getItem('token')
        if (token) {
          this.token = token
          this.user = decodeToken(token)
        }
      }
    },

    setToken(token: string, mustChange = false) {
      this.token = token
      this.user = decodeToken(token)
      this.mustChangePassword = mustChange || !!(this.user?.mustChangePassword)
      if (import.meta.client) {
        localStorage.setItem('token', token)
      }
    },

    logout() {
      this.token = null
      this.user = null
      this.mustChangePassword = false
      if (import.meta.client) {
        localStorage.removeItem('token')
      }
    },
  },
})

function decodeToken(token: string): AuthUser | null {
  try {
    const payload = token.split('.')[1]
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')))
    return {
      userId: decoded.sub,
      email: decoded.email,
      rol: decoded.rol,
      nombreCompleto: decoded.nombreCompleto ?? '',
      mustChangePassword: !!decoded.mustChangePassword,
    }
  } catch {
    return null
  }
}
