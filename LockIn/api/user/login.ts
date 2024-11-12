import AsyncStorage from '@react-native-async-storage/async-storage'
import { getUserData } from './getUserData'
import { handleError } from '../error/handleError'
import { UserData } from '../../types/local/userContext'
import axios from 'axios'
import { NavigationProp, ParamListBase } from '@react-navigation/native'

const BACKEND_ADDRESS = process.env.BACKEND_ADDRESS

export const handleLogin = async (
  username: string,
  password: string,
  setUserData: (userData: UserData) => void,
  navigation: NavigationProp<ParamListBase>
) => {
  try {
    console.log('Backend Address:', BACKEND_ADDRESS)
    const response = await axios.post(
      `${BACKEND_ADDRESS}/user/login`,
      { username, password },
      { headers: { 'Accept-Language': 'en' } }
    )

    const token: string = response.data
    console.log('Token:', token)

    await AsyncStorage.setItem('token', token)
    await getUserData(token, setUserData)

    navigation.navigate('Home')
  } catch (error) {
    handleError(error)
  }
}
