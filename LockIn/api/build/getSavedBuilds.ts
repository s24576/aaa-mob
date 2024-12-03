import api from '../axios/useAxios'
import { handleError } from '../error/handleError'

export const getSavedBuilds = async (pageable?: object) => {
  try {
    const response = await api.get('/build/getSavedBuilds', {
      params: pageable,
    })
    return response.data
  } catch (error) {
    handleError(error)
    throw error
  }
}