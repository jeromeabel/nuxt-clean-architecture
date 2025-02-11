export interface IVersionRepository {
  getCurrentVersion: () => string | undefined
  getStoredVersion: () => string | undefined
  storeVersion: (version: string) => void
  clear: () => void
}

export const createInMemoryVersionRepository = (initialVersion: string | undefined): IVersionRepository => {
  let store: string | undefined = undefined

  const getCurrentVersion = () => {
    console.log('initialVersion', initialVersion)
    return initialVersion
  }

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