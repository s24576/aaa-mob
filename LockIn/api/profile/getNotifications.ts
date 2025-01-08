import api from '../axios/useAxios'
import { handleError } from '../error/handleError'

export const getNotifications = async (page: number, size: number) => {
  try {
    const response = await api.get('/profile/getNotifications', {
      params: { page, size },
    })
    console.log('Notifications fetched:', response.data)
    return response.data
  } catch (error) {
    handleError(error)
    throw error
  }
}
