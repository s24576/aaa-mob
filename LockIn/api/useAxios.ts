import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import i18n from 'i18next'

const instance = axios.create({
  baseURL: process.env.BACKEND_ADDRESS,
})

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Jeśli błąd jest spowodowany wygasłym tokenem
    if (
      error.response &&
      error.response.status === 403 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true

      // Pobierz refresh token z AsyncStorage
      const refreshToken = await AsyncStorage.getItem('token')
      if (refreshToken) {
        console.log('Odśwież token:', refreshToken)
        try {
          // Wyślij żądanie do /user/refreshToken z poprawnym nagłówkiem
          const refreshResponse = await axios.post(
            `${process.env.BACKEND_ADDRESS}/user/refreshToken`,
            {},
            {
              headers: {
                Authorization: `Bearer ${refreshToken}`,
                'Accept-Language': i18n.language,
              },
            }
          )
          console.log('Refresh response:', refreshResponse.data)

          // Aktualizuj token w AsyncStorage
          const newAccessToken = refreshResponse.data
          await AsyncStorage.setItem('token', newAccessToken)

          // Zaktualizuj nagłówek autoryzacji i ponownie wyślij oryginalne żądanie
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
          return instance(originalRequest)
        } catch (refreshError) {
          // Jeśli odświeżenie tokena nie powiedzie się, można np. przenieść użytkownika do ekranu logowania
          console.error('Odświeżenie tokena nie powiodło się:', refreshError)
        }
      }
    }
    return Promise.reject(error)
  }
)

export default instance
