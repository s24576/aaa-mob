import api from '../axios/useAxios'
import { handleError } from '../error/handleError'

export const manageMyAccount = async (server_puuid: string) => {
  try {
    const response = await api.put('/profile/manageMyAccount', null, {
      params: { server_puuid },
    })
    return response.data
  } catch (error) {
    handleError(error)
    throw error
  }
}
