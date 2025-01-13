import AsyncStorage from '@react-native-async-storage/async-storage'
import { getUserData } from './getUserData'
import { UserData } from '../../types/local/userContext'
import axios from 'axios'
import { NavigationProp, ParamListBase } from '@react-navigation/native'

const BACKEND_ADDRESS = process.env.BACKEND_ADDRESS

export const handleLogin = async (
  username: string,
  password: string,
  setUserData: (userData: UserData) => void,
  navigation: NavigationProp<ParamListBase>,
  setError: React.Dispatch<React.SetStateAction<string>>
) => {
  try {
    const response = await axios.post(
      `${BACKEND_ADDRESS}/user/login`,
      { username, password },
      { headers: { 'Accept-Language': 'en' } }
    )

    const token: string = response.data

    await AsyncStorage.setItem('token', token)
    const userData = await getUserData()
    setUserData(userData)

    navigation.navigate('Home')
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        setError(`${error.response.data}`)
      } else if (error.request) {
        setError('No response from server')
      } else {
        setError(`Axios error: ${error.message}`)
      }
    } else if (error instanceof Error) {
      setError(`Unexpected error: ${error.message}`)
    } else {
      setError('Unknown error occurred')
    }
  }
}
