import api from '../axios/useAxios'
import { handleError } from '../error/handleError'

export const getToFriendRequests = async () => {
  try {
    const response = await api.get('/profile/to')
    return response.data
  } catch (error) {
    handleError(error)
    throw error
  }
}
