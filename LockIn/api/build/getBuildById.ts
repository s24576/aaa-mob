import api from '../axios/useAxios'
import { handleError } from '../error/handleError'

export const getBuildById = async (buildId: string) => {
  try {
    const response = await api.get(`/build/getBuildById`, {
      params: { buildId },
    })
    console.log('Dane buildu:', response.data)
    return response.data
  } catch (error) {
    handleError(error)
    throw error
  }
}
