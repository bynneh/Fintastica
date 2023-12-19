export const useAvatarUrl = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  const getPublicUrl = () => {
    const avatarUrl = user.value?.user_metadata?.avatar_url

    // Check if the user has GitHub authorization
    if (avatarUrl.includes('githubusercontent.com')) {
      return avatarUrl
    }

    // Check if the user has Google authorization
    if (avatarUrl.includes('googleusercontent.com')) {
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
