import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { getAnswersDuo } from '../api/duo/getAnswersDuo'
import { respondAnswerDuo } from '../api/duo/respondAnswerDuo'
import Icon from 'react-native-vector-icons/Ionicons'
import { Ionicons } from '@expo/vector-icons'
import { useSocket } from '../context/SocketProvider'
import { useNavigation } from '@react-navigation/native'
import { DuoScreenProps } from '../App'

const DuoAnswerPage = () => {
  const { duoAnswer, duoNotification } = useSocket()
  const navigation = useNavigation<DuoScreenProps['navigation']>()
  const [page, setPage] = useState(0)
  const size = 4

  const {
    data: answersData,
    isLoading: isLoadingAnswers,
    error: errorAnswers,
    refetch: refetchAnswers,
  } = useQuery({
    queryKey: ['answers', page],
    queryFn: () =>
      getAnswersDuo({ size, sort: 'timestamp', direction: 'DESC', page }),
  })

  const handleRespondAnswer = async (answerId: string, action: boolean) => {
    try {
      await respondAnswerDuo(answerId, action)
      refetchAnswers()
    } catch (error) {
      console.error('Error responding to answer:', error)
    }
  }

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1)
  }

  const handlePreviousPage = () => {
    if (page > 0) {
      setPage((prevPage) => prevPage - 1)
    }
  }

  useEffect(() => {
    if (duoAnswer) {
      console.log('New duo answer:', duoAnswer)
    }
  }, [duoAnswer])

  useEffect(() => {
    if (duoNotification) {
      console.log('New duo notification:', duoNotification)
    }
  }, [duoNotification])

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

  if (isLoadingAnswers) {
    return (
      <View className="bg-wegielek">
        <ActivityIndicator size="large" color="#F5B800" />
      </View>
    )
  }

  if (errorAnswers) {
    return <Text className="text-bialas">Error: {errorAnswers.message}</Text>
  }

  const answers = answersData?.content || []
  console.log('Answers:', answers)

  return (
    <View className="bg-wegielek h-full p-5">
      <View className="flex-row justify-left items-center mb-3 w-full">
        <TouchableOpacity
          onPress={() => navigation.navigate('Duos')}
          className="mr-2"
        >
          <Icon name="arrow-back" size={30} color="#F5B800" />
        </TouchableOpacity>
        <Text className="text-bialas font-chewy text-lg font-bold">
          Answers:
        </Text>
      </View>
      <View className="">
        <ScrollView>
          {answers.length > 0 ? (
            answers.map((answer: any) => (
              <View
                key={answer._id}
                className="mb-2 border border-bialas p-3 rounded-lg"
              >
                <Text className="text-bialas font-chewy rounded-lg text-lg font-bold">
                  Duo Request
                </Text>
                <View className="flex-row justify-left items-center">
                  <Image
                    source={{
                      uri: `https://ddragon.leagueoflegends.com/cdn/14.24.1/img/profileicon/${answer.profile.profileIconId}.png`,
                    }}
                    style={{ width: 50, height: 50, borderRadius: 25 }}
                  />
                  <Text className="text-bialas font-chewy px-1">
                    {answer.profile.gameName}#{answer.profile.tagLine}
                  </Text>
                </View>
                <Text className="text-bialas font-chewy">
                  Lock.In Username: {answer.username}
                </Text>
                <Text className="text-bialas font-chewy">
                  Server: {answer.profile.server}
                </Text>
                <Text className="text-bialas font-chewy">
                  Summoner Level: {answer.profile.summonerLevel}
                </Text>
                <Text className="text-bialas font-chewy">
                  Rank: {answer.profile.tier || 'Unranked'}
                </Text>
                {answer.profile.tier ? (
                  <Image
                    source={
                      rankImages[answer.profile.tier.toUpperCase()] ||
                      rankImages['UNRANKED']
                    }
                    style={{ width: 50, height: 50 }}
                  />
                ) : (
                  <Text className="text-bialas font-chewy">Unranked</Text>
                )}
                <View className="flex-row justify-between items-center">
                  <TouchableOpacity
                    onPress={() => handleRespondAnswer(answer._id, true)}
                    style={styles.customButton2}
                  >
                    <Text className="text-wegielek font-chewy">Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleRespondAnswer(answer._id, false)}
                    style={styles.customButton}
                  >
                    <Text className="text-bialas font-chewy">Reject</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <Text className="text-bialas">No answers found.</Text>
          )}
        </ScrollView>
      </View>
      <View className="flex-row justify-between items-center mt-2 absolute bottom-3 left-5 right-5">
        <TouchableOpacity onPress={handlePreviousPage} disabled={page === 0}>
          <Ionicons name="arrow-back" size={30} color="#F5B800" />
        </TouchableOpacity>
        <Text className="text-bialas">{page + 1}</Text>
        <TouchableOpacity onPress={handleNextPage}>
          <Ionicons name="arrow-forward" size={30} color="#F5B800" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  refreshButton: {
    backgroundColor: '#F5B800',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  refreshButtonText: {
    color: '#131313',
    fontSize: 16,
    fontWeight: 'bold',
  },
  customButton: {
    backgroundColor: '#13131313',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderColor: '#F5B800',
    borderWidth: 1,
    margin: 5,
    alignItems: 'center',
  },
  customButtonText: {
    color: '#F5F5F5',
    fontSize: 16,
    fontWeight: 'bold',
  },
  customButton2: {
    backgroundColor: '#F5B800',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    margin: 5,
    alignItems: 'center',
  },
  customButton2Text: {
    color: '#131313',
    fontSize: 16,
    fontWeight: 'bold',
  },
})

export default DuoAnswerPage
