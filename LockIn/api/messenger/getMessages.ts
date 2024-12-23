import api from '../axios/useAxios'
import { handleError } from '../error/handleError'

export const getMessages = async (chatId: string) => {
  try {
    const response = await api.get(`/messenger/getMessages?chatId=${chatId}`)
    console.log(response.data)
    return response.data
  } catch (error) {
    handleError(error)
    throw error
  }
}
