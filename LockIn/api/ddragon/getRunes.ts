import api from '../axios/useAxios'
import { handleError } from '../error/handleError'

export const getRunes = async () => {
  try {
    const response = await api.get('ddragon/getRunes')
    return response.data
  } catch (error) {
    handleError(error)
    throw error
  }
}
