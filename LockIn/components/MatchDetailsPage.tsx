import React from 'react'
import { View, Text, FlatList } from 'react-native'
import { useRoute } from '@react-navigation/native'
import { Info, Participant } from '../types/riot/matchClass' // Ensure Participant type is exported from matchClass
import { useQuery } from '@tanstack/react-query'
import { getMatchInfo } from '../api/match'
import { getMyAccounts } from '../api/profile/myAccounts'

const MatchDetailsPage: React.FC = () => {
  const route = useRoute()
  const { matchId } = route.params as { matchId: string }

  // Use the useQuery hook to fetch my accounts
  const {
    data: myAccounts,
    isLoading: isMyAccountsLoading,
    error: myAccountsError,
  } = useQuery({
    queryKey: ['myAccounts'],
    queryFn: getMyAccounts,
  })

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

  // Log the response data
  console.log('Match Info:', matchInfo)
  console.log('My Accounts:', myAccounts)

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

  return (
    <FlatList
      ListHeaderComponent={<Text>Match Details</Text>}
      data={matchInfo.participants}
      keyExtractor={(item) => item.participantId.toString()}
      renderItem={({ item }) => (
        <View>
          <Text>Participant: {item.participantId}</Text>
          <Text>Kills: {item.kills}</Text>
          <Text>Deaths: {item.deaths}</Text>
        </View>
      )}
    />
  )
}

export default MatchDetailsPage
