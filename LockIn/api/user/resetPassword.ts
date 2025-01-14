import api from '../axios/useAxios'
import axios from 'axios'
import i18n from 'i18next'

const BACKEND_ADDRESS = process.env.BACKEND_ADDRESS

export const handleResetPassword = async (
  email: string,
  setError: React.Dispatch<React.SetStateAction<string>>
) => {
  try {
    await api.put(
      `${BACKEND_ADDRESS}/user/resetPassword`,
      { email },
      { headers: { 'Accept-Language': i18n.language } }
    )
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
