import api from '../axios/useAxios'
import { handleError } from '../error/handleError'

const BACKEND_ADDRESS = process.env.BACKEND_ADDRESS

export const getUserData = async () => {
  try {
    const response = await api.get(`${BACKEND_ADDRESS}/user/getUserData`)
    return {
      ...response.data,
      friends: response.data.friends || [],
    }
  } catch (error) {
    handleError(error)
    throw error
  }
}
