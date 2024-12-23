import api from '../axios/useAxios'
import { handleError } from '../error/handleError'

export const getResponses = async (commentId: string, pageable: any) => {
  try {
    const response = await api.get('/comments/getResponses', {
      params: {
        commentId,
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
