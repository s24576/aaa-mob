import api from '../axios/useAxios'
import { handleError } from '../error/handleError'

export const getFromFriendRequests = async () => {
  try {
    const response = await api.get('/profile/from')
    return response.data
  } catch (error) {
    handleError(error)
    throw error
  }
}
