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
import servers from '../assets/servers.json'

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

const getServerName = (code: string) => {
  const serverObj = servers.find((s) => s.code === code)
  return serverObj ? serverObj.name : code
}

const ProfileTable: React.FC<{ profile: Profile }> = ({ profile }) => {
  const rankImages: { [key: string]: any } = {
    IRON: require('../assets/ranks/IRON.png'),
    BRONZE: require('../assets/ranks/BRONZE.png'),
    SILVER: require('../assets/ranks/SILVER.png'),
    GOLD: require('../assets/ranks/GOLD.png'),
    PLATINUM: require('../assets/ranks/PLATINUM.png'),
    EMERALD: require('../assets/ranks/EMERALD.png'),
    DIAMOND: require('../assets/ranks/DIAMOND.png'),
    MASTER: require('../assets/ranks/MASTER.png'),
    GRANDMASTER: require('../assets/ranks/GRANDMASTER.png'),
    CHALLENGER: require('../assets/ranks/CHALLENGER.png'),
    UNRANKED: require('../assets/ranks/UNRANKED.png'),
  }

  const masteryEmblems: { [key: string]: any } = {
    1: require('../assets/masteryEmblems/1.png'),
    2: require('../assets/masteryEmblems/2.png'),
    3: require('../assets/masteryEmblems/3.png'),
    4: require('../assets/masteryEmblems/4.png'),
    5: require('../assets/masteryEmblems/5.png'),
    6: require('../assets/masteryEmblems/6.png'),
    7: require('../assets/masteryEmblems/7.png'),
    8: require('../assets/masteryEmblems/8.png'),
    9: require('../assets/masteryEmblems/9.png'),
    10: require('../assets/masteryEmblems/10.png'),
  }

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
        <Text
          style={styles.textHeader}
          className="text-zoltek font-Chewy-Regular"
        >
          {getServerName(profile.server)}
        </Text>
        <Text style={styles.textHeader}>
          Summoner level: {profile.summonerLevel}
        </Text>
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
      <View style={styles.ranksRow}>
        <View style={styles.rankedContainer}>
          <Text style={styles.text}>FLEX</Text>
          <View style={styles.rankContainer}>
            <Image
              source={
                rankImages[
                  profile.ranks.find((r) => r.queueType === 'RANKED_FLEX_SR')
                    ?.tier || 'UNRANKED'
                ]
              }
              style={styles.rankImage}
              className="mr-2"
            />
            <Text style={styles.text}>
              {profile.ranks.find((r) => r.queueType === 'RANKED_FLEX_SR')
                ?.rank || ''}
            </Text>
          </View>
        </View>
        <View style={styles.rankedContainer}>
          <Text style={styles.text}>SOLO Q</Text>
          <View style={styles.rankContainer}>
            {' '}
            <Image
              source={
                rankImages[
                  profile.ranks.find((r) => r.queueType === 'RANKED_SOLO_5x5')
                    ?.tier || 'UNRANKED'
                ]
              }
              style={styles.rankImage}
              className="mr-2"
            />
            <Text style={styles.text}>
              {profile.ranks.find((r) => r.queueType === 'RANKED_SOLO_5x5')
                ?.rank || ''}
            </Text>
          </View>
        </View>
      </View>
      <View className="flex-row justify-between py-2">
        <TouchableOpacity
          style={styles.customButton2}
          onPress={handleClaimAccount}
          disabled={isLoading}
        >
          <Text style={styles.customButton2Text}>
            {isLoading
              ? 'Loading...'
              : isClaimed
                ? 'Porzuć konto'
                : 'Przypisz konto'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.customButton2}
          onPress={handleAddToWatchList}
          disabled={isLoading}
        >
          <Text style={styles.customButton2Text}>
            {isLoading
              ? 'Loading...'
              : isWatching
                ? 'Przestań obserwować'
                : 'Obserwuj konto'}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.masteriesContainer}>
        {profile.mastery.map((mastery, index) => (
          <View key={index} className="flex-row justify-between py-2">
            <View style={styles.singleMastery}>
              <View style={styles.championContainer}>
                <Image
                  source={{
                    uri: `https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion/${mastery.championName}.png`,
                  }}
                  style={styles.championIcon}
                  // className="mb-18 ml-8"
                />
              </View>
              <Image
                source={masteryEmblems[Math.min(mastery.championLevel, 10)]}
                style={styles.masteryEmblem}
                // className="mb-4"
              />
              <Text style={{ color: '#F5F5F5', fontFamily: 'Chewy-Regular' }}>
                {mastery.championLevel}
              </Text>
            </View>
          </View>
        ))}
      </View>
      <View className="flex-row justify-evenly"></View>
      {profile.matches.map((match) => (
        <TouchableOpacity
          key={match.matchId}
          style={styles.matchContainer}
          onPress={() => handleMatchPress(match.matchId)}
        >
          <Text style={match.win ? styles.winText : styles.loseText}>
            {match.win ? 'WIN' : 'LOSE'}
          </Text>
          <Image
            source={{
              uri: `https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion/${match.championName}.png`,
            }}
            style={styles.championIcon}
          />
          <Text style={styles.kdaText}>
            {match.kills}/{match.deaths}/{match.assists}
          </Text>
        </TouchableOpacity>
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
  ranksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  rankedContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
  textHeader: {
    fontSize: 18,
    fontFamily: 'Chewy-Regular',
    color: '#F5F5F5',
    maxWidth: '45%',
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
    minWidth: '40%',
    maxWidth: '40%',
    // paddingHorizontal: 20,
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
  masteriesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginBottom: 16,
  },
  singleMastery: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
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
  },
  rankImage: {
    width: 50,
    height: 50,
    marginVertical: 8,
  },
  masteryEmblem: {
    width: 24,
    height: 24,
    // position: 'absolute',
    // flex: 1,
    // justifyContent: 'center',
  },
  winText: {
    color: '#F5B800',
    fontFamily: 'Chewy-Regular',
    fontSize: 16,
  },
  loseText: {
    color: '#F5F5F5',
    fontFamily: 'Chewy-Regular',
    fontSize: 16,
  },
  matchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F5B800',
  },
  kdaText: {
    color: '#F5F5F5',
    fontFamily: 'Chewy-Regular',
    fontSize: 16,
  },
})

export default ProfilePage
