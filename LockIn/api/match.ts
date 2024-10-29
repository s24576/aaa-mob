import api from './useAxios' // Importuj instancję axios
import axios from 'axios'

export const getMatchInfo = async (matchId: string) => {
  try {
    const response = await api.get(`/riot/getMatchInfo?matchId=${matchId}`)
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error)
    } else if (error instanceof Error) {
      console.error('Unexpected error:', error.message)
    } else {
      console.error('Unknown error:', error)
    }
    throw error // Rzuć wyjątek ponownie po zalogowaniu
  }
}
