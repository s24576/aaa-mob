import api from '../axios/useAxios'
import { handleError } from '../error/handleError'

export const react = async (objectId: string, value: boolean) => {
  try {
    const response = await api.put('/comments/react', null, {
      params: {
        objectId,
        value,
      },
    })
    return response.data
  } catch (error) {
    handleError(error)
    throw error
  }
}
