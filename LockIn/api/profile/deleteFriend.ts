import api from '../axios/useAxios'
import { handleError } from '../error/handleError'

export const deleteFriend = async (friendId: string) => {
  try {
    const response = await api.delete('/profile/deleteFriend', {
      params: { friendId },
    })
    return response.data
  } catch (error) {
    handleError(error)
    throw error
  }
}
