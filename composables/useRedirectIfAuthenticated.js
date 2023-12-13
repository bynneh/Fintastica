export const useRedirectIfAuthenticated = (url = '/dashboard') => {
  const user = useSupabaseUser()

  watch(
    user,
    (user) => {
      if (user) {
        return navigateTo(url)
      }
    },
    { immediate: true },
  )

  return { user }
}
