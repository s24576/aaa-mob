import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView } from 'react-native'
import { useRoute } from '@react-navigation/native'
import axios from 'axios'
import { Info } from '../types/riot/matchClass'

const MatchDetailsPage: React.FC = () => {
  const route = useRoute()
  const { matchId } = route.params as { matchId: string }
  const [matchInfo, setMatchInfo] = useState<Info | null>(null)

  useEffect(() => {
    const fetchMatchInfo = async () => {
      try {
        const response = await axios.get(
          `${process.env.BACKEND_ADDRESS}/riot/getMatchInfo?matchId=${matchId}`
        )
        const data = response.data
        const matchInfo = new Info(data.info)
        setMatchInfo(matchInfo)
      } catch (error) {
        console.error('Error fetching match info:', error)
      }
    }

    fetchMatchInfo()
  }, [matchId])

  if (!matchInfo) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    )
  }

  return (
    <ScrollView>
      <View>
        <View className="mb-4">
          <Text>Game Duration: {matchInfo.gameDuration} seconds</Text>
          <Text>Queue Type: {matchInfo.queueType}</Text>
          <Text>Participants:</Text>
        </View>
        {matchInfo.participants.map((participant, index) => (
          <View key={index} className="mb-2">
            <Text>Summoner Name: {participant.riotIdGameName}</Text>
            <Text>Champion: {participant.championName}</Text>
            <Text>Kills: {participant.kills}</Text>
            <Text>Deaths: {participant.deaths}</Text>
            <Text>Assists: {participant.assists}</Text>
            <Text>
              Total Damage Dealt to Champions:{' '}
              {participant.totalDamageDealtToChampions}
            </Text>
            <Text>Win: {participant.win ? 'Yes' : 'No'}</Text>
            <Text className="font-bold">PUUID: {participant.puuid}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  )
}

export default MatchDetailsPage
