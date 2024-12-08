import api from '../axios/useAxios'
import { handleError } from '../error/handleError'

export const getToFriendRequests = async (pageable?: object) => {
  try {
    const response = await api.get('/profile/to', {
      params: pageable,
    })
    return response.data
  } catch (error) {
    handleError(error)
    throw error
  }
}
