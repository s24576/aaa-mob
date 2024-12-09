import api from '../axios/useAxios'
import { handleError } from '../error/handleError'

export const sendFriendRequest = async (username: string) => {
  try {
    const response = await api.post('/profile/sendFriendRequest', { to: username }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return response.data
  } catch (error) {
    handleError(error)
    throw error
  }
}
