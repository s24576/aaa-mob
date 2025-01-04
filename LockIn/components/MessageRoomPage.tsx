import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, TextInput, Button } from 'react-native'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRoute } from '@react-navigation/native'
import { getMessages } from '../api/messenger/getMessages'
import { getChatById } from '../api/messenger/getChatById'
import { sendMessage } from '../api/messenger/sendMessage'
import { MessageProp } from '../types/messenger/MessageProp'
import { useContext } from 'react'
import { UserContext } from '../context/UserContext'
import { UserContextType } from '../types/local/userContext'
import { useSocket } from '../context/SocketProvider'
import { Chat } from '../types/messenger/Chat'
import { Message } from '../types/messenger/Message'

const ChatPage: React.FC = () => {
  const route = useRoute()
  const { chatId } = route.params as { chatId: string }
  const queryClient = useQueryClient()
  const [newMessage, setNewMessage] = useState('')
  const { userData } = useContext(UserContext) as UserContextType
  const { receivedMessage, messengerMessage } = useSocket()

  const {
    data: chatData,
    isLoading: isChatLoading,
    error: chatError,
    refetch: refetchChatData,
  } = useQuery({
    queryKey: ['chat', chatId],
    queryFn: () => getChatById(chatId),
  })

  const {
    data: messagesData,
    isLoading: isMessagesLoading,
    error: messagesError,
    refetch: refetchMessages,
  } = useQuery({
    queryKey: ['messages', chatId],
    queryFn: () => getMessages(chatId),
  })

  const mutation = useMutation({
    mutationFn: (message: MessageProp) => sendMessage(chatId, message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', chatId] })
      setNewMessage('')
    },
  })

  useEffect(() => {
    if (messengerMessage) {
      refetchChatData()
      refetchMessages()
    }
  }, [messengerMessage, refetchChatData, refetchMessages])

  if (isChatLoading || isMessagesLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </View>
    )
  }

  if (chatError || messagesError) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Error: {(chatError || messagesError)?.message}</Text>
      </View>
    )
  }

  const renderMessage = ({ item }: { item: Message }) => (
    <View className="p-4 border-b border-gray-300">
      <Text className="text-sm">
        {item.userId}: {item.message}
      </Text>
    </View>
  )

  const handleSendMessage = () => {
    if (newMessage.trim() && userData) {
      const message: MessageProp = {
        senderId: userData.username,
        content: newMessage,
        timestamp: Date.now(),
        message: newMessage,
      }
      mutation.mutate(message)
    }
  }

  return (
    <View className="flex-1">
      <View className="p-4 border-b border-gray-300">
        <Text className="text-lg font-bold">{chatData.name}</Text>
        <Text className="text-sm">
          Members:{' '}
          {chatData.members.map((member: any) => member.username).join(', ')}
        </Text>
      </View>
      <FlatList
        data={messagesData.content}
        keyExtractor={(item) => item._id}
        renderItem={renderMessage}
      />
      <View className="p-4 border-t border-gray-300">
        <TextInput
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message"
          className="border p-2 mb-2"
        />
        <Button title="Send" onPress={handleSendMessage} />
      </View>
    </View>
  )
}

export default ChatPage
