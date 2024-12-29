import api from '../axios/useAxios'
import { handleError } from '../error/handleError'

export const getChats = async () => {
  try {
    const response = await api.get('/messenger/getChats')
    return response.data
  } catch (error) {
    handleError(error)
    throw error
  }
}
