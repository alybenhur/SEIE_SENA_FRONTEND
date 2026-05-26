import { useAuthStore } from '~/stores/auth'

export default defineNuxtPlugin((nuxtApp) => {
  // Pinia v3: pasar $pinia explícitamente para garantizar el contexto correcto
  const store = useAuthStore(nuxtApp.$pinia)
  store.init()
})
