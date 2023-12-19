export const useAvatarUrl = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  const getPublicUrl = () => {
    const avatarUrl = user.value?.user_metadata?.avatar_url
    const githubAuth =
      user.value?.user_metadata?.iss === 'https://api.github.com'

    // Check if the user has GitHub authorization
    if (
      githubAuth &&
      avatarUrl.startsWith('https://avatars.githubusercontent.com')
    ) {
      return avatarUrl
    }

    // Check if a new avatar has been uploaded to storage
    const { data, error } = supabase.storage
      .from('avatars')
      .getPublicUrl(avatarUrl)
    if (!error && data) {
      return data.publicUrl
    }

    return null
  }

  const url = ref(getPublicUrl())

  watch(user, () => (url.value = getPublicUrl()), { immediate: true })

  return { url }
}
