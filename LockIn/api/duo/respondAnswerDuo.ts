import api from '../axios/useAxios'
import { handleError } from '../error/handleError'

export const respondAnswerDuo = async (answerId: string, action: boolean) => {
  try {
    const response = await api.post(
      `api/duo/respondAnswerDuo?answerId=${answerId}&action=${action}`
    )
    console.log('Response:', response.data)
    return response.data
  } catch (error) {
    handleError(error)
    throw error
  }
}
