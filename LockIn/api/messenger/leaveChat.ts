import api from '../axios/useAxios'
import { handleError } from '../error/handleError'
// nie moze byc na priv chat
export const leaveChat = async (chatId: string) => {
  try {
    const response = await api.delete(`/messenger/leaveChat?chatId=${chatId}`)
    return response.data
  } catch (error) {
    handleError(error)
    throw error
  }
}
