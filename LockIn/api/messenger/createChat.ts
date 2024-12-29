import api from '../axios/useAxios'
import { handleError } from '../error/handleError'
import { Chat } from '../../types/messenger/Chat'

export const createChat = async (chat: Chat) => {
  try {
    const response = await api.post('/messenger/createChat', chat)
    return response.data
  } catch (error) {
    handleError(error)
    throw error
  }
}
