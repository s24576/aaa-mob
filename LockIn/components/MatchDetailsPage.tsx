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
import runesIcon from '../assets/runesIcon.json'
import { useTranslation } from 'react-i18next'

const MatchDetailsPage: React.FC = () => {
  const route = useRoute()
  const navigation = useNavigation<ProfileScreenProps['navigation']>()
  const { matchId } = route.params as { matchId: string }
  const { t } = useTranslation()

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

  const getRuneIcon = (runeId: number): string => {
    return runesIcon[runeId as keyof typeof runesIcon] || runesIcon.default
  }

  const renderParticipant = ({ item }: { item: Participant }) => (
    <TouchableOpacity
      onPress={() =>
        handleParticipantPress(matchInfo.info.platformId, item.puuid)
      }
    >
      <View className="flex-row items-center justify-between py-2 border-b border-gray-300">
        <View className="flex-column w-full">
          <View className="flex-row items-center justify-around">
            <View className="flex-row items-center justify-center mb-4">
              {/* Ikona championa */}
              <Image
                source={{
                  uri: `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${item.championName}.png`,
                }}
                style={{ width: 48, height: 48 }}
              />
              {/* Summonerki */}
              <View className="flex-column items-center">
                <Image
                  source={{
                    uri: `https://ddragon.leagueoflegends.com/cdn/${version}/img/spell/${item.summoner1Name}.png`,
                  }}
                  style={{ width: 20, height: 20, marginBottom: 4 }}
                />
                <Image
                  source={{
                    uri: `https://ddragon.leagueoflegends.com/cdn/${version}/img/spell/${item.summoner2Name}.png`,
                  }}
                  style={{ width: 20, height: 20 }}
                />
              </View>
              {/* Runy */}
              <View className="flex-column items-center">
                <Image
                  source={{
                    uri: `https://ddragon.leagueoflegends.com/cdn/img/${getRuneIcon(
                      item.perks.styles[0].selections[0].perk
                    )}`,
                  }}
                  style={{ width: 20, height: 20, marginBottom: 4 }}
                />
                <Image
                  source={{
                    uri: `https://ddragon.leagueoflegends.com/cdn/img/${getRuneIcon(
                      item.perks.styles[1].style
                    )}`,
                  }}
                  style={{ width: 20, height: 20 }}
                />
              </View>
            </View>

            <View className="flex-column items-center justify-center">
              {/* Nazwa gracza */}
              <Text
                style={styles.baseText}
                className="text-bialas text-left"
                // style={{ flex: 1 }}
              >
                {item.riotIdGameName}
              </Text>

              {/* Statystyki */}
              <Text
                style={styles.baseText}
                className="text-bialas text-left"
                // style={{ flex: 1 }}
              >
                {item.kills}/{item.deaths}/{item.assists}
              </Text>
            </View>
            <View className="flex-column items-center justify-center m-0 p-0">
              {/* Rank */}
              <Image
                source={rankImages[item.tier] || rankImages['UNRANKED']}
                style={{ width: 30, height: 30 }}
              />
            </View>
          </View>
          <View className="flex-row items-center justify-center w-full">
            {/* Items */}
            <View className="flex-row items-center mx-2">
              {[
                item.item0,
                item.item1,
                item.item2,
                item.item3,
                item.item4,
                item.item5,
                item.item6,
              ].map((itemId, index) =>
                itemId > 0 ? (
                  <Image
                    key={index}
                    source={{
                      uri: `https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${itemId}.png`,
                    }}
                    style={{ width: 36, height: 36, marginRight: 6 }}
                  />
                ) : null
              )}
            </View>
          </View>
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
        <Text style={styles.baseText} className="text-bialas text-lg">
          Error fetching match info: {(error || versionError)?.message}
        </Text>
      </View>
    )
  }

  if (!matchInfo) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text style={styles.baseText} className="text-bialas text-lg">
          No match information found.
        </Text>
      </View>
    )
  }

  if (!Array.isArray(matchInfo.info.participants)) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text style={styles.baseText} className="text-bialas text-lg">
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
        <View>
          <View style={styles.header}>
            <Text
              style={styles.baseText}
              className="text-bialas text-2xl font-bold mb-4"
            >
              {new Date(
                Number(matchInfo.info.gameCreation)
              ).toLocaleDateString()}
            </Text>
            <Text style={styles.baseText} className="text-bialas text-lg mb-12">
              {matchInfo.info.queueType}
            </Text>
          </View>
          {/* Informacje drużynowe */}
          <Text
            style={styles.baseText}
            className={`text-xl font-semibold mb-2 text-center ${matchInfo.info.teams[0].win ? 'text-zoltek' : 'text-bialas'}`}
          >
            Team 1
          </Text>
          <Text
            style={styles.baseText}
            className={`text-lg mb-2 text-center ${matchInfo.info.teams[0].win ? 'text-zoltek' : 'text-bialas'}`}
          >
            {matchInfo.info.teams[0].win ? t('winner') : t('loser')}
          </Text>
          <View className="mb-4 flex-row justify-center">
            <Text
              style={styles.baseText}
              className={`mx-2 ${matchInfo.info.teams[0].win ? 'text-zoltek' : 'text-bialas'}`}
            >
              {t('barons')}: {matchInfo.info.teams[0].objectives.baron.kills}
            </Text>
            <Text
              style={styles.baseText}
              className={`mx-2 ${matchInfo.info.teams[0].win ? 'text-zoltek' : 'text-bialas'}`}
            >
              {t('dragons')}: {matchInfo.info.teams[0].objectives.dragon.kills}
            </Text>
            <Text
              style={styles.baseText}
              className={`mx-2 ${matchInfo.info.teams[0].win ? 'text-zoltek' : 'text-bialas'}`}
            >
              {t('heralds')}:{' '}
              {matchInfo.info.teams[0].objectives.riftHerald.kills}
            </Text>
            <Text
              style={styles.baseText}
              className={`mx-2 ${matchInfo.info.teams[0].win ? 'text-zoltek' : 'text-bialas'}`}
            >
              {t('towers')}: {matchInfo.info.teams[0].objectives.tower.kills}
            </Text>
          </View>
        </View>
      }
      data={team1}
      keyExtractor={(item) => item.participantId.toString()}
      renderItem={renderParticipant}
      ListFooterComponent={
        <View style={styles.header}>
          <Text
            style={styles.baseText}
            className={`text-xl font-semibold mb-2 text-center ${matchInfo.info.teams[1].win ? 'text-zoltek' : 'text-bialas'} mt-8`}
          >
            Team 2
          </Text>
          <Text
            style={styles.baseText}
            className={`text-lg mb-2 text-center ${matchInfo.info.teams[1].win ? 'text-zoltek' : 'text-bialas'}`}
          >
            {matchInfo.info.teams[1].win ? t('winner') : t('loser')}
          </Text>
          <View className="mb-4 flex-row justify-center">
            <Text
              style={styles.baseText}
              className={`mx-2 ${matchInfo.info.teams[1].win ? 'text-zoltek' : 'text-bialas'}`}
            >
              {t('barons')}: {matchInfo.info.teams[1].objectives.baron.kills}
            </Text>
            <Text
              style={styles.baseText}
              className={`mx-2 ${matchInfo.info.teams[1].win ? 'text-zoltek' : 'text-bialas'}`}
            >
              {t('dragons')}: {matchInfo.info.teams[1].objectives.dragon.kills}
            </Text>
            <Text
              style={styles.baseText}
              className={`mx-2 ${matchInfo.info.teams[1].win ? 'text-zoltek' : 'text-bialas'}`}
            >
              {t('heralds')}:{' '}
              {matchInfo.info.teams[1].objectives.riftHerald.kills}
            </Text>
            <Text
              style={styles.baseText}
              className={`mx-2 ${matchInfo.info.teams[1].win ? 'text-zoltek' : 'text-bialas'}`}
            >
              {t('towers')}: {matchInfo.info.teams[1].objectives.tower.kills}
            </Text>
          </View>
          <FlatList
            data={team2}
            keyExtractor={(item) => item.participantId.toString()}
            renderItem={renderParticipant}
          />
        </View>
      }
    />
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#F5B800',
  },
  baseText: {
    fontFamily: 'PoetsenOne-Regular',
    flex: 1,
  },
})

export default MatchDetailsPage
