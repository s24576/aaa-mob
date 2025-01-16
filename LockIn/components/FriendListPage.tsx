import React, { useContext, useEffect } from 'react'
import {
  View,
  Text,
  FlatList,
  Button,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import { useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query'
import { UserContext } from '../context/UserContext'
import { useNavigation } from '@react-navigation/native'
import { UserContextType } from '../types/local/userContext'
import { getUserData } from '../api/user/getUserData'
import { deleteFriend } from '../api/profile/deleteFriend'
import { ProfileScreenProps } from '../App'
import { useSocket } from '../context/SocketProvider'
import Icon from 'react-native-vector-icons/Ionicons'

const FriendListPage = () => {
  const { userData, setUserData } = useContext(UserContext) as UserContextType
  const navigation = useNavigation<ProfileScreenProps['navigation']>()
  const { receivedMessage, memberAction } = useSocket()
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
    if (receivedMessage || memberAction) {
      refetchUserData()
    }
  }, [receivedMessage, memberAction, refetchUserData])

  if (isLoading) {
    return (
      <View className="bg-wegielek">
        <ActivityIndicator size="large" color="#F5B800" />
      </View>
    )
  }
  if (error) {
    return <Text>Error: {error.message}</Text>
  }

  const handleFriendRequest = (item: {
    _id: string
    username: string
    username2: string
  }) => {
    if (!userData) return
    const usernameToSend: string =
      userData._id === item.username ? item.username2 : item.username
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
    <View className=" p-5 bg-wegielek items-center">
      <TouchableOpacity
        onPress={() => navigation.navigate('FriendRequests')}
        className="bg-zoltek py-2 px-6 rounded-lg mb-4"
      >
        <Text className="text-wegielek text-lg font-chewy">
          Zaproszenia do znajomych
        </Text>
      </TouchableOpacity>

      <Text className="text-bialas text-lg font-chewy mb-2">
        Lista znajomych:
      </Text>
      <View className="flex-row justify-center items-center mb-3 w-full px-10">
        <FlatList
          data={userDataQuery?.friends}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View className="mb-2 border border-bialas p-3 rounded-lg flex-row justify-between items-center">
              <Text
                className="text-bialas pr-2 font-chewy"
                onPress={() => handleFriendRequest(item)}
              >
                {userData && userData._id === item.username
                  ? item.username2
                  : item.username}
              </Text>
              <TouchableOpacity
                onPress={() => handleDeleteFriend(item._id)}
                className="bg-zoltek p-2 rounded-lg"
              >
                <Icon name="trash-bin" size={30} color="#131313" />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </View>
  )
}

export default FriendListPage
