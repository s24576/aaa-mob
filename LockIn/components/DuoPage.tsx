import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import { useRoute } from '@react-navigation/native'
import { getDuoById } from '../api/duo/getDuoById'
import { useQuery } from '@tanstack/react-query'
import { getAnswersDuo } from '../api/duo/getAnswersDuo'
import { answerDuo } from '../api/duo/answerDuo'
import { respondAnswerDuo } from '../api/duo/respondAnswerDuo'
import { useSocket } from '../context/SocketProvider'
import { getMyRiotProfiles } from '../api/riot/getMyRiotProfiles'

const DuoPage = () => {
  const route = useRoute()
  const { duoId, locale } = route.params as { duoId: string; locale: string }
  const { duoAnswer, duoNotification } = useSocket()

  const [riotProfiles, setRiotProfiles] = useState<
    { puuid: string; gameName: string; server: string }[]
  >([])
  const [selectedProfile, setSelectedProfile] = useState<{
    puuid: string
    gameName: string
  } | null>(null)

  useEffect(() => {
    const fetchRiotProfiles = async () => {
      try {
        const profiles = await getMyRiotProfiles()
        setRiotProfiles(profiles)
        if (profiles.length > 0) {
          setSelectedProfile(profiles[0])
        }
      } catch (error) {
        console.error('Error fetching Riot profiles:', error)
      }
    }

    fetchRiotProfiles()
  }, [])

  const {
    data: duo,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['duo', duoId, locale],
    queryFn: () => getDuoById(duoId, locale),
  })

  const {
    data: answers,
    isLoading: isLoadingAnswers,
    error: errorAnswers,
  } = useQuery({
    queryKey: ['answers', duoId, locale],
    queryFn: () =>
      getAnswersDuo(
        duoId,
        { size: 10, sort: 'timestamp', direction: 'DESC' },
        locale
      ),
  })

  const handleAnswer = async (answer: any) => {
    try {
      await answerDuo(answer, duoId, locale)
      // Optionally refetch answers after submitting a new one
    } catch (error) {
      console.error('Error submitting answer:', error)
    }
  }

  const handleRespondAnswer = async (answerId: string, action: boolean) => {
    try {
      await respondAnswerDuo(answerId, action, locale)
      // Optionally refetch answers after responding to one
    } catch (error) {
      console.error('Error responding to answer:', error)
    }
  }

  const handleApplyForDuo = async () => {
    if (!selectedProfile) {
      console.error('No Riot profile selected')
      return
    }

    try {
      const response = await answerDuo(
        {
          puuid: selectedProfile.puuid,
          author: selectedProfile.gameName || 'unknown',
          message: 'I want to join your duo!',
        },
        duoId,
        locale
      )
      console.log('Applied for duo successfully:', response)
      // Optionally refetch answers after applying
    } catch (error) {
      console.error('Error applying for duo:', error)
    }
  }

  const handleProfileSelect = (profile: {
    puuid: string
    gameName: string
  }) => {
    setSelectedProfile(profile)
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

  if (isLoading) {
    return (
      <View className="bg-wegielek">
        <ActivityIndicator size="large" color="#F5B800" />
      </View>
    )
  }

  if (error) {
    return <Text className="text-bialas">Error: {error.message}</Text>
  }

  return (
    <View className="p-5">
      <Text className="text-bialas font-chewy">Author: {duo.author}</Text>
      <Text className="text-bialas font-chewy">Server: {duo.server}</Text>
      <Text className="text-bialas font-chewy">PUUID: {duo.puuid}</Text>
      <Text className="text-bialas font-chewy">
        Ranks: {duo.minRank} - {duo.maxRank}
      </Text>
      <Text className="text-bialas font-chewy">
        Positions: {duo.positions.join(', ')}
      </Text>
      <Text className="text-bialas font-chewy">
        Looked Positions:{' '}
        {duo.lookedPositions ? duo.lookedPositions.join(', ') : 'None'}
      </Text>
      <Text className="text-bialas font-chewy">
        Champion IDs: {duo.championIds.join(', ')}
      </Text>
      <Text className="text-bialas font-chewy">Answers:</Text>
      {isLoadingAnswers ? (
        <ActivityIndicator size="large" color="#F5B800" />
      ) : errorAnswers ? (
        <Text className="text-bialas">Error: {errorAnswers.message}</Text>
      ) : answers && answers.length > 0 ? (
        answers.map((answer: any) => (
          <View
            key={answer._id}
            className="mb-2 border border-bialas p-3 rounded-lg"
          >
            <Text className="text-bialas font-chewy">
              Author: {answer.author}
            </Text>
            <Text className="text-bialas font-chewy">
              Message: {answer.message}
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
      <Text className="text-bialas font-chewy">Select Riot Profile:</Text>
      {riotProfiles.map((profile) => (
        <TouchableOpacity
          key={profile.puuid}
          onPress={() => handleProfileSelect(profile)}
          style={[
            styles.profileButton,
            selectedProfile?.puuid === profile.puuid &&
              styles.selectedProfileButton,
          ]}
        >
          <Text style={styles.profileButtonText}>
            {profile.gameName || 'Unknown Profile'}
          </Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity onPress={handleApplyForDuo} style={styles.applyButton}>
        <Text style={styles.applyButtonText}>Apply for Duo</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  applyButton: {
    backgroundColor: '#F5B800',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#131313',
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileButton: {
    backgroundColor: '#13131313',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderColor: '#F5B800',
    borderWidth: 1,
    marginVertical: 5,
    alignItems: 'center',
  },
  selectedProfileButton: {
    backgroundColor: '#F5B800',
  },
  profileButtonText: {
    color: '#F5F5F5',
    fontSize: 16,
    fontWeight: 'bold',
  },
})

export default DuoPage
