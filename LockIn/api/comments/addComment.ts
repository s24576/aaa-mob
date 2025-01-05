import api from '../axios/useAxios'
import { handleError } from '../error/handleError'

export const addComment = async (comment: any) => {
  try {
    const response = await api.post('/comments/addComment', comment, {
      // headers: {
      //   'Authorization': 'Bearer YOUR_AUTH_TOKEN', // Replace with actual token
      //   'Accept-Language': 'en-US', // Replace with actual locale if needed
      // },
    })
    return response.data
  } catch (error) {
    handleError(error)
    throw error
  }
}
