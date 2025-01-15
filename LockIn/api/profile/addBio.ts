import api from '../axios/useAxios'
import { handleError } from '../error/handleError'

export const addBio = async (bio: string) => {
  try {
    const response = await api.post('/profile/addBio', { bio })
    return response.data
  } catch (error) {
    handleError(error)
    throw error
  }
}
