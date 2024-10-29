import useAxios from './useAxios'

export const getMatchInfo = async (matchId: string) => {
  const response = await useAxios.get(`/match/getMatchInfo/${matchId}`)
  return response.data
}
