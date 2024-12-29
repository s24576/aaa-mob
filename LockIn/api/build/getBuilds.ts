import api from '../axios/useAxios'
import { handleError } from '../error/handleError'

export const getBuilds = async (author?: string, pageable?: object) => {
  try {
    const response = await api.get('/build/getBuilds', {
      params: { author, size: 40, ...pageable },
    })
    console.log('Dane buildu:', response.data)
    return response.data
  } catch (error) {
    handleError(error)
    throw error
  }
}
