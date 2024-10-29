import { useQuery } from '@tanstack/react-query'
import { getMatchInfo } from '../api/match'

export const useMatchInfo = (matchId: string) => {
  return useQuery(['matchInfo', matchId], () => getMatchInfo(matchId), {
    enabled: !!matchId, // Only run query if matchId is provided
  })
}
