import { Alert } from 'react-native'
import { Profile } from '../../types/riot/profileClass'
import { handleError } from '../error/handleError'
import api from '../axios/useAxios'

export const findPlayer = async (
  server: string,
  tag: string,
  name: string,
  setProfile: (profile: Profile) => void
) => {
  try {
    const response = await api.get(
      `/riot/findPlayer?server=${server}&tag=${tag}&name=${name}`
    )
    const data = response.data
    console.log(
      'RIOT URL:',
      `/riot/findPlayer?server=${server}&tag=${tag}&name=${name}`
    )
    console.log('Server Response:', data)

    const profileData = new Profile(data)
    setProfile(profileData)
  } catch (error) {
    console.error('Error fetching data:', error)
    handleError(error)
  }
}
