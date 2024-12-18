import React, { useContext, useEffect, useState } from 'react'
import { View, Text, FlatList, Button } from 'react-native'
import { UserContext } from '../context/UserContext'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import { UserContextType } from '../types/local/userContext'
import { getUserData } from '../api/user/getUserData'
import { ProfileScreenProps } from '../App'
import { useSocket } from '../context/SocketProvider'

const FriendListPage = () => {
  const { userData, setUserData } = useContext(UserContext) as UserContextType
  const navigation = useNavigation<ProfileScreenProps['navigation']>()
  const { receivedMessage } = useSocket()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getUserData()
        setUserData(data)
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }

    fetchUserData()
  }, [])

  useEffect(() => {
    if (receivedMessage) {
      const fetchUserData = async () => {
        try {
          const data = await getUserData()
          setUserData(data)
        } catch (error) {
          console.error('Error fetching user data:', error)
        }
      }

      fetchUserData()
    }
  }, [receivedMessage])

  const usernameABC = userData?.username || ''

  if (!userData || !userData.friends) {
    return <Text>Loading...</Text>
  }

  const handleFriendRequest = (item: {
    _id: string
    username: string
    username2: string
  }) => {
    const usernameToSend: string =
      usernameABC === item.username ? item.username2 : item.username
    console.log('Sending to:', usernameToSend)
    navigation.navigate('LockInProfile', { username: usernameToSend })
  }

  return (
    <View>
      <Button
        title="Zaproszenia do znajomych"
        onPress={() => navigation.navigate('FriendRequests')}
      />
      <Text>Lista znajomych:</Text>
      <FlatList
        data={userData.friends}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <Text onPress={() => handleFriendRequest(item)}>
            {item.username} ({item.username2})
          </Text>
        )}
      />
    </View>
  )
}

export default FriendListPage
