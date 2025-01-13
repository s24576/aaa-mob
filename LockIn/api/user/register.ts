import api from '../axios/useAxios'
import { NavigationProp, ParamListBase } from '@react-navigation/native'
import axios from 'axios'

const BACKEND_ADDRESS = process.env.BACKEND_ADDRESS

export const handleRegister = async (
  email: string,
  username: string,
  password: string,
  confirmPassword: string,
  navigation: NavigationProp<ParamListBase>,
  setError: React.Dispatch<React.SetStateAction<string>>
) => {
  if (password !== confirmPassword) {
    setError('Passwords do not match')
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
