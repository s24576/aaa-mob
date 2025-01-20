import React, { useState, useEffect } from 'react'
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native'
import { ProfileScreenProps } from '../App'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getToFriendRequests } from '../api/profile/getToFriendRequests'
import { getFromFriendRequests } from '../api/profile/getFromFriendRequests'
import { sendFriendRequest } from '../api/profile/sendFriendRequest'
import { respondFriendRequest } from '../api/profile/respondFriendRequest'
import { cancelFriendRequest } from '../api/profile/cancelFriendRequest'
import { useSocket } from '../context/SocketProvider'
import Icon from 'react-native-vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'

const FriendRequestsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const queryClient = useQueryClient()
  const { receivedMessage, memberAction } = useSocket()
  const navigation = useNavigation<ProfileScreenProps['navigation']>()

  const {
    data: incomingRequestsData,
    isLoading: isIncomingLoading,
    error: incomingError,
    refetch: refetchIncomingRequests,
  } = useQuery({
    queryKey: ['incomingRequests'],
    queryFn: getToFriendRequests,
  })

  const {
    data: outgoingRequestsData,
    isLoading: isOutgoingLoading,
    error: outgoingError,
    refetch: refetchOutgoingRequests,
  } = useQuery({
    queryKey: ['outgoingRequests'],
    queryFn: getFromFriendRequests,
  })

  useEffect(() => {
    if (receivedMessage || memberAction) {
      refetchIncomingRequests()
      refetchOutgoingRequests()
    }
  }, [
    receivedMessage,
    memberAction,
    refetchIncomingRequests,
    refetchOutgoingRequests,
  ])

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
  }

  const handleSendRequest = async () => {
    if (!searchQuery.trim()) return
    try {
      await sendFriendRequest(searchQuery)
      Alert.alert('Success', 'Friend request sent!', [{ text: 'OK' }])
      refetchOutgoingRequests()
    } catch (error) {
      console.error(error)
      Alert.alert('Error', 'Failed to send friend request.', [{ text: 'OK' }])
    }
  }

  const handleRespondRequest = async (id: string, response: boolean) => {
    try {
      await respondFriendRequest({ requestId: id, response })
      Alert.alert(
        'Success',
        `Friend request ${response ? 'accepted' : 'declined'}!`,
        [{ text: 'OK', style: 'cancel' }]
      )
      refetchIncomingRequests()
    } catch (error) {
      console.error(error)
      Alert.alert(
        'Error',
        `Failed to ${response ? 'accept' : 'decline'} friend request.`,
        [{ text: 'OK' }]
      )
    }
  }

  const handleCancelRequest = async (id: string) => {
    try {
      await cancelFriendRequest(id)
      Alert.alert('Success', 'Friend request canceled!', [{ text: 'OK' }])
      refetchOutgoingRequests()
    } catch (error) {
      console.error(error)
      Alert.alert('Error', 'Failed to cancel friend request.', [{ text: 'OK' }])
    }
  }

  const navigateToProfile = (userId: string) => {
    navigation.navigate('LockInProfile', { username: userId })
  }

  if (isIncomingLoading || isOutgoingLoading) {
    return (
      <View className="bg-wegielek">
        <ActivityIndicator size="large" color="#F5B800" />
      </View>
    )
  }

  if (incomingError || outgoingError) {
    return (
      <View className=" justify-center items-center bg-czarnuch">
        <Text>Error: {(incomingError || outgoingError)?.message}</Text>
      </View>
    )
  }

  return (
    <FlatList
      data={[]}
      ListHeaderComponent={
        <View className="px-5 pt-5 bg-wegielek items-center">
          <View className="flex-row justify-center items-center mb-3 w-full">
            <TouchableOpacity
              onPress={() => navigation.navigate('FriendList')}
              className="mr-2"
            >
              <Icon name="arrow-back" size={30} color="#F5B800" />
            </TouchableOpacity>
            <TextInput
              className="flex-1 border border-zoltek text-bialas rounded-lg px-2 py-3 font-chewy bg-wegielek"
              placeholder="Search..."
              placeholderTextColor="#F5F5F5"
              value={searchQuery}
              onChangeText={handleSearchChange}
            />
            <TouchableOpacity
              onPress={handleSendRequest}
              disabled={!searchQuery.trim()}
              className={`ml-2 p-3 rounded-lg ${
                !searchQuery.trim() ? 'bg-gray-300' : 'bg-zoltek'
              }`}
            >
              <Icon
                name="send"
                size={24}
                color={!searchQuery.trim() ? '#A9A9A9' : '#131313'}
              />
            </TouchableOpacity>
          </View>

          <Text className="text-bialas pt-2 text-lg font-chewy">
            Incoming Friend Requests
          </Text>
        </View>
      }
      ListFooterComponent={
        <View className="px-10 pt-2">
          <FlatList
            data={incomingRequestsData.content}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View className="m-1 border border-bialas p-3 rounded-lg flex-row justify-between items-center">
                <Text
                  className="text-bialas pr-2 font-chewy"
                  onPress={() => navigateToProfile(item.from)}
                >
                  {item.from}
                </Text>
                <TouchableOpacity
                  onPress={() => handleRespondRequest(item._id, true)}
                >
                  <Icon name="checkmark-circle" size={30} color="#F5B800" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleRespondRequest(item._id, false)}
                >
                  <Icon name="close-circle" size={30} color="#F5B800" />
                </TouchableOpacity>
              </View>
            )}
          />
          <Text className="text-bialas text-center text-lg font-chewy mt-5 mb-2">
            Outgoing Friend Requests
          </Text>
          <FlatList
            data={outgoingRequestsData.content}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View className="m-1 border border-bialas p-3 rounded-lg flex-row justify-between items-center">
                <Text
                  className="text-bialas pr-2 font-chewy"
                  onPress={() => navigateToProfile(item.to)}
                >
                  {item.to}
                </Text>
                <TouchableOpacity onPress={() => handleCancelRequest(item._id)}>
                  <Icon name="close-circle" size={30} color="#F5B800" />
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      }
      renderItem={null}
    />
  )
}

export default FriendRequestsPage
