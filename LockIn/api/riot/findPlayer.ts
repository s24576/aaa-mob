import { Profile } from '../../types/riot/profileClass'
import { handleError } from '../error/handleError'
import api from '../axios/useAxios'

export const findPlayer = async (
  server: string,
  tag: string,
  name: string
): Promise<Profile> => {
  try {
    const response = await api.get(
      `/riot/findPlayer?server=${server}&tag=${tag}&name=${name}`
    )
    const data = response.data
    const profileData = new Profile(data)
    console.log('Profile Data:', profileData)
    return profileData
  } catch (error) {
    console.error('Error fetching data:', error)
    handleError(error)
    throw error
  }
}
