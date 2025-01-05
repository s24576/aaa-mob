import api from '../axios/useAxios'
import { handleError } from '../error/handleError'

export const getChats = async (page: number, size: number) => {
  try {
    const response = await api.get(
      `/messenger/getChats?page=${page}&size=${size}`
    )
    return response.data
  } catch (error) {
    handleError(error)
    throw error
  }
}
