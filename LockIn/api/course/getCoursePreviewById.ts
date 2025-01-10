import api from '../axios/useAxios'
import { handleError } from '../error/handleError'

export const getCoursePreviewById = async (courseId: string) => {
  try {
    const response = await api.get(
      `/api/course/getCoursePreviewById?courseId=${courseId}`
    )
    return response.data
  } catch (error) {
    handleError(error)
    throw error
  }
}
