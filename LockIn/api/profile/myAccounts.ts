import api from './../useAxios' // Importuj instancję axios
import axios from 'axios'

export const getMyAccounts = async () => {
  try {
    const response = await api.get(`/profile/myAccounts`)
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error)
    } else if (error instanceof Error) {
      console.error('Unexpected error:', error.message)
    } else {
      console.error('Unknown error:', error)
    }
    throw error
  }
}
