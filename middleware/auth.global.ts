export default defineNuxtRouteMiddleware((to) => {
  const store = useAuthStore()

  // Public routes — no auth needed
  const publicRoutes = ['/', '/login', '/registro', '/certificados/verificar', '/olvide-password', '/restablecer-password']
  if (publicRoutes.some((r) => to.path === r || (r !== '/' && to.path.startsWith(r)))) return

  // Not authenticated → login
  if (!store.isAuthenticated) {
    return navigateTo('/login')
  }

  // Check role restrictions declared in definePageMeta({ roles: [...] })
  const requiredRoles = to.meta.roles as string[] | undefined
  if (requiredRoles && requiredRoles.length > 0) {
    if (!requiredRoles.includes(store.rol ?? '')) {
      const dashboards: Record<string, string> = {
        admin: '/admin/dashboard',
        coordinador: '/coordinador/registros',
        evaluador: '/evaluador/mis-asignaciones',
        investigador: '/investigador/dashboard',
        emprendedor: '/proyecto/mis-proyectos',
        lider_semillero: '/proyecto/mis-proyectos',
      }
      return navigateTo(dashboards[store.rol ?? ''] ?? '/login')
    }
  }
})
