import React, { useContext, useEffect } from 'react'
import { View, Text, FlatList, Button } from 'react-native'
import { useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query'
import { UserContext } from '../context/UserContext'
import { useNavigation } from '@react-navigation/native'
import { UserContextType } from '../types/local/userContext'
import { getUserData } from '../api/user/getUserData'
import { deleteFriend } from '../api/profile/deleteFriend'
import { ProfileScreenProps } from '../App'
import { useSocket } from '../context/SocketProvider'

const FriendListPage = () => {
  const { userData, setUserData } = useContext(UserContext) as UserContextType
  const navigation = useNavigation<ProfileScreenProps['navigation']>()
  const { receivedMessage } = useSocket()
  const queryClient = useQueryClient()

  const {
    data: userDataQuery,
    isLoading,
    error,
    refetch: refetchUserData,
  } = useQuery({
    queryKey: ['userData'],
    queryFn: getUserData,
  })

  useEffect(() => {
    if (receivedMessage) {
      refetchUserData()
    }
  }, [receivedMessage, refetchUserData])

  const usernameABC = userData?.username || ''

  if (isLoading) {
    return <Text>Loading...</Text>
  }

  if (error) {
    return <Text>Error: {error.message}</Text>
  }

  const handleFriendRequest = (item: {
    _id: string
    username: string
    username2: string
  }) => {
    const usernameToSend: string =
      usernameABC === item.username ? item.username2 : item.username
    navigation.navigate('LockInProfile', { username: usernameToSend })
  }

  const handleDeleteFriend = async (friendId: string) => {
    try {
      await deleteFriend(friendId)
      queryClient.invalidateQueries({ queryKey: ['userData'] })
    } catch (error) {
      console.error('Error deleting friend:', error)
    }
  }

  return (
    <View className="p-5">
      <Button
        title="Zaproszenia do znajomych"
        onPress={() => navigation.navigate('FriendRequests')}
      />
      <Text className="mt-5 mb-2">Lista znajomych:</Text>
      <FlatList
        data={userDataQuery?.friends}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View>
            <Text onPress={() => handleFriendRequest(item)}>
              {item.username} ({item.username2})
            </Text>
            <Button title="Usuń" onPress={() => handleDeleteFriend(item._id)} />
          </View>
        )}
      />
    </View>
  )
}

export default FriendListPage
