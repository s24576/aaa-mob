import React from 'react'
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native'
import { useRoute, useNavigation } from '@react-navigation/native'
import { Participant } from '../types/riot/matchClass'
import { useQuery } from '@tanstack/react-query'
import { getMatchInfo } from '../api/riot/getMatchInfo'
import { getVersion } from '../api/ddragon/version'
import { ProfileScreenProps } from '../App'

const MatchDetailsPage: React.FC = () => {
  const route = useRoute()
  const navigation = useNavigation<ProfileScreenProps['navigation']>()
  const { matchId } = route.params as { matchId: string }

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

  const handleParticipantPress = (server: string, puuid: string) => {
    navigation.navigate('RiotProfile', { server, puuid })
  }

  const renderParticipant = ({ item }: { item: Participant }) => (
    <TouchableOpacity
      onPress={() => handleParticipantPress('EUW1', item.puuid)}
    >
      <View className="flex-row justify-between py-2 border-b border-gray-300">
        <Image
          source={{
            uri: `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${item.championName}.png`,
          }}
          style={{ width: 50, height: 50 }}
        />
        <Text className="text-bialas flex-1 text-left">
          {item.riotIdGameName}
        </Text>
        <Text className="text-bialas flex-1 text-left">
          {item.kills}/{item.deaths}/{item.assists}
        </Text>
        <Text className="text-bialas flex-1 text-left">
          Rank: {item.tier} {item.rank}
        </Text>
        <View className="flex-1 flex-row items-center">
          <Image
            source={{
              uri: `https://ddragon.leagueoflegends.com/cdn/${version}/img/spell/${item.summoner1Name}.png`,
            }}
            style={{ width: 24, height: 24, marginRight: 4 }}
          />
          <Image
            source={{
              uri: `https://ddragon.leagueoflegends.com/cdn/${version}/img/spell/${item.summoner2Name}.png`,
            }}
            style={{ width: 24, height: 24 }}
          />
        </View>
      </View>
    </TouchableOpacity>
  )

  if (isLoading) {
    return (
      <View className="bg-wegielek">
        <ActivityIndicator size="large" color="#F5B800" />
      </View>
    )
  }

  if (error || versionError) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-bialas text-lg">
          Error fetching match info: {(error || versionError)?.message}
        </Text>
      </View>
    )
  }

  if (!matchInfo) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-bialas text-lg">No match information found.</Text>
      </View>
    )
  }

  if (!Array.isArray(matchInfo.info.participants)) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-bialas text-lg">
          Invalid match information format.
        </Text>
      </View>
    )
  }

  const team1 = matchInfo.info.participants.slice(0, 5)
  const team2 = matchInfo.info.participants.slice(5, 10)

  return (
    <FlatList
      ListHeaderComponent={
        <View className="p-4">
          <View style={styles.header}>
            <Text className="text-bialas text-2xl font-bold mb-4">
              {new Date(
                Number(matchInfo.info.gameCreation)
              ).toLocaleDateString()}
            </Text>
            <Text className="text-bialas text-lg mb-4">
              {matchInfo.info.queueType}
            </Text>
          </View>
          {/* Informacje drużynowe */}
          <Text className="text-bialas text-xl font-semibold mb-2 text-center">
            Team 1
          </Text>
          <View className="mb-4 flex-row justify-center">
            <Text className="text-bialas mx-2">
              Baron: {matchInfo.info.teams[0].objectives.baron.kills}
            </Text>
            <Text className="text-bialas mx-2">
              Dragons: {matchInfo.info.teams[0].objectives.dragon.kills}
            </Text>
            <Text className="text-bialas mx-2">
              Herald: {matchInfo.info.teams[0].objectives.riftHerald.kills}
            </Text>
            <Text className="text-bialas mx-2">
              Towers: {matchInfo.info.teams[0].objectives.tower.kills}
            </Text>
          </View>
        </View>
      }
      data={team1}
      keyExtractor={(item) => item.participantId.toString()}
      renderItem={renderParticipant}
      ListFooterComponent={
        <>
          <Text className="text-bialas text-xl font-semibold mb-2 text-center">
            Team 2
          </Text>
          <View className="mb-4 flex-row justify-center">
            <Text className="text-bialas mx-2">
              Baron: {matchInfo.info.teams[1].objectives.baron.kills}
            </Text>
            <Text className="text-bialas mx-2">
              Dragons: {matchInfo.info.teams[1].objectives.dragon.kills}
            </Text>
            <Text className="text-bialas mx-2">
              Herald: {matchInfo.info.teams[1].objectives.riftHerald.kills}
            </Text>
            <Text className="text-bialas mx-2">
              Towers: {matchInfo.info.teams[1].objectives.tower.kills}
            </Text>
          </View>
          <FlatList
            data={team2}
            keyExtractor={(item) => item.participantId.toString()}
            renderItem={renderParticipant}
          />
        </>
      }
    />
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'PoetsenOne-Regular',
    color: '#F5B800',
  },
})

export default MatchDetailsPage
