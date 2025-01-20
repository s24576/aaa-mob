import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { getAnswersDuo } from '../api/duo/getAnswersDuo'
import { respondAnswerDuo } from '../api/duo/respondAnswerDuo'
import { Ionicons } from '@expo/vector-icons'
import { useSocket } from '../context/SocketProvider'
import { useNavigation } from '@react-navigation/native'
import { DuoScreenProps } from '../App'
import servers from '../assets/servers.json'
import styles from '../styles/BrowserStyles'

const DuoAnswerPage = () => {
  const { duoAnswer, duoNotification } = useSocket()
  const navigation = useNavigation<DuoScreenProps['navigation']>()
  const [page, setPage] = useState(0)
  const size = 5

  const {
    data: answersData,
    isLoading: isLoadingAnswers,
    error: errorAnswers,
    refetch: refetchAnswers,
  } = useQuery({
    queryKey: ['answers', page],
    queryFn: () =>
      getAnswersDuo({
        size,
        sort: 'timestamp',
        direction: 'DESC',
        page: page,
      }),
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
    refetchAnswers()
  }

  const handlePreviousPage = () => {
    if (page > 0) {
      setPage((prevPage) => prevPage - 1)
      refetchAnswers()
    }
  }

  const handleProfilePress = (server: string, puuid: string) => {
    navigation.navigate('RiotProfile', { server, puuid })
  }

  const handleMemberPress = (username: string) => {
    navigation.navigate('LockInProfile', { username })
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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F5B800" />
      </View>
    )
  }

  if (errorAnswers) {
    return <Text style={styles.errorText}>Error: {errorAnswers.message}</Text>
  }

  const answers = answersData?.content || []

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Duos')}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={30} color="#F5B800" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Duo Requests:</Text>
      </View>
      <View style={styles.scrollViewContainer}>
        <ScrollView>
          {answers.length > 0 ? (
            answers.map((answer: any) => {
              const serverName =
                servers.find((s) => s.code === answer.profile.server)?.name ||
                answer.profile.server
              return (
                <View key={answer._id} style={styles.answerContainer}>
                  <View style={styles.headerContainer}>
                    <Text style={[styles.answerText, styles.serverName]}>
                      {serverName}
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleMemberPress(answer.username)}
                    >
                      <Text style={styles.answerTitle}>{answer.username}</Text>
                    </TouchableOpacity>
                    <Text style={[styles.answerText, styles.serverName]}>
                      {new Date(answer.timestamp * 1000).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={styles.profileContainer}>
                    <TouchableOpacity
                      onPress={() =>
                        handleProfilePress(
                          answer.profile.server,
                          answer.profile.puuid
                        )
                      }
                      style={styles.profileContents}
                    >
                      <Image
                        source={{
                          uri: `https://ddragon.leagueoflegends.com/cdn/14.24.1/img/profileicon/${answer.profile.profileIconId}.png`,
                        }}
                        style={styles.profileImage}
                      />
                      <Text style={styles.profileText}>
                        {answer.profile.gameName}#{answer.profile.tagLine}
                      </Text>
                    </TouchableOpacity>
                    <View style={styles.profileContents}>
                      {answer.profile.tier ? (
                        <Image
                          source={
                            rankImages[answer.profile.tier.toUpperCase()] ||
                            rankImages['UNRANKED']
                          }
                          style={styles.rankImage}
                        />
                      ) : (
                        <Image
                          source={rankImages['UNRANKED']}
                          style={styles.rankImage}
                        />
                      )}
                      <Text style={styles.answerText}>
                        {answer.profile.rank}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      onPress={() => handleRespondAnswer(answer._id, true)}
                      style={styles.acceptButton}
                    >
                      <Text style={styles.acceptButtonText}>Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleRespondAnswer(answer._id, false)}
                      style={styles.rejectButton}
                    >
                      <Text style={styles.rejectButtonText}>Reject</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )
            })
          ) : (
            <Text style={styles.noAnswersText}>No answers found.</Text>
          )}
        </ScrollView>
      </View>
      <View style={styles.paginationContainer}>
        <TouchableOpacity onPress={handlePreviousPage} disabled={page === 0}>
          <Ionicons name="arrow-back" size={30} color="#F5B800" />
        </TouchableOpacity>
        <Text style={styles.pageNumber}>{page + 1}</Text>
        <TouchableOpacity onPress={handleNextPage}>
          <Ionicons name="arrow-forward" size={30} color="#F5B800" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default DuoAnswerPage
