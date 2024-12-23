import api from '../axios/useAxios'
import { handleError } from '../error/handleError'

export const leaveChat = async (chatId: string) => {
  try {
    const response = await api.delete(`/messenger/leaveChat?chatId=${chatId}`)
    console.log(response.data)
    return response.data
  } catch (error) {
    handleError(error)
    throw error
  }
}
