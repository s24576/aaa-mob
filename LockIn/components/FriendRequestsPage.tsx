import React, { useState, useEffect } from 'react'
import {
  View,
  TextInput,
  FlatList,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getToFriendRequests } from '../api/profile/getToFriendRequests'
import { getFromFriendRequests } from '../api/profile/getFromFriendRequests'
import { sendFriendRequest } from '../api/profile/sendFriendRequest'
import { respondFriendRequest } from '../api/profile/respondFriendRequest'
import { cancelFriendRequest } from '../api/profile/cancelFriendRequest'
import { useSocket } from '../context/SocketProvider'
import Icon from 'react-native-vector-icons/Ionicons'

const FriendRequestsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const queryClient = useQueryClient()
  const { receivedMessage, memberAction } = useSocket()

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
  }, [receivedMessage, memberAction, refetchIncomingRequests, refetchOutgoingRequests])

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
  }

  const handleSendRequest = async () => {
    try {
      await sendFriendRequest(searchQuery)
      Alert.alert('Success', 'Friend request sent!', [{ text: 'OK' }])
      refetchOutgoingRequests()
    } catch (error) {
      console.error(error)
      Alert.alert('Error', 'Failed to send friend request.', [{ text: 'OK' }])
    }
  }

  const handleAcceptRequest = async (id: string) => {
    try {
      await respondFriendRequest({ requestId: id, response: true })
      Alert.alert('Success', 'Friend request accepted!', [
        { text: 'OK', style: 'cancel' },
      ])
      refetchIncomingRequests()
    } catch (error) {
      console.error(error)
      Alert.alert('Error', 'Failed to accept friend request.', [{ text: 'OK' }])
    }
  }

  const handleDeclineRequest = async (id: string) => {
    try {
      await respondFriendRequest({ requestId: id, response: false })
      Alert.alert('Success', 'Friend request declined!', [{ text: 'OK' }])
      refetchIncomingRequests()
    } catch (error) {
      console.error(error)
      Alert.alert('Error', 'Failed to decline friend request.', [
        { text: 'OK' },
      ])
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

  if (isIncomingLoading || isOutgoingLoading) {
    return (
      <View className=" justify-center items-center bg-czarnuch">
        <Text>Loading...</Text>
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
    <View className="p-5 bg-wegielek items-center">
      <TextInput
        className="h-10 w-11/12 border border-zoltek text-bialas rounded-lg mb-3 px-2 font-chewy bg-wegielek"
        placeholder="Search..."
        placeholderTextColor="#F5F5F5"
        value={searchQuery}
        onChangeText={handleSearchChange}
      />
      <TouchableOpacity
        onPress={handleSendRequest}
        className="bg-zoltek py-2 px-6 rounded-lg mb-4"
      >
        <Text className="text-wegielek text-lg font-chewy">
          Send Friend Request
        </Text>
      </TouchableOpacity>
      <Text className="text-bialas text-lg font-chewy mb-2">
        Incoming Friend Requests
      </Text>
      <FlatList
        data={incomingRequestsData.content}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View className="m-1 border border-bialas p-3 rounded-lg flex-row justify-between items-center">
            <Text className="text-bialas pr-2 font-chewy">{item.from}</Text>
            <TouchableOpacity onPress={() => handleAcceptRequest(item._id)}>
              <Icon name="checkmark-circle" size={30} color="#F5B800" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeclineRequest(item._id)}>
              <Icon name="close-circle" size={30} color="#F5B800" />
            </TouchableOpacity>
          </View>
        )}
      />
      <Text className="text-bialas text-lg font-chewy mt-5 mb-2">
        Outgoing Friend Requests
      </Text>
      <FlatList
        data={outgoingRequestsData.content}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View className="m-1 border border-bialas p-3 rounded-lg flex-row justify-between items-center">
            <Text className="text-bialas pr-2 font-chewy">{item.to}</Text>
            <TouchableOpacity onPress={() => handleCancelRequest(item._id)}>
              <Icon name="close-circle" size={30} color="#F5B800" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  )
}

export default FriendRequestsPage
