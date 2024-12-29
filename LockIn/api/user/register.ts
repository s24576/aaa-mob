import { handleError } from '../error/handleError'
import api from '../axios/useAxios'
import { NavigationProp, ParamListBase } from '@react-navigation/native'

const BACKEND_ADDRESS = process.env.BACKEND_ADDRESS

export const handleRegister = async (
  email: string,
  username: string,
  password: string,
  confirmPassword: string,
  navigation: NavigationProp<ParamListBase>
) => {
  if (password !== confirmPassword) {
    console.error('Passwords do not match')
    return
  }

  try {
    await api.post(
      `${BACKEND_ADDRESS}/user/register`,
      { email, username, password },
      { headers: { 'Accept-Language': 'en' } }
    )

    navigation.navigate('Login')
  } catch (error) {
    handleError(error)
  }
}
