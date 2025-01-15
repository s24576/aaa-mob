import api from '../axios/useAxios'
import { handleError } from '../error/handleError'

export const respondAnswerDuo = async (
  answerId: string,
  action: boolean,
  locale: string
) => {
  try {
    const response = await api.post('api/duo/respondAnswerDuo', {
      answerId,
      action,
      locale,
    })
    return response.data
  } catch (error) {
    handleError(error)
    throw error
  }
}
