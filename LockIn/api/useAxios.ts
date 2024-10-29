import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosHeaders,
} from 'axios'
import { useMemo } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Crypto from 'expo-crypto'

const baseURL = process.env.BACKEND_URL + '/api'
const encryptionKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY as string

// Encryption and decryption functions remain the same
const uint8ArrayToHex = (arr: Uint8Array): string => {
  return Array.from(arr)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

const encryptToken = async (token: string): Promise<string> => {
  const iv = Crypto.getRandomBytes(16)
  const combinedString = encryptionKey + token + uint8ArrayToHex(iv)

  const encryptedToken = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    combinedString
  )

  return uint8ArrayToHex(iv) + encryptedToken
}

const decryptToken = async (encryptedToken: string): Promise<string> => {
  const iv = encryptedToken.slice(0, 32)
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
    const instance = axios.create({ baseURL })

    // Request Interceptor
    instance.interceptors.request.use(
      async (config: CustomAxiosRequestConfig) => {
        if (config && !config.headers?.Authorization) {
          const encryptedToken = await AsyncStorage.getItem('token')
          const savedToken = encryptedToken
            ? await decryptToken(encryptedToken)
            : null

          if (savedToken) {
            config.headers = config.headers || new AxiosHeaders()
            config.headers.set('Authorization', `Bearer ${savedToken}`)
          }
        }

        return config
      },
      (error: AxiosError) => Promise.reject(error)
    )

    // Response Interceptor
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
              const refreshTokenResponse = await instance.post(
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
