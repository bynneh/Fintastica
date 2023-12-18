export function useIsMobile() {
  const isMobile = useMediaQuery('(max-width: 465px)')
  return isMobile
}
