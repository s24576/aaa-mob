import api from '../axios/useAxios'
import { handleError } from '../error/handleError'

const BACKEND_ADDRESS = process.env.BACKEND_ADDRESS

export const getUserData = async () => {
  try {
    const response = await api.get(`${BACKEND_ADDRESS}/user/getUserData`)
    // console.log(response.data)
    return {
      ...response.data,
      friends: response.data.friends || [], // Ensure friends is always an array
    }
  } catch (error) {
    handleError(error)
    throw error
  }
}
