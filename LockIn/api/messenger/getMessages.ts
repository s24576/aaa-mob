import api from '../axios/useAxios'
import { handleError } from '../error/handleError'

export const getMessages = async (
  chatId: string,
  page: number,
  size: number
) => {
  try {
    const response = await api.get(
      `/messenger/getMessages?chatId=${chatId}&page=${page}&size=${size}`
    )
    return response.data
  } catch (error) {
    handleError(error)
    throw error
  }
}
