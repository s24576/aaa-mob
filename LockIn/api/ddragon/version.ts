import api from '../axios/useAxios'
import { handleError } from '../error/handleError'

export const getVersion = async () => {
  try {
    const response = await api.get('ddragon/getVersion')
    return response.data
  } catch (error) {
    handleError(error)
    throw error
  }
}
