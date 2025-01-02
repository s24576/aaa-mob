import React, { useState, useEffect } from 'react'
import { View, TextInput, FlatList, Text, Button } from 'react-native'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getToFriendRequests } from '../api/profile/getToFriendRequests'
import { getFromFriendRequests } from '../api/profile/getFromFriendRequests'
import { sendFriendRequest } from '../api/profile/sendFriendRequest'
import { respondFriendRequest } from '../api/profile/respondFriendRequest'
import { useSocket } from '../context/SocketProvider'

interface FriendRequest {
  _id: string
  from: string
  to: string | null
  timestamp: number
}

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
      alert('Friend request sent!')
      refetchOutgoingRequests()
    } catch (error) {
      console.error(error)
      alert('Failed to send friend request.')
    }
  }

  const handleAcceptRequest = async (id: string) => {
    try {
      await respondFriendRequest({ requestId: id, response: true })
      alert('Friend request accepted!')
      refetchIncomingRequests()
    } catch (error) {
      console.error(error)
      alert('Failed to accept friend request.')
    }
  }

  const handleDeclineRequest = async (id: string) => {
    try {
      await respondFriendRequest({ requestId: id, response: false })
      alert('Friend request declined!')
      refetchIncomingRequests()
    } catch (error) {
      console.error(error)
      alert('Failed to decline friend request.')
    }
  }

  if (isIncomingLoading || isOutgoingLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </View>
    )
  }

  if (incomingError || outgoingError) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Error: {(incomingError || outgoingError)?.message}</Text>
      </View>
    )
  }

  return (
    <View className="p-5">
      <TextInput
        className="h-10 border border-gray-400 mb-3 px-2"
        placeholder="Search..."
        value={searchQuery}
        onChangeText={handleSearchChange}
      />
      <Button title="Send Friend Request" onPress={handleSendRequest} />
      <Text className="mt-5 mb-2">Incoming Friend Requests</Text>
      <FlatList
        data={incomingRequestsData.content}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View className="mb-2">
            <Text>
              {item.from} - {item.to}
            </Text>
            <Button
              title="Accept"
              onPress={() => handleAcceptRequest(item._id)}
            />
            <Button
              title="Decline"
              onPress={() => handleDeclineRequest(item._id)}
            />
          </View>
        )}
      />
      <Text className="mt-5 mb-2">Outgoing Friend Requests</Text>
      <FlatList
        data={outgoingRequestsData.content}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View className="mb-2">
            <Text>
              {item.from} - {item.to}
            </Text>
          </View>
        )}
      />
    </View>
  )
}

export default FriendRequestsPage
