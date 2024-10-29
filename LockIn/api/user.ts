import useAxios from './useAxios'

export const getUserData = async () => {
  const axiosInstance = useAxios() // Invoke useAxios to get the Axios instance
  const response = await axiosInstance.get('/user/getUserData')
  return response.data
}
