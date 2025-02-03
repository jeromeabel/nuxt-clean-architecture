export const useVersion = () => {
  const VERSION_KEY = 'app-version'
  const isVisible = ref(false)

  const version = useRuntimeConfig().public.version

  const close = () => {
    isVisible.value = false
    localStorage.setItem(VERSION_KEY, version)
  }

  onMounted(() => {
    if (localStorage.getItem(VERSION_KEY) !== version) {
      isVisible.value = true
    }
  })
  
  return {
    close,
    version,
    isVisible,
  }
}
