import api from '../axios/useAxios'
import { handleError } from '../error/handleError'

export const addComment = async (comment: any) => {
  try {
    const response = await api.post('/comments/addComment', comment)
    console.log(response.data)
    return response.data
  } catch (error) {
    handleError(error)
    throw error
  }
}
