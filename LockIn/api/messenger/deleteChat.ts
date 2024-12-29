import api from '../axios/useAxios'
import { handleError } from '../error/handleError'

export const deleteChat = async (chatId: string) => {
  try {
    const response = await api.delete(`/messenger/deleteChat?chatId=${chatId}`)
    return response.data
  } catch (error) {
    handleError(error)
    throw error
  }
}