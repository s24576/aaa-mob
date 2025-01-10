import api from '../axios/useAxios'
import { handleError } from '../error/handleError'

export const saveCourse = async (courseId: string) => {
  try {
    const response = await api.put(
      `/api/course/saveCourse?courseId=${courseId}`
    )
    return response.data
  } catch (error) {
    handleError(error)
    throw error
  }
}
