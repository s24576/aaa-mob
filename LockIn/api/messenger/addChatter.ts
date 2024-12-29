import api from '../axios/useAxios'
import { handleError } from '../error/handleError'

export const addChatter = async (chatId: string, username: string) => {
  try {
    const response = await api.post(
      `/messenger/addChatter?chatId=${chatId}&username=${username}`
    )
    return response.data
  } catch (error) {
    handleError(error)
    throw error
  }
}
