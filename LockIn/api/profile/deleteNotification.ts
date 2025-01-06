import api from '../axios/useAxios'
import { handleError } from '../error/handleError'

export const deleteNotification = async (notificationId: string) => {
  try {
    const response = await api.delete('/profile/deleteNotification', {
      params: { notificationId },
    })
    console.log('Notification deleted:', response.data)
    return response.data
  } catch (error) {
    handleError(error)
    throw error
  }
}
