import api from '../axios/useAxios'
import { handleError } from '../error/handleError'

export const sendFriendRequest = async (friendRequest: object) => {
  try {
    const response = await api.post('/profile/sendFriendRequest', friendRequest)
    return response.data
  } catch (error) {
    handleError(error)
    throw error
  }
}
