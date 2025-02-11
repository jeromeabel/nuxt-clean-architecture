import type { IVersionRepository } from "../repositories/version-repository"

export const useVersion = (repository: IVersionRepository) => {
  // const VERSION_KEY = 'app-version' // We don't need this implementation detail anymore
  const isVisible = ref(false)

  // TODO: we could check if version is undefined, it could be a problem
  const version = repository.getCurrentVersion()
  
  const close = () => {
    isVisible.value = false
    // By focusing on business logic, a typescript warns us from the repository interface, 
    // That said that we can't store a undefined version. That's indeed a good idea.
    // It helps us to add this condition and improve the case when version is undefined
    if(version) repository.storeVersion(version) 
  }

  const init = () => {
    if (repository.getStoredVersion() !== version) {
      isVisible.value = true
    }
  }
  
  return {
    close,
    version,
    isVisible,
    init
  }
}
