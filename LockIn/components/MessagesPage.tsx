import React, { useEffect } from 'react'
import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigation } from '@react-navigation/native'
import { getChats } from '../api/messenger/getChats'
import { ChatPageScreenProps } from '../App'
import { useSocket } from '../context/SocketProvider'

interface Chat {
  _id: string
  name: string
  privateChat: boolean
  members: { username: string; nickname: string | null }[]
  lastMessage: {
    _id: string
    chatId: string
    userId: string
    respondingTo: string
    message: string
    timestamp: number
  } | null
  totalMessages: number
  timestamp: number
}

const MessagesPage: React.FC = () => {
  const navigation = useNavigation<ChatPageScreenProps['navigation']>()
  const queryClient = useQueryClient()
  const { receivedMessage, messengerMessage } = useSocket()

  const {
    data: chatsData,
    isLoading,
    error,
    refetch: refetchChats,
  } = useQuery({
    queryKey: ['chats'],
    queryFn: getChats,
  })

  useEffect(() => {
    if (messengerMessage) {
      refetchChats()
    }
  }, [messengerMessage, refetchChats])

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Error: {error.message}</Text>
      </View>
    )
  }

  const handleChatPress = (chatId: string) => {
    navigation.navigate('ChatPage', { chatId })
  }

  const renderChat = ({ item }: { item: Chat }) => (
    <TouchableOpacity onPress={() => handleChatPress(item._id)}>
      <View className="p-4 border-b border-gray-300">
        <Text className="text-lg font-bold">{item.name}</Text>
        <Text className="text-sm">
          Members: {item.members.map((member) => member.username).join(', ')}
        </Text>
        {item.lastMessage && (
          <Text className="text-sm">
            Last message: {item.lastMessage.message}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  )

  return (
    <FlatList
      data={chatsData.content}
      keyExtractor={(item) => item._id}
      renderItem={renderChat}
    />
  )
}

export default MessagesPage
