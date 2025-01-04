import api from '../axios/useAxios'
import { handleError } from '../error/handleError'
import { Chat, CreatePublicChat } from '../../types/messenger'

// utworz nowy chat z kilkoma chatterami
export const createChat = async (chat: Chat) => {
  try {
    const response = await api.post('/messenger/createChat', chat)
    return response.data
  } catch (error) {
    handleError(error)
    throw error
  }
}

export const createPublicChat = async (chat: CreatePublicChat) => {
  try {
    const response = await api.post('/messenger/createChat', chat)
    return response.data
  } catch (error) {
    handleError(error)
    throw error
  }
}
