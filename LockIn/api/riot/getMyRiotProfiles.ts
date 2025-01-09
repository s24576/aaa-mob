import api from '../axios/useAxios'
import { handleError } from '../error/handleError'

export const getMyRiotProfiles = async () => {
  try {
    const response = await api.get(`/riot/getMyRiotProfiles`)
    console.log('My Riot profiles:', response.data)
    return response.data
  } catch (error) {
    handleError(error)
    throw error
  }
}
