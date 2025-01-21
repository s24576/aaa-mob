import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Button,
  ActivityIndicator,
  StyleSheet,
  Image,
} from 'react-native'
import { Profile } from '../types/riot/profileClass'
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import { MatchDetailsScreenProps } from '../App'
import { findPlayer } from '../api/riot/findPlayer'
import { useQuery } from '@tanstack/react-query'
import { getWatchlistRiotProfiles } from '../api/riot/getWatchlistRiotProfiles'
import { getMyRiotProfiles } from '../api/riot/getMyRiotProfiles'
import { manageWatchlist } from '../api/profile/manageWatchlist'
import { manageMyAccount } from '../api/profile/manageMyAccount'

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
      await manageWatchlist(profile.server + '_' + profile.puuid)
      alert(
        isWatching
          ? 'Removed from watchlist successfully'
          : 'Added to watchlist successfully'
      )
      setIsWatching(!isWatching)
    } catch (error) {
      alert('Failed to update watchlist')
    }
  }

  const handleClaimAccount = async () => {
    try {
      await manageMyAccount(profile.server + '_' + profile.puuid)
      alert(
        isClaimed
          ? 'Account unclaimed successfully'
          : 'Account claimed successfully'
      )
      setIsClaimed(!isClaimed)
    } catch (error) {
      alert('Failed to update account claim status')
    }
  }

  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.text} className="text-zoltek font-Chewy-Regular">
          {profile.server}
        </Text>
        <Text style={styles.text}>{profile.summonerLevel}</Text>
      </View>
      <View style={styles.subheader}>
        <Image
          source={{
            uri: `https://ddragon.leagueoflegends.com/cdn/14.24.1/img/profileicon/${profile.profileIconId}.png`,
          }}
          style={styles.profileIcon}
        />
        <Text style={styles.gameName} className="text-bialas font-chewy">
          {profile.gameName} #{profile.tagLine}
        </Text>
      </View>
      <View className="flex-row justify-between py-2 border-b border-gray-300">
        <Text style={{ color: '#F5F5F5', fontFamily: 'Chewy-Regular' }}>
          Server
        </Text>
        <Text style={{ color: '#F5F5F5', fontFamily: 'Chewy-Regular' }}>
          {profile.server}
        </Text>
      </View>
      <View className="flex-row justify-between py-2 border-b border-gray-300">
        <Text style={{ color: '#F5F5F5', fontFamily: 'Chewy-Regular' }}>
          Summoner Level
        </Text>
        <Text style={{ color: '#F5F5F5', fontFamily: 'Chewy-Regular' }}>
          {profile.summonerLevel}
        </Text>
      </View>
      <View className="flex-row justify-between py-2 border-b border-gray-300">
        <Text style={{ color: '#F5F5F5', fontFamily: 'Chewy-Regular' }}>
          Ranked Tier
        </Text>
        <Text style={{ color: '#F5F5F5', fontFamily: 'Chewy-Regular' }}>
          {profile.rankedTier}
        </Text>
      </View>
      <View className="flex-row justify-between py-2 border-b border-gray-300">
        <Text style={{ color: '#F5F5F5', fontFamily: 'Chewy-Regular' }}>
          Ranked Rank
        </Text>
        <Text style={{ color: '#F5F5F5', fontFamily: 'Chewy-Regular' }}>
          {profile.rankedRank}
        </Text>
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
      <Text style={{ color: '#F5F5F5', fontFamily: 'Chewy-Regular' }}>
        Ranks
      </Text>
      {profile.ranks.map((rank, index) => (
        <View
          key={index}
          className="flex-row justify-between py-2 border-b border-gray-300"
        >
          <Text style={{ color: '#F5F5F5', fontFamily: 'Chewy-Regular' }}>
            {rank.queueType}
          </Text>
          <Text style={{ color: '#F5F5F5', fontFamily: 'Chewy-Regular' }}>
            {rank.tier} {rank.rank}
          </Text>
        </View>
      ))}
      <Text style={{ color: '#F5F5F5', fontFamily: 'Chewy-Regular' }}>
        Mastery
      </Text>
      {profile.mastery.map((mastery, index) => (
        <View
          key={index}
          className="flex-row justify-between py-2 border-b border-gray-300"
        >
          <View style={styles.championContainer}>
            <Image
              source={{
                uri: `https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion/${mastery.championName}.png`,
              }}
              style={styles.championIcon}
            />
            <Text style={{ color: '#F5F5F5', fontFamily: 'Chewy-Regular' }}>
              {mastery.championName}
            </Text>
          </View>
          <Text style={{ color: '#F5F5F5', fontFamily: 'Chewy-Regular' }}>
            {mastery.championPoints}
          </Text>
        </View>
      ))}
      <Text style={{ color: '#F5F5F5', fontFamily: 'Chewy-Regular' }}>
        Matches
      </Text>
      {profile.matches.map((match) => (
        <View
          key={match.matchId}
          className="flex-row justify-between py-2 border-b border-gray-300"
        >
          <View style={styles.championContainer}>
            <Image
              source={{
                uri: `https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion/${match.championName}.png`,
              }}
              style={styles.championIcon}
            />
          </View>
          <Text style={{ color: '#F5F5F5', fontFamily: 'Chewy-Regular' }}>
            {match.kills}/{match.deaths}/{match.assists}
          </Text>
          <TouchableOpacity onPress={() => handleMatchPress(match.matchId)}>
            <Text style={{ color: '#F5F5F5', fontFamily: 'Chewy-Regular' }}>
              {match.matchId}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  )
}

const ProfilePage: React.FC = () => {
  const navigation = useNavigation()
  const route = useRoute<RiotProfileRouteProp>()
  const { server = '', tag = '', name = '', puuid = '' } = route.params || {}

  const {
    data: profile,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['profile', server, tag, name, puuid],
    queryFn: () => findPlayer(server, puuid, tag, name),
    enabled: !!server && ((!!tag && !!name) || !!puuid),
  })

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      {isLoading && <ActivityIndicator size="large" color="#F5B800" />}
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

const styles = StyleSheet.create({
  description: {
    fontSize: 16,
    fontFamily: 'Chewy-Regular',
    color: '#F5F5F5',
  },
  sixthRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  champion: {
    width: 96,
    height: 96,
    borderRadius: 8,
    marginRight: 8,
  },
  leagueItem: {
    width: 48,
    height: 48,
    marginRight: 8,
    borderRadius: 10,
  },
  summonerSpell: {
    width: 36,
    height: 36,
    marginRight: 8,
    borderRadius: 10,
  },
  fifthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  thirdRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  fourthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  subheader: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  gameName: {
    fontSize: 24,
    fontFamily: 'Chewy-Regular',
    color: '#F5B800',
  },
  text: {
    fontSize: 18,
    fontFamily: 'Chewy-Regular',
    color: '#F5F5F5',
  },
  container: {
    borderBottomColor: '#F5B800',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 20,
  },
  modalContent: {
    backgroundColor: '#131313',
    padding: 15,
    borderRadius: 10,
    borderColor: '#F5B800',
    borderWidth: 1,
    width: '80%',
    maxHeight: '80%',
  },
  option: {
    padding: 10,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    color: '#F5F5F5',
  },
  selectedOption: {
    color: '#F5B800',
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 0,
  },
  applyFiltersButton: {
    backgroundColor: '#F5B800',
    fontFamily: 'Chewy-Regular',
    paddingVertical: 10,
    borderRadius: 10,
    borderColor: '#F5B800',
    borderWidth: 1,
    margin: 5,
    alignItems: 'center',
    minWidth: '94%',
    maxWidth: '94%',
    paddingHorizontal: 20,
  },
  applyFiltersButtonText: {
    color: '#131313',
    fontSize: 16,
    fontFamily: 'Chewy-Regular',
    textAlign: 'center',
    alignItems: 'center',
  },
  filtersButton: {
    backgroundColor: '#F5B800',
    fontFamily: 'Chewy-Regular',
    paddingVertical: 10,
    borderRadius: 10,
    borderColor: '#F5B800',
    borderWidth: 1,
    margin: 5,
    alignItems: 'center',
    minWidth: '94%',
    maxWidth: '94%',
    paddingHorizontal: 20,
  },
  filtersButtonText: {
    color: '#131313',
    fontSize: 16,
    fontFamily: 'Chewy-Regular',
    textAlign: 'center',
    alignItems: 'center',
  },
  customButton: {
    backgroundColor: '#13131313',
    fontFamily: 'Chewy-Regular',
    paddingVertical: 10,
    borderRadius: 10,
    borderColor: '#F5B800',
    borderWidth: 1,
    margin: 5,
    alignItems: 'center',
    minWidth: '94%',
    maxWidth: '94%',
    paddingHorizontal: 20,
  },
  textInput: {
    fontFamily: 'Chewy-Regular',
    backgroundColor: '#1E1E1E',
    color: '#F5F5F5',
    paddingVertical: 10,
    borderRadius: 10,
    borderColor: '#F5B800',
    borderWidth: 1,
    margin: 5,
    alignItems: 'center',
    minWidth: '94%',
    maxWidth: '94%',
    paddingHorizontal: 20,
  },
  customButtonText: {
    color: '#F5F5F5',
    fontSize: 16,
    fontFamily: 'Chewy-Regular',
    textAlign: 'center',
    alignItems: 'center',
  },
  customButton2: {
    backgroundColor: '#F5B800',
    fontFamily: 'Chewy-Regular',
    paddingVertical: 10,
    borderRadius: 10,
    borderColor: '#F5B800',
    borderWidth: 1,
    margin: 5,
    alignItems: 'center',
    minWidth: '94%',
    maxWidth: '94%',
    paddingHorizontal: 20,
  },
  customButton2Text: {
    color: '#131313',
    fontSize: 16,
    fontFamily: 'Chewy-Regular',
    textAlign: 'center',
    alignItems: 'center',
  },
  championImage: {
    width: 20,
    height: 20,
    marginRight: 10,
    marginBottom: 6,
  },
  selectedChampionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedChampionText: {
    color: '#F5F5F5',
    fontSize: 16,
    fontFamily: 'Chewy-Regular',
    marginLeft: 10,
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  championContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  championIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
  },
})

export default ProfilePage
