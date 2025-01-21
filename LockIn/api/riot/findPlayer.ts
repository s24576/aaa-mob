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
      url += `server=${encodeURIComponent(server)}&puuid=${encodeURIComponent(puuid)}`
    } else if (server && tag && name) {
      url += `server=${encodeURIComponent(server)}&tag=${encodeURIComponent(tag)}&name=${encodeURIComponent(name)}`
    } else {
      throw new Error('Invalid search parameters')
    }

    const response = await api.get(url)
    // console.log('Fetched profile data:', response)
    const data = response.data
    const profileData = new Profile(data)

    console.log('Fetched profile data:', profileData)

    return profileData
  } catch (error) {
    console.error('Error fetching data:', error)
    handleError(error)
    throw error
  }
}
