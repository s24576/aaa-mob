import React, { useContext } from 'react'
import { View, Text } from 'react-native'
import { UserContext } from '../context/UserContext'
import { UserContextType } from '../types/local/userContext'

const HomePage = () => {
  const { userData } = useContext(UserContext) as UserContextType

  return (
    <View>
      <Text>Welcome to the Home Page {userData?.username}</Text>
    </View>
  )
}

export default HomePage
