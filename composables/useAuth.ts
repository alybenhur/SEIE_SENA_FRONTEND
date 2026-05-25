import { useAuthStore } from '~/stores/auth'

export function useAuth() {
  const store = useAuthStore()
  const router = useRouter()

  async function login(email: string, password: string) {
    const data = await $fetch<{ access_token: string }>('/auth/login', {
      baseURL: useRuntimeConfig().public.apiBase,
      method: 'POST',
      body: { email, password },
    })
    store.setToken(data.access_token)
  }

  function logout() {
    store.logout()
    router.push('/login')
  }

  function requireRole(...roles: string[]) {
    if (!store.isAuthenticated) return false
    if (roles.length === 0) return true
    return roles.includes(store.rol ?? '')
  }

  return {
    user: computed(() => store.user),
    token: computed(() => store.token),
    isAuthenticated: computed(() => store.isAuthenticated),
    isAdmin: computed(() => store.isAdmin),
    isEvaluador: computed(() => store.isEvaluador),
    rol: computed(() => store.rol),
    login,
    logout,
    requireRole,
  }
}
