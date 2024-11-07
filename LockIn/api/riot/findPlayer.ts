import { Alert } from 'react-native'
import { Profile } from '../../types/riot/profileClass'
import { handleError } from '../error/handleError'

export const findPlayer = async (
  server: string,
  tag: string,
  name: string,
  setProfile: (profile: Profile) => void
) => {
  const url = `${process.env.BACKEND_ADDRESS}/riot/findPlayer?server=${server}&tag=${tag}&name=${name}`
  try {
    const response = await fetch(url)
    const data = await response.json()
    console.log('RIOT URL:', url)
    console.log('Server Response:', data)
    Alert.alert('Server Response', JSON.stringify(data))

    const profileData = new Profile(data)
    setProfile(profileData)
  } catch (error) {
    console.error('Error fetching data:', error)
    handleError(error)
    Alert.alert('Error', 'Failed to fetch data from server')
  }
}
