import api from '../axios/useAxios'
import { handleError } from '../error/handleError'

export const saveBuild = async (buildId: string, save: boolean) => {
  try {
    const response = await api.put('/build/saveBuild', null, {
      params: { buildId, save },
    })
    return response.data
  } catch (error) {
    handleError(error)
    throw error
  }
}