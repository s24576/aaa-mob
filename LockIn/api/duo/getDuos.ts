import api from '../axios/useAxios'
import { handleError } from '../error/handleError'

interface SearchDuo {
  minRank?: string
  maxRank?: string
  positions?: string[]
  champions?: string[]
  languages?: string[]
}

interface Pageable {
  page?: number
  size?: number
  sort?: string
  direction?: 'ASC' | 'DESC'
}

export const getDuos = async (
  searchDuo: SearchDuo = {},
  pageable: Pageable = {}
) => {
  try {
    console.log('Wysłane zapytanie:', searchDuo)
    const response = await api.post('api/duo/getDuos', searchDuo, {
      params: pageable,
    })
    console.log('Otrzymane duo:', response.data)
    return response.data
  } catch (error) {
    handleError(error)
    throw error
  }
}
