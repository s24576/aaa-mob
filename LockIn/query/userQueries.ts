import { useQuery } from '@tanstack/react-query'
import { getUserData } from '../api/user'

export const useUserData = () => {
  return useQuery({
    queryKey: ['userData'],
    queryFn: getUserData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
