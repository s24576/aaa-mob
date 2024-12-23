import api from '../axios/useAxios'
import { handleError } from '../error/handleError'

export const findMessages = async (chatId: string, value: string) => {
  try {
    const response = await api.get(`/messenger/findMessages?chatId=${chatId}&value=${value}`)
    console.log(response.data)
    return response.data
  } catch (error) {
    handleError(error)
    throw error
  }
}
