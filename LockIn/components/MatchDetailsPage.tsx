import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import { useRoute } from '@react-navigation/native'
import { Info, Participant } from '../types/riot/matchClass' // Ensure Participant type is exported from matchClass
import { useQuery } from '@tanstack/react-query'
import { getMatchInfo } from '../api/match'

const MatchDetailsPage: React.FC = () => {
  const route = useRoute()
  const { matchId } = route.params as { matchId: string }

  // Use the useMatchInfo hook to fetch match info
  const {
    data: matchInfo,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['matchInfo', matchId],
    queryFn: () => getMatchInfo(matchId),
    enabled: !!matchId,
  })

  // Handle loading state
  if (isLoading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    )
  }

  // Handle error state
  if (error) {
    console.log(error)
    return (
      <View>
        <Text>Error fetching match info: {error.message}</Text>
      </View>
    )
  }

  // If matchInfo is not available, handle that case
  if (!matchInfo) {
    return (
      <View>
        <Text>No match information found.</Text>
      </View>
    )
  }

  return <Text>Match Details Page</Text>
}

export default MatchDetailsPage
