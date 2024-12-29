import api from '../axios/useAxios'
import { handleError } from '../error/handleError'

export const getBuildById = async (buildId: string) => {
  try {
    const response = await api.get(`/build/getBuildById`, {
      params: { buildId },
    })
    return response.data
  } catch (error) {
    handleError(error)
    throw error
  }
}
