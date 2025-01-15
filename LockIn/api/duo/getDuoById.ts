import api from '../axios/useAxios'
import { handleError } from '../error/handleError'

export const getDuoById = async (duoId: string, locale: string) => {
  try {
    const response = await api.get('api/duo/getDuoById', {
      params: { duoId: String(duoId), locale: String(locale) },
    })
    return response.data
  } catch (error) {
    handleError(error)
    throw error
  }
}
