import api from '../axios/useAxios'
import { handleError } from '../error/handleError'

export const getMyBuilds = async (locale?: string, pageable?: object) => {
  try {
    const response = await api.get('/build/getMyBuilds', {
      params: pageable,
    })
    return response.data
  } catch (error) {
    handleError(error)
    throw error
  }
}