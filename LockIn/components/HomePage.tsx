import React, { useContext } from 'react'
import { View, Text, Button } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { UserContext } from '../context/UserContext'
import { MatchDetailsScreenProps } from '../App'
import { UserContextType } from '../types/local/userContext'

const HomePage = () => {
  const { userData } = useContext(UserContext) as UserContextType
  const navigation = useNavigation<MatchDetailsScreenProps['navigation']>()

  return (
    <View>
      <Text>Welcome to the Home Page {userData?.username}</Text>
      <Button
        title="Go to Builds Browser"
        onPress={() => navigation.navigate('BuildsBrowser')}
      />
    </View>
  )
}

export default HomePage
