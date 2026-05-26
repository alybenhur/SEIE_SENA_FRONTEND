export interface AuthUser {
  userId: string
  email: string
  rol: string
  nombreCompleto: string
}

// useState de Nuxt: estado compartido y reactivo en toda la app,
// funciona en cualquier contexto (middleware, plugin, componente) sin Pinia.
export function useAuthStore() {
  const token = useState<string | null>('auth.token', () => null)
  const user  = useState<AuthUser | null>('auth.user', () => null)

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin         = computed(() => user.value?.rol === 'admin')
  const isCoordinador   = computed(() => user.value?.rol === 'coordinador')
  const isEvaluador     = computed(() => user.value?.rol === 'evaluador')
  const rol             = computed(() => user.value?.rol ?? null)

  function init() {
    if (import.meta.client) {
      const saved = localStorage.getItem('token')
      if (saved) {
        token.value = saved
        user.value  = decodeToken(saved)
      }
    }
  }

  function setToken(newToken: string) {
    token.value = newToken
    user.value  = decodeToken(newToken)
    if (import.meta.client) localStorage.setItem('token', newToken)
  }

  function logout() {
    token.value = null
    user.value  = null
    if (import.meta.client) localStorage.removeItem('token')
  }

  // reactive() desempaqueta automáticamente todos los Refs/ComputedRefs internos,
  // igual que Pinia. Esto hace que store.token, store.rol, store.isAuthenticated, etc.
  // devuelvan el VALOR directo tanto en templates como en código script/middleware.
  return reactive({ token, user, isAuthenticated, isAdmin, isCoordinador, isEvaluador, rol, init, setToken, logout })
}

function decodeToken(token: string): AuthUser | null {
  try {
    const payload = token.split('.')[1]
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')))
    return {
      userId:        decoded.sub,
      email:         decoded.email,
      rol:           decoded.rol,
      nombreCompleto: decoded.nombreCompleto ?? '',
    }
  } catch {
    return null
  }
}
