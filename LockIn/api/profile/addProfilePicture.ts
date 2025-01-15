import api from '../axios/useAxios'
import { handleError } from '../error/handleError'

export const addProfilePicture = async (image: File) => {
  const formData = new FormData()
  formData.append('image', image)

  try {
    const response = await api.post('/profile/addProfilePicture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  } catch (error) {
    handleError(error)
    throw error
  }
}
