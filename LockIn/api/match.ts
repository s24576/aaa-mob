import useAxios from './useAxios'
import axios from 'axios'

export const getMatchInfo = async (matchId: string) => {
  const api = useAxios()
  try {
    const response = await api.get(
      process.env.BACKEND_ADDRESS + `/riot/getMatchInfo?matchId=${matchId}`
    )
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error)
    } else if (error instanceof Error) {
      console.error('Unexpected error:', error.message)
    } else {
      console.error('Unknown error:', error)
    }
    throw error // Re-throw the error after logging it
  }
}
