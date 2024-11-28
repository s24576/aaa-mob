import api from '../axios/useAxios'
import { handleError } from '../error/handleError'

export const getWatchlistRiotProfiles = async () => {
  try {
    const response = await api.get('/getWatchlistRiotProfiles')
    return response.data
  } catch (error) {
    handleError(error)
    throw error
  }
}
