import api from '../axios/useAxios'
import { handleError } from '../error/handleError'

export const findProfile = async (username: string) => {
  try {
    const response = await api.get('/profile/findProfile', {
      params: { username },
    })
    return response.data
  } catch (error) {
    handleError(error)
    throw error
  }
}
