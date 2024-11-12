import React, { useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Button } from 'react-native'
import { Profile } from '../types/riot/profileClass'
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import { MatchDetailsScreenProps } from '../App'
import { findPlayer } from '../api/riot/findPlayer'
import { useQuery } from '@tanstack/react-query'

type RiotProfileRouteProp = RouteProp<
  {
    RiotProfile: {
      server?: string
      tag?: string
      name?: string
      puuid?: string
    }
  },
  'RiotProfile'
>

const ProfileTable: React.FC<{ profile: Profile }> = ({ profile }) => {
  const navigation = useNavigation<MatchDetailsScreenProps['navigation']>()

  const handleMatchPress = (matchId: string) => {
    navigation.navigate('MatchDetails', { matchId })
  }

  return (
    <View className="mt-5">
      <Text className="text-lg mb-2">Profile Information</Text>
      <View className="flex-row justify-between py-2 border-b border-gray-300">
        <Text className="flex-1 text-left">PUUID</Text>
        <Text className="flex-1 text-left">{profile.puuid}</Text>
      </View>
      <View className="flex-row justify-between py-2 border-b border-gray-300">
        <Text className="flex-1 text-left">Game Name</Text>
        <Text className="flex-1 text-left">{profile.gameName}</Text>
      </View>
      <View className="flex-row justify-between py-2 border-b border-gray-300">
        <Text className="flex-1 text-left">Tag Line</Text>
        <Text className="flex-1 text-left">{profile.tagLine}</Text>
      </View>
      <View className="flex-row justify-between py-2 border-b border-gray-300">
        <Text className="flex-1 text-left">Server</Text>
        <Text className="flex-1 text-left">{profile.server}</Text>
      </View>
      <View className="flex-row justify-between py-2 border-b border-gray-300">
        <Text className="flex-1 text-left">Summoner Level</Text>
        <Text className="flex-1 text-left">{profile.summonerLevel}</Text>
      </View>
      <View className="flex-row justify-between py-2 border-b border-gray-300">
        <Text className="flex-1 text-left">Ranked Tier</Text>
        <Text className="flex-1 text-left">{profile.rankedTier}</Text>
      </View>
      <View className="flex-row justify-between py-2 border-b border-gray-300">
        <Text className="flex-1 text-left">Ranked Rank</Text>
        <Text className="flex-1 text-left">{profile.rankedRank}</Text>
      </View>
      <Text className="text-lg mb-2 mt-4">Ranks</Text>
      {profile.ranks.map((rank, index) => (
        <View
          key={index}
          className="flex-row justify-between py-2 border-b border-gray-300"
        >
          <Text className="flex-1 text-left">{rank.queueType}</Text>
          <Text className="flex-1 text-left">
            {rank.tier} {rank.rank}
          </Text>
        </View>
      ))}
      <Text className="text-lg mb-2 mt-4">Mastery</Text>
      {profile.mastery.map((mastery, index) => (
        <View
          key={index}
          className="flex-row justify-between py-2 border-b border-gray-300"
        >
          <Text className="flex-1 text-left">{mastery.championName}</Text>
          <Text className="flex-1 text-left">{mastery.championPoints}</Text>
        </View>
      ))}
      <Text className="text-lg mb-2 mt-4">Matches</Text>
      {profile.matches.map((match, index) => (
        <View
          key={match.matchId}
          className="flex-row justify-between py-2 border-b border-gray-300"
        >
          <Text className="flex-1 text-left">{match.championName}</Text>
          <Text className="flex-1 text-left">
            {match.kills}/{match.deaths}/{match.assists}
          </Text>
          <TouchableOpacity onPress={() => handleMatchPress(match.matchId)}>
            <Text className="font-bold">{match.matchId}</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  )
}

const ProfilePage: React.FC = () => {
  const navigation = useNavigation()
  const route = useRoute<RiotProfileRouteProp>()
  const { server, tag, name, puuid } = route.params || {}

  const {
    data: profile,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['profile', server, tag, name, puuid],
    queryFn: () => findPlayer(server, tag, name, puuid),
    enabled: !!server && ((!!tag && !!name) || !!puuid),
  })

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text className="text-2xl mb-4">Profile Page</Text>
      {isLoading && <Text>Loading...</Text>}
      {error && (
        <View>
          <Text>Error fetching profile: {error.message}</Text>
          <Button title="Go Back" onPress={() => navigation.goBack()} />
        </View>
      )}
      {profile && <ProfileTable profile={profile} />}
    </ScrollView>
  )
}

export default ProfilePage
