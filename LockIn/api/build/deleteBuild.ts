import api from '../axios/useAxios'
import { handleError } from '../error/handleError'

export const deleteBuild = async (buildId: string) => {
  try {
    const response = await api.delete('/build/deleteBuild', {
      params: { buildId },
    })
    return response.data
  } catch (error) {
    handleError(error)
    throw error
  }
}