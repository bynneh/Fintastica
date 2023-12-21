export default defineNuxtRouteMiddleware((to, from) => {
  if (from.path !== '/confirm') {
    return navigateTo('/dashboard')
  }
})
