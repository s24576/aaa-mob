import api from '../axios/useAxios'
import { handleError } from '../error/handleError'

export const getFilmById = async (filmId: string) => {
  try {
    const response = await api.get(`/course/getFilmById?filmId=${filmId}`)
    console.log(response.data)
    return response.data
  } catch (error) {
    handleError(error)
    throw error
  }
}
