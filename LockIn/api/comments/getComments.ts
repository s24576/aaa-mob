import api from '../axios/useAxios'
import { handleError } from '../error/handleError'

export const getComments = async (objectId: string, pageable: any) => {
  try {
    const response = await api.get('/comments/getComments', {
      params: {
        objectId,
        ...pageable
      }
    })
    console.log(response.data)
    return response.data
  } catch (error) {
    handleError(error)
    throw error
  }
}
