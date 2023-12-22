export function useIsMobile() {
  const mediaQuery = useMediaQuery('(max-width: 465px)')
  const isMobile = ref(false)

  onMounted(() => {
    isMobile.value = mediaQuery.value
  })

  watch(mediaQuery, (newValue) => {
    isMobile.value = newValue
  })

  return isMobile
}
