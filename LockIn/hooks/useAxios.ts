import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosHeaders,
} from 'axios'
import { useMemo } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'

const baseURL = 'http://localhost:8080/api'
const encryptionKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY as string // Should be 32 bytes for AES-256
const iv = randomBytes(16) // Initialization vector

// Encryption function using Node.js crypto module
const encryptToken = (token: string): string => {
  const cipher = createCipheriv(
    'aes-256-cbc',
    Buffer.from(encryptionKey, 'hex'),
    iv
  )
  let encrypted = cipher.update(token, 'utf-8', 'hex')
  encrypted += cipher.final('hex')
  return iv.toString('hex') + encrypted // Prepend IV to the encrypted string for decryption
}

// Decryption function using Node.js crypto module
const decryptToken = (encryptedToken: string): string => {
  const iv = Buffer.from(encryptedToken.slice(0, 32), 'hex') // Extract IV from the encrypted token
  const encrypted = encryptedToken.slice(32)
  const decipher = createDecipheriv(
    'aes-256-cbc',
    Buffer.from(encryptionKey, 'hex'),
    iv
  )
  let decrypted = decipher.update(encrypted, 'hex', 'utf-8')
  decrypted += decipher.final('utf-8')
  return decrypted
}

// Custom interface extending InternalAxiosRequestConfig to include _retry
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
          const encryptedToken = await AsyncStorage.getItem('token') // Get the encrypted token
          let savedToken: string | null = null

          if (encryptedToken) {
            savedToken = decryptToken(encryptedToken) // Decrypt the token
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
          error.response &&
          error.response.status === 403 &&
          originalRequest &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true

          try {
            const encryptedRefreshToken =
              await AsyncStorage.getItem('refreshToken')
            const refreshToken = encryptedRefreshToken
              ? decryptToken(encryptedRefreshToken)
              : null

            if (refreshToken) {
              const refreshTokenResponse = await axios.post(
                `${baseURL}/user/refreshToken`,
                {},
                {
                  headers: {
                    Authorization: `Bearer ${refreshToken}`,
                  },
                }
              )

              const newToken = refreshTokenResponse.data
              await AsyncStorage.setItem('token', newToken)

              const encryptedNewToken = encryptToken(newToken)
              await AsyncStorage.setItem('refreshToken', encryptedNewToken)

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
