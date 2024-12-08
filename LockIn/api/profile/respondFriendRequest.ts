import api from '../axios/useAxios'
import { handleError } from '../error/handleError'

export const respondFriendRequest = async (response: object) => {
  try {
    const res = await api.post('/profile/respondFriendRequest', response)
    return res.data
  } catch (error) {
    handleError(error)
    throw error
  }
}
