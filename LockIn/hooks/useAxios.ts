import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosHeaders,
} from 'axios'
import { useMemo } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Crypto from 'expo-crypto'

const baseURL = 'http://localhost:8080/api'
const encryptionKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY as string // Klucz 32-bajtowy dla AES-256

// Funkcja do konwersji tablicy bajtów na ciąg hex
const uint8ArrayToHex = (arr: Uint8Array): string => {
  return Array.from(arr)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

// Funkcja szyfrowania
const encryptToken = async (token: string): Promise<string> => {
  const iv = Crypto.getRandomBytes(16) // Wektor inicjalizujący

  // Łączenie klucza szyfrowania, tokenu i IV w celu stworzenia skrótu
  const combinedString = encryptionKey + token + uint8ArrayToHex(iv)

  const encryptedToken = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    combinedString
  )

  return uint8ArrayToHex(iv) + encryptedToken // Dodaj IV do zaszyfrowanego tokenu
}

// Funkcja deszyfrowania
const decryptToken = async (encryptedToken: string): Promise<string> => {
  const iv = encryptedToken.slice(0, 32) // Pobierz IV
  const encrypted = encryptedToken.slice(32)

  const decryptedToken = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    encryptionKey + encrypted + iv
  )

  return decryptedToken
}

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

const useAxios = (): AxiosInstance => {
  const axiosInstance = useMemo((): AxiosInstance => {
    const instance = axios.create({
      baseURL: baseURL,
    })

    instance.interceptors.request.use(
      async (
        config: CustomAxiosRequestConfig
      ): Promise<CustomAxiosRequestConfig> => {
        if (config && !config.headers?.Authorization) {
          const encryptedToken = await AsyncStorage.getItem('token')
          let savedToken: string | null = null

          if (encryptedToken) {
            savedToken = await decryptToken(encryptedToken)
          }

          if (savedToken) {
            config.headers = config.headers || new AxiosHeaders()
            config.headers.set('Authorization', `Bearer ${savedToken}`)
          }
        }

        return config
      },
      (error: AxiosError) => Promise.reject(error)
    )

    instance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as CustomAxiosRequestConfig

        if (
          error.response?.status === 403 &&
          originalRequest &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true

          try {
            const encryptedRefreshToken =
              await AsyncStorage.getItem('refreshToken')
            const refreshToken = encryptedRefreshToken
              ? await decryptToken(encryptedRefreshToken)
              : null

            if (refreshToken) {
              const refreshTokenResponse = await axios.post(
                `${baseURL}/user/refreshToken`,
                {},
                {
                  headers: { Authorization: `Bearer ${refreshToken}` },
                }
              )

              const newToken = refreshTokenResponse.data
              const encryptedNewToken = await encryptToken(newToken)

              await AsyncStorage.setItem('token', encryptedNewToken)

              if (originalRequest.headers) {
                originalRequest.headers.set(
                  'Authorization',
                  `Bearer ${newToken}`
                )
              }

              return instance(originalRequest)
            }
          } catch (refreshError) {
            return Promise.reject(refreshError)
          }
        }

        return Promise.reject(error)
      }
    )

    return instance
  }, [])

  return axiosInstance
}

export default useAxios
