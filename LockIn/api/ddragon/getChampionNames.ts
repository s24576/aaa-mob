import api from '../axios/useAxios'
import { handleError } from '../error/handleError'

export const getChampionNames = async () => {
  try {
    const response = await api.get('ddragon/getChampionNames')
    return response.data
  } catch (error) {
    handleError(error)
    throw error
  }
}
