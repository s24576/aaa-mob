import api from '../axios/useAxios'
import { handleError } from '../error/handleError'

interface CreateDuo {
  puuid: string
  positions: string[]
  lookedPositions: string[]
  minRank: string
  maxRank: string
  languages: string[]
  championIds: string[]
}

export const createDuo = async (duo: CreateDuo) => {
  try {
    const response = await api.post('api/duo/createDuo', duo, {})
    console.log('Created duo:', response.data)
    return response.data
  } catch (error) {
    handleError(error)
    throw error
  }
}
