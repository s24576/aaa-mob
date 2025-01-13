import api from '../axios/useAxios'
import { handleError } from '../error/handleError'

export const getCourseById = async (courseId: string) => {
  try {
    const response = await api.get(
      `/api/course/getCourseById?courseId=${courseId}`
    )
    console.log(response.data)
    return response.data
  } catch (error) {
    handleError(error)
    throw error
  }
}
