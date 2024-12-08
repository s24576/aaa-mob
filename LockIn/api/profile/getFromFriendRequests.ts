import api from '../axios/useAxios'
import { handleError } from '../error/handleError'

export const getFromFriendRequests = async (pageable?: object) => {
  try {
    const response = await api.get('/profile/from', {
      params: pageable,
    })
    return response.data
  } catch (error) {
    handleError(error)
    throw error
  }
}
