import api from '../axios/useAxios'
import { handleError } from '../error/handleError'

export const answerDuo = async (answer: any, duoId: string) => {
  try {
    const response = await api.post(`api/duo/answerDuo?duoId=${duoId}`, answer)
    console.log('Response:', response.data)
    return response.data
  } catch (error) {
    handleError(error)
    throw error
  }
}
