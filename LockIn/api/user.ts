import useAxios from './useAxios'

export const getUserData = async () => {
  const response = await useAxios.get('/user/getUserData')
  return response.data
}
