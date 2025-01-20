import api from '../axios/useAxios'
import { handleError } from '../error/handleError'

interface Pageable {
  page?: number
  size?: number
  sort?: string
  direction?: 'ASC' | 'DESC'
}

export const getAnswersDuo = async (pageable: Pageable) => {
  try {
    const response = await api.get('api/duo/getAnswersDuo', {
      params: { ...pageable },
    })
    console.log('Response from getAnswersDuo:', response.data)
    return response.data
  } catch (error) {
    handleError(error)
    throw error
  }
}
