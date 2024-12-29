import api from '../axios/useAxios'
import { handleError } from '../error/handleError'

export const getCourses = async () => {
  try {
    const response = await api.get('/course/getCourses')
    return response.data
  } catch (error) {
    handleError(error)
    throw error
  }
}
