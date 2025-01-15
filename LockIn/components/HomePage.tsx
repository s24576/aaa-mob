import React, { useContext } from 'react'
import { View, Text, Button } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { UserContext } from '../context/UserContext'
import { MatchDetailsScreenProps } from '../App'
import { UserContextType } from '../types/local/userContext'
import AsyncStorage from '@react-native-async-storage/async-storage'

const HomePage = () => {
  const { userData } = useContext(UserContext) as UserContextType
  const navigation = useNavigation<MatchDetailsScreenProps['navigation']>()
  const { setUserData } = useContext(UserContext) as UserContextType
  const handleLogout = async () => {
    await AsyncStorage.removeItem('token')
    setUserData(null)
  }

  return (
    <View>
      <Text>Welcome to the Home Page {userData?.username}</Text>
      <Button title="Logout" onPress={handleLogout} />
      <Button
        title="Go to Builds Browser"
        onPress={() => navigation.navigate('BuildsBrowser')}
      />
      <Button
        title="Go to Announcements"
        onPress={() => navigation.navigate('Announcements')}
      />
      <Button
        title="Go to Courses"
        onPress={() => navigation.navigate('CoursesBrowser')}
      />
    </View>
  )
}

export default HomePage
