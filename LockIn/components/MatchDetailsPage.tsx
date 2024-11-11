import React from 'react'
import { View, Text, FlatList, Image } from 'react-native'
import { useRoute } from '@react-navigation/native'
import { Info, Participant } from '../types/riot/matchClass'
import { useQuery } from '@tanstack/react-query'
import { getMatchInfo } from '../api/riot/getMatchInfo'
import { getMyAccounts } from '../api/profile/getMyAccounts'
import { getVersion } from '../api/ddragon/version'

const MatchDetailsPage: React.FC = () => {
  const route = useRoute()
  const { matchId } = route.params as { matchId: string }

  const {
    data: myAccounts,
    isLoading: isMyAccountsLoading,
    error: myAccountsError,
  } = useQuery({
    queryKey: ['myAccounts'],
    queryFn: getMyAccounts,
  })

  const {
    data: matchInfo,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['matchInfo', matchId],
    queryFn: () => getMatchInfo(matchId),
    enabled: !!matchId,
  })

  const {
    data: version,
    isLoading: isVersionLoading,
    error: versionError,
  } = useQuery({
    queryKey: ['version'],
    queryFn: getVersion,
  })

  if (isLoading || isVersionLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg">Loading...</Text>
      </View>
    )
  }

  if (error || versionError) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg">
          Error fetching match info: {(error || versionError)?.message}
        </Text>
      </View>
    )
  }

  if (!matchInfo) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg">No match information found.</Text>
      </View>
    )
  }

  if (!Array.isArray(matchInfo.info.participants)) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg">Invalid match information format.</Text>
      </View>
    )
  }

  const team1 = matchInfo.info.participants.slice(0, 5)
  const team2 = matchInfo.info.participants.slice(5, 10)

  const renderParticipant = ({ item }: { item: Participant }) => (
    <View className="flex-row justify-between py-2 border-b border-gray-300">
      <Image
        source={{
          uri: `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${item.championName}.png`,
        }}
        style={{ width: 50, height: 50 }}
      />
      <Text className="flex-1 text-left"> {item.riotIdGameName}</Text>
      <Text className="flex-1 text-left">
        {item.kills}/{item.deaths}/{item.assists}
      </Text>
      <Text className="flex-1 text-left">
        Question Marks:{item.enemyMissingPings}
      </Text>
    </View>
  )

  return (
    <FlatList
      ListHeaderComponent={
        <View className="p-4">
          <Text className="text-2xl font-bold mb-4">Match Details</Text>
          <Text className="text-xl font-semibold mb-2">Team 1</Text>
        </View>
      }
      data={[...team1, { header: 'Team 2' }, ...team2]}
      keyExtractor={(item, index) =>
        item.participantId ? item.participantId.toString() : `header-${index}`
      }
      renderItem={({ item }) => {
        if (item.header) {
          return (
            <View className="p-4">
              <Text className="text-xl font-semibold mt-4 mb-2">
                {item.header}
              </Text>
            </View>
          )
        }
        return renderParticipant({ item })
      }}
    />
  )
}

export default MatchDetailsPage
