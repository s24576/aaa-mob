import api from '../axios/useAxios'
import { handleError } from '../error/handleError'

export const saveCourse = async (courseId: string) => {
  try {
    const response = await api.put(`/course/saveCourse?courseId=${courseId}`)
    console.log(response.data)
    return response.data
  } catch (error) {
    handleError(error)
    throw error
  }
}
