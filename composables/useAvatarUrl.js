export const useAvatarUrl = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  const url = ref(null)

  const getPublicUrl = () => {
    const avatarUrl =
      user.value?.user_metadata?.user_avatar ||
      user.value?.user_metadata?.avatar_url
    if (
      !avatarUrl ||
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
