export const useAvatarUrl = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  const url = ref(null)

  const getPublicUrl = () => {
    if (
      !user.value ||
      !user.value.user_metadata ||
      !user.value.user_metadata.avatar_url
    ) {
      return null
    }

    const avatarUrl = user.value.user_metadata.avatar_url

    // Check if the user has GitHub or Google authorization
    if (
      avatarUrl.includes('githubusercontent.com') ||
      avatarUrl.includes('googleusercontent.com')
    ) {
      return avatarUrl
    }

    const { data, error } = supabase.storage
      .from('avatars')
      .getPublicUrl(avatarUrl)

    if (error) {
      console.error('Error getting public URL:', error)
      return null
    }

    return data?.publicUrl || null
  }

  watch(
    user,
    () => {
      url.value = getPublicUrl()
    },
    { immediate: true },
  )

  return { url }
}
