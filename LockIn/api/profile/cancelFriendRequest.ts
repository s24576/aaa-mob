import api from '../axios/useAxios'
import { handleError } from '../error/handleError'

export const cancelFriendRequest = async (requestId: string) => {
  try {
    const response = await api.delete('/profile/cancelFriendRequest', {
      params: { requestId },
    })
    return response.data
  } catch (error) {
    handleError(error)
    throw error
  }
}
