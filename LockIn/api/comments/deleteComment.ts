import api from '../axios/useAxios'
import { handleError } from '../error/handleError'

export const deleteComment = async (commentId: string) => {
  try {
    const response = await api.delete('/comments/deleteComment', {
      params: {
        commentId,
      },
    })
    return response.data
  } catch (error) {
    handleError(error)
    throw error
  }
}
