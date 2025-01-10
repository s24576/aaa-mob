import api from '../axios/useAxios'
import { handleError } from '../error/handleError'

export const getFilmById = async (filmId: string) => {
  try {
    const response = await api.get(`/api/course/getFilmById?filmId=${filmId}`)
    return response.data
  } catch (error) {
    handleError(error)
    throw error
  }
}
