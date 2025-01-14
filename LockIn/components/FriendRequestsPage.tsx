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
import { useSocket } from '../context/SocketProvider'
import Icon from 'react-native-vector-icons/Ionicons'

interface FriendRequest {
  _id: string
  from: string
  to: string | null
  timestamp: number
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#F5B800',
    color: '#131313',
    marginVertical: 5,
  },
})

const FriendRequestsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const queryClient = useQueryClient()
  const { receivedMessage } = useSocket()

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
    if (receivedMessage) {
      refetchIncomingRequests()
      refetchOutgoingRequests()
    }
  }, [receivedMessage, refetchIncomingRequests, refetchOutgoingRequests])

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
      Alert.alert('Success', 'Friend request accepted!', [{ text: 'OK' }])
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
      Alert.alert('Error', 'Failed to decline friend request.', [{ text: 'OK' }])
    }
  }

  if (isIncomingLoading || isOutgoingLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-czarnuch">
        <Text>Loading...</Text>
      </View>
    )
  }

  if (incomingError || outgoingError) {
    return (
      <View className="flex-1 justify-center items-center bg-czarnuch">
        <Text>Error: {(incomingError || outgoingError)?.message}</Text>
      </View>
    )
  }

  return (
    <View className="p-5 bg-czarnuch">
      <TextInput
        className="h-10 border border-gray-400 mb-3 px-2 bg-bialas"
        placeholder="Search..."
        value={searchQuery}
        onChangeText={handleSearchChange}
      />
      <Button
        title="Send Friend Request"
        onPress={handleSendRequest}
        color="#F5B800"
      />
      <Text className="mt-5 mb-2 text-zloty">Incoming Friend Requests</Text>
      <FlatList
        data={incomingRequestsData.content}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View className="mb-2 border border-zloty p-3 rounded flex-row justify-between items-center">
            <Text className="text-bialas flex-1">
              {item.from} - {item.to}
            </Text>
            <TouchableOpacity
              className="ml-2"
              onPress={() => handleAcceptRequest(item._id)}
            >
              <Icon name="checkmark-circle" size={30} color="#F5B800" />
            </TouchableOpacity>
            <TouchableOpacity
              className="ml-2"
              onPress={() => handleDeclineRequest(item._id)}
            >
              <Icon name="close-circle" size={30} color="#F5B800" />
            </TouchableOpacity>
          </View>
        )}
      />
      <Text className="mt-5 mb-2 text-zloty">Outgoing Friend Requests</Text>
      <FlatList
        data={outgoingRequestsData.content}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View className="mb-2 border border-zloty p-3 rounded flex-row justify-between items-center">
            <Text className="text-bialas flex-1">
              {item.from} - {item.to}
            </Text>
          </View>
        )}
      />
    </View>
  )
}

export default FriendRequestsPage
