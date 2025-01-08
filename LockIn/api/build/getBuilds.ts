import api from '../axios/useAxios'
import { handleError } from '../error/handleError'

export const getBuilds = async (
  author?: string,
  championId?: string,
  pageable?: object
) => {
  try {
    const requestConfig = {
      params: { author, championId, size: 40, ...pageable },
    }
    console.log('Request config:', requestConfig)
    const response = await api.get('/build/getBuilds', requestConfig)
    console.log('Dane buildów:', response.data)
    return response.data
  } catch (error) {
    handleError(error)
    throw error
  }
}
