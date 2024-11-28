import AsyncStorage from '@react-native-async-storage/async-storage'
import api from '../axios/useAxios'
import { handleError } from '../error/handleError'

export const addToWatchList = async (server_puuid: string) => {
  try {
    const token = await AsyncStorage.getItem('token')
    const response = await api.put('/profile/addWatchList', null, {
      params: { server_puuid },
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  } catch (error) {
    handleError(error)
    throw error
  }
}
