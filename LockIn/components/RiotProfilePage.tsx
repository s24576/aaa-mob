import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Button } from 'react-native'
import { Profile } from '../types/riot/profileClass'
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import { MatchDetailsScreenProps } from '../App'
import { findPlayer } from '../api/riot/findPlayer'
import { useQuery } from '@tanstack/react-query'
import { addToWatchList } from '../api/profile/addWatchList'
import { removeFromWatchList } from '../api/profile/removeWatchList'
import { addMyAccount } from '../api/profile/addMyAccount'
import { removeMyAccount } from '../api/profile/removeMyAccount'
import { getWatchlistRiotProfiles } from '../api/riot/getWatchlistRiotProfiles'
import { getMyRiotProfiles } from '../api/riot/getMyRiotProfiles'

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
  const [isWatching, setIsWatching] = useState(false)
  const [isClaimed, setIsClaimed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const navigation = useNavigation<MatchDetailsScreenProps['navigation']>()

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const watchlistProfiles = await getWatchlistRiotProfiles()
        const myProfiles = await getMyRiotProfiles()

        const isInWatchlist = watchlistProfiles.some(
          (p: { puuid: string }) => p.puuid === profile.puuid
        )
        const isInMyAccounts = myProfiles.some(
          (p: { puuid: string }) => p.puuid === profile.puuid
        )

        setIsWatching(isInWatchlist)
        setIsClaimed(isInMyAccounts)
      } catch (error) {
        console.error('Error fetching account status:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStatus()
  }, [profile])

  const handleMatchPress = (matchId: string) => {
    navigation.navigate('MatchDetails', { matchId })
  }

  const handleAddToWatchList = async () => {
    try {
      if (isWatching) {
        await removeFromWatchList(profile.server + '_' + profile.puuid)
        alert('Removed from watchlist successfully')
        setIsWatching(false)
      } else {
        await addToWatchList(profile.server + '_' + profile.puuid)
        alert('Added to watchlist successfully')
        setIsWatching(true)
      }
    } catch (error) {
      alert('Failed to update watchlist')
    }
  }

  const handleClaimAccount = async () => {
    try {
      if (isClaimed) {
        await removeMyAccount(profile.server + '_' + profile.puuid)
        alert('Account unclaimed successfully')
        setIsClaimed(false)
      } else {
        await addMyAccount(profile.server + '_' + profile.puuid)
        alert('Account claimed successfully')
        setIsClaimed(true)
      }
    } catch (error) {
      alert('Failed to update account claim status')
    }
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
      <View className="flex-row justify-between py-2 border-b border-gray-300">
        <Button
          title={
            isLoading
              ? 'Loading...'
              : isClaimed
                ? 'Porzuć konto'
                : 'Przypisz konto'
          }
          onPress={handleClaimAccount}
          disabled={isLoading}
        />
        <Button
          title={
            isLoading
              ? 'Loading...'
              : isWatching
                ? 'Przestań obserwować'
                : 'Obserwuj konto'
          }
          onPress={handleAddToWatchList}
          disabled={isLoading}
        />
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
      {profile.matches.map((match) => (
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
