import api from '../axios/useAxios'
import { handleError } from '../error/handleError'

export const getMatchInfo = async (matchId: string) => {
  try {
    const response = await api.get(`/riot/getMatchInfo?matchId=${matchId}`)
    return response.data
  } catch (error) {
    handleError(error)
    throw error
  }
}
