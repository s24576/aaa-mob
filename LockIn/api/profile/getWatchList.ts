import AsyncStorage from '@react-native-async-storage/async-storage'
import api from '../axios/useAxios'
import { handleError } from '../error/handleError'

export const getWatchList = async () => {
  try {
    const token = await AsyncStorage.getItem('token')
    const response = await api.get('/profile/getWatchList')
    return response.data
  } catch (error) {
    handleError(error)
    throw error
  }
}
