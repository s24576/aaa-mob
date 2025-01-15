import api from '../axios/useAxios'
import { handleError } from '../error/handleError'

export const saveDuo = async (duoId: string, locale: string) => {
  try {
    const response = await api.post('api/duo/saveDuo', { duoId, locale })
    return response.data
  } catch (error) {
    handleError(error)
    throw error
  }
}
