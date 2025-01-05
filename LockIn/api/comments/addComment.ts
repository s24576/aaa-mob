import api from '../axios/useAxios'
import { handleError } from '../error/handleError'

export const addComment = async (comment: any) => {
  try {
    const response = await api.post('/comments/addComment', comment, {})
    return response.data
  } catch (error) {
    handleError(error)
    throw error
  }
}

export const addReply = async (commentId: string, reply: any) => {
  try {
    const response = await api.post(
      '/comments/addComment',
      { ...reply, replyingTo: commentId },
      {}
    )
    return response.data
  } catch (error) {
    handleError(error)
    throw error
  }
}
