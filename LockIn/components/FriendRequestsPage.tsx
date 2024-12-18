import React, { useState, useEffect } from 'react'
import { View, TextInput, FlatList, Text, Button } from 'react-native'
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
  const [incomingRequests, setIncomingRequests] = useState<FriendRequest[]>([])
  const [outgoingRequests, setOutgoingRequests] = useState<FriendRequest[]>([])

  const { receivedMessage } = useSocket()

  const fetchFriendRequests = async () => {
    try {
      const [incoming, outgoing] = await Promise.all([
        getToFriendRequests(),
        getFromFriendRequests(),
      ])
      setIncomingRequests(incoming.content)
      setOutgoingRequests(outgoing.content)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchFriendRequests()
  }, [])

  useEffect(() => {
    if (receivedMessage) {
      fetchFriendRequests()
    }
  }, [receivedMessage])

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
  }

  const handleSendRequest = async () => {
    try {
      await sendFriendRequest(searchQuery)
      alert('Friend request sent!')
    } catch (error) {
      console.error(error)
      alert('Failed to send friend request.')
    }
  }

  const handleAcceptRequest = async (id: string) => {
    try {
      await respondFriendRequest({ requestId: id, response: true })
      alert('Friend request accepted!')
      fetchFriendRequests()
    } catch (error) {
      console.error(error)
      alert('Failed to accept friend request.')
    }
  }

  const handleDeclineRequest = async (id: string) => {
    try {
      await respondFriendRequest({ requestId: id, response: false })
      alert('Friend request declined!')
      fetchFriendRequests()
    } catch (error) {
      console.error(error)
      alert('Failed to decline friend request.')
    }
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
        data={incomingRequests}
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
        data={outgoingRequests}
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
