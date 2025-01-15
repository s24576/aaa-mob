import api from '../axios/useAxios'
import { handleError } from '../error/handleError'

interface Pageable {
  size?: number
  sort?: string
  direction?: 'ASC' | 'DESC'
}

export const getAnswersDuo = async (
  duoId: string,
  pageable: Pageable,
  locale: string
) => {
  try {
    const response = await api.get('api/duo/getAnswersDuo', {
      params: { duoId, ...pageable, locale },
    })
    return response.data
  } catch (error) {
    handleError(error)
    throw error
  }
}
