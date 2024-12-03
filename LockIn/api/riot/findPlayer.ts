import { Profile } from '../../types/riot/profileClass'
import { handleError } from '../error/handleError'
import api from '../axios/useAxios'

export const findPlayer = async (
  server: string,
  puuid?: string,
  tag?: string,
  name?: string
): Promise<Profile> => {
  try {
    let url = '/riot/findPlayer?'
    if (puuid) {
      url += `server=${server}&puuid=${puuid}`
    } else if (server && tag && name) {
      url += `server=${server}&tag=${tag}&name=${name}`
    } else {
      throw new Error('Invalid search parameters')
    }

    console.log('REQUEST URL:', url)
    const response = await api.get(url)
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
