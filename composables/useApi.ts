import { useAuthStore } from '~/stores/auth'

export function useApi() {
  const config = useRuntimeConfig()
  const base = config.public.apiBase

  function headers() {
    const store = useAuthStore()
    return store.token ? { Authorization: `Bearer ${store.token}` } : {}
  }

  async function get<T>(path: string): Promise<T> {
    return $fetch<T>(`${base}${path}`, { headers: headers() })
  }

  async function post<T>(path: string, body: unknown): Promise<T> {
    return $fetch<T>(`${base}${path}`, { method: 'POST', body, headers: headers() })
  }

  async function patch<T>(path: string, body: unknown): Promise<T> {
    return $fetch<T>(`${base}${path}`, { method: 'PATCH', body, headers: headers() })
  }

  async function del<T>(path: string): Promise<T> {
    return $fetch<T>(`${base}${path}`, { method: 'DELETE', headers: headers() })
  }

  return { get, post, patch, del }
}
