import React, { useContext } from 'react'
import { View, Text } from 'react-native'
import { UserContext } from '../context/UserContext'
import { UserContextType } from '../types/local/userContext'
import { useRoute } from '@react-navigation/native'

const MatchDetailsPage: React.FC = () => {
  const route = useRoute()
  const { matchId } = route.params as { matchId: string }

  return (
    <View>
      <Text>Welcome to the Match Details Page</Text>
      <Text>Match ID: {matchId}</Text>
    </View>
  )
}

export default MatchDetailsPage
