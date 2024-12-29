import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import i18n from 'i18next'
import { handleError } from '../error/handleError'

const instance = axios.create({
  baseURL: process.env.BACKEND_ADDRESS,
})

instance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token')
    console.log('Token:', token)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    config.headers['Accept-Language'] = i18n.language
    return config
  },
  (error) => Promise.reject(error)
)

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (
      error.response &&
      error.response.status === 403 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true

      const refreshToken = await AsyncStorage.getItem('token')
      if (refreshToken) {
        // console.log('Odśwież token:', refreshToken)
        try {
          const refreshResponse = await axios.post(
            `${process.env.BACKEND_ADDRESS}/user/refreshToken`,
            {},
            {
              headers: {
                Authorization: `Bearer ${refreshToken}`,
              },
            }
          )
          const newToken = refreshResponse.data
          await AsyncStorage.setItem('token', newToken)
          console.log('Nowy token:', newToken)
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          return axios(originalRequest)
        } catch (refreshError) {
          handleError(refreshError)
          return Promise.reject(refreshError)
        }
      }
    }

    handleError(error)
    return Promise.reject(error)
  }
)

export default instance
