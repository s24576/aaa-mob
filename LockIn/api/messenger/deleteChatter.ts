import api from '../axios/useAxios'
import { handleError } from '../error/handleError'

export const deleteChatter = async (chatId: string, username: string) => {
  try {
    const response = await api.delete(`/messenger/deleteChatter?chatId=${chatId}&username=${username}`)
    console.log(response.data)
    return response.data
  } catch (error) {
    handleError(error)
    throw error
  }
}
