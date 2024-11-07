import axios from 'axios'
import { handleError } from '../error/handleError'

const BACKEND_ADDRESS = process.env.BACKEND_ADDRESS

export const handleRegister = async (
  username: string,
  password: string,
  confirmPassword: string,
  navigation: any
) => {
  if (password !== confirmPassword) {
    console.error('Passwords do not match')
    return
  }

  try {
    console.log('Backend Address:', BACKEND_ADDRESS)
    await axios.post(
      `${BACKEND_ADDRESS}/user/register`,
      { username, password },
      { headers: { 'Accept-Language': 'en' } }
    )

    navigation.navigate('Login')
  } catch (error) {
    handleError(error)
  }
}
