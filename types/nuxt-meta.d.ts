declare module '#app' {
  interface PageMeta {
    roles?: string[]
  }
}

declare module 'vue-router' {
  interface RouteMeta {
    roles?: string[]
  }
}

export {}
