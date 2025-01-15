import api from '../axios/useAxios'
import { handleError } from '../error/handleError'

export const answerDuo = async (answer: any, duoId: string, locale: string) => {
  try {
    const response = await api.post('api/duo/answerDuo', {
      answer,
      duoId: String(duoId),
      locale: String(locale),
    })
    return response.data
  } catch (error) {
    handleError(error)
    throw error
  }
}
