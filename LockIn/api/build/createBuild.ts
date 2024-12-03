import api from '../axios/useAxios'
import { handleError } from '../error/handleError'

export const createBuild = async (build: object) => {
  try {
    const response = await api.post('/build/createBuild', build)
    return response.data
  } catch (error) {
    handleError(error)
    throw error
  }
}