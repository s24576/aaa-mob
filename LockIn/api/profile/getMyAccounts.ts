import api from '../axios/useAxios'
import { handleError } from '../error/handleError'

export const getMyAccounts = async () => {
  try {
    const response = await api.get(`/profile/myAccounts`)
    return response.data
  } catch (error) {
    handleError(error)
    throw error
  }
}
