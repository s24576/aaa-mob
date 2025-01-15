import api from '../axios/useAxios'
import { handleError } from '../error/handleError'

export const respondAnswerDuo = async (
  answerId: string,
  action: boolean,
  duoId: string
) => {
  try {
    const response = await api.post('api/duo/respondAnswerDuo', {
      answerId: String(answerId),
      action: Boolean(action),
      duoId: String(duoId),
    })
    return response.data
  } catch (error) {
    handleError(error)
    throw error
  }
}
