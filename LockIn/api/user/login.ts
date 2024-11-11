import AsyncStorage from '@react-native-async-storage/async-storage'
import { encryptToken } from '../../security/TokenEncryption'
import { decryptToken } from '../../security/TokenDecryption'
import { getUserData } from './getUserData'
import { handleError } from '../error/handleError'
import { UserData } from '../../types/local/userContext'
import api from '../axios/useAxios'
import axios from 'axios'

const BACKEND_ADDRESS = process.env.BACKEND_ADDRESS

export const handleLogin = async (
  username: string,
  password: string,
  setUserData: (userData: UserData) => void,
  navigation: any
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

    const encryptedToken = await encryptToken(token)
    await AsyncStorage.setItem('token', token)
    console.log('Encrypted Token:', encryptedToken)
    const decryptedToken = await decryptToken(encryptedToken)
    console.log('Decrypted Token:', decryptedToken)
    console.log('AsyncStorage Token:', await AsyncStorage.getItem('token'))

    await getUserData(token, setUserData)

    navigation.navigate('Home')
  } catch (error) {
    handleError(error)
  }
}
