import api from '../axios/useAxios'
import { handleError } from '../error/handleError'

const BACKEND_ADDRESS = process.env.BACKEND_ADDRESS

export const getUserData = async (token: string) => {
  try {
    const response = await api.get(`${BACKEND_ADDRESS}/user/getUserData`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Accept-Language': 'en',
      },
    })
    return response.data
  } catch (error) {
    handleError(error)
    throw error
  }
}
