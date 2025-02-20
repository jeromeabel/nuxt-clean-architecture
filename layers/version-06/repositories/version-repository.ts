export interface IVersionRepository {
  getCurrentVersion: () => string | undefined
  getStoredVersion: () => string | undefined
  storeVersion: (version: string) => void
  clear: () => void
}

export const createInMemoryVersionRepository = (initialVersion: string | undefined): IVersionRepository => {
  let store: string | undefined = undefined
  
  const getCurrentVersion = () => initialVersion
  
  const getStoredVersion = () => store

  const storeVersion = (version: string) => {
    store = version
  }

  const clear = () => {
    store = undefined
  }

  return {
    getCurrentVersion,
    getStoredVersion,
    storeVersion,
    clear,
  }
}

export const createLocalStorageVersionRepository = (): IVersionRepository => {

  const VERSION_KEY = 'app-version'
  
  const getCurrentVersion = () => {
    const version = useRuntimeConfig().public.version

    if (!version) {
      console.warn('[VersionRepository] No valid current version found in config.')
      return undefined
    }

    return version as string
  }

  const getStoredVersion = () => localStorage.getItem(VERSION_KEY) ?? undefined

  const storeVersion = (version: string) => {
    localStorage.setItem(VERSION_KEY, version)
  }

  const clear = () => {
    localStorage.removeItem(VERSION_KEY)
  }

  return {
    getCurrentVersion,
    getStoredVersion,
    storeVersion,
    clear,
  }
}