import api from '../axios/useAxios'
import { handleError } from '../error/handleError'
import { MessageProp } from '../../types/messenger/MessageProp'

export const sendMessage = async (chatId: string, message: MessageProp) => {
  try {
    const response = await api.post(
      `/messenger/sendMessage?chatId=${chatId}`,
      message
    )
    return response.data
  } catch (error) {
    handleError(error)
    throw error
  }
}
