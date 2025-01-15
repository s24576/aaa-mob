import React, { useEffect } from 'react'
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native'
import { useRoute } from '@react-navigation/native'
import { useQuery } from '@tanstack/react-query'
import { getAnswersDuo } from '../api/duo/getAnswersDuo'
import { respondAnswerDuo } from '../api/duo/respondAnswerDuo'
import { useSocket } from '../context/SocketProvider'

const DuoPage = () => {
  const route = useRoute()
  const { duoId, locale } = route.params as { duoId: string; locale: string }
  const { duoAnswer, duoNotification } = useSocket()

  const {
    data: answersData,
    isLoading: isLoadingAnswers,
    error: errorAnswers,
    refetch: refetchAnswers,
  } = useQuery({
    queryKey: ['answers', duoId, locale],
    queryFn: () =>
      getAnswersDuo({ size: 10, sort: 'timestamp', direction: 'DESC' }),
  })

  const handleRespondAnswer = async (answerId: string, action: boolean) => {
    try {
      await respondAnswerDuo(answerId, action, duoId)
      refetchAnswers()
    } catch (error) {
      console.error('Error responding to answer:', error)
    }
  }

  const handleRefreshAnswers = () => {
    refetchAnswers()
  }

  useEffect(() => {
    if (duoAnswer) {
      console.log('New duo answer:', duoAnswer)
      // Handle new duo answer
    }
  }, [duoAnswer])

  useEffect(() => {
    if (duoNotification) {
      console.log('New duo notification:', duoNotification)
      // Handle new duo notification
    }
  }, [duoNotification])

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

  return (
    <ScrollView className="p-5">
      <Text className="text-bialas font-chewy">Answers:</Text>
      {answers.length > 0 ? (
        answers.map((answer: any) => (
          <View
            key={answer._id}
            className="mb-2 border border-bialas p-3 rounded-lg"
          >
            <Text className="text-bialas font-chewy">
              Author: {answer.author}
            </Text>
            <Text className="text-bialas font-chewy">
              Username: {answer.username}
            </Text>
            <Text className="text-bialas font-chewy">
              Message: {answer.message}
            </Text>
            <Text className="text-bialas font-chewy">
              Server: {answer.profile.server}
            </Text>
            <Text className="text-bialas font-chewy">
              Summoner Level: {answer.profile.summonerLevel}
            </Text>
            <TouchableOpacity
              onPress={() => handleRespondAnswer(answer._id, true)}
            >
              <Text className="text-bialas font-chewy">Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleRespondAnswer(answer._id, false)}
            >
              <Text className="text-bialas font-chewy">Reject</Text>
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <Text className="text-bialas">No answers found.</Text>
      )}
      <TouchableOpacity
        onPress={handleRefreshAnswers}
        style={styles.refreshButton}
      >
        <Text style={styles.refreshButtonText}>Refresh Answers</Text>
      </TouchableOpacity>
    </ScrollView>
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
})

export default DuoPage
