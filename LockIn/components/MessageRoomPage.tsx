import React, { useState, useContext, useEffect, useRef } from 'react'
import {
  View,
  Text,
  FlatList,
  TextInput,
  Button,
  TouchableOpacity,
  ActivityIndicator, // Import ActivityIndicator
} from 'react-native'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRoute, useNavigation } from '@react-navigation/native'
import { getMessages } from '../api/messenger/getMessages'
import { getChatById } from '../api/messenger/getChatById'
import { sendMessage } from '../api/messenger/sendMessage'
import { MessageProp, Message } from '../types/messenger'
import { UserContext } from '../context/UserContext'
import { UserContextType } from '../types/local/userContext'
import { Ionicons } from '@expo/vector-icons'

const ChatPage: React.FC = () => {
  const route = useRoute()
  const navigation = useNavigation()
  const { chatId } = route.params as { chatId: string }
  const queryClient = useQueryClient()
  const [newMessage, setNewMessage] = useState('')
  const { userData } = useContext(UserContext) as UserContextType
  const [replyingTo, setReplyingTo] = useState<Message | null>(null)
  const [pages, setPages] = useState<number[]>([0])
  const size = 8
  const isFirstLoad = useRef(true)
  const [isInitialDataLoaded, setIsInitialDataLoaded] = useState(false)

  const messagesQueries = useQuery({
    queryKey: ['messages', chatId, pages],
    queryFn: async () => {
      const responses = await Promise.all(
        pages.map((page) => getMessages(chatId, page, size))
      )
      if (isFirstLoad.current) {
        isFirstLoad.current = false
        setIsInitialDataLoaded(true)
      }
      return responses.flatMap((res) => res.content)
    },
  })

  const { data: chatData, isLoading: isChatLoading } = useQuery({
    queryKey: ['chat', chatId],
    queryFn: () => getChatById(chatId),
  })

  const sendMessageMutation = useMutation({
    mutationFn: (message: MessageProp) => sendMessage(chatId, message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', chatId] })
      setNewMessage('')
    },
  })

  const allMessages = messagesQueries.data || []

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#ccc' }}
    >
      {item.respondingTo && (
        <Text style={{ fontSize: 12, fontStyle: 'italic', color: 'gray' }}>
          Replying to:{' '}
          {
            allMessages.find((msg: Message) => msg._id === item.respondingTo)
              ?.message
          }
        </Text>
      )}
      <Text style={{ fontSize: 14 }}>
        {item.userId}: {item.message}
      </Text>
      <TouchableOpacity onPress={() => setReplyingTo(item)}>
        <Ionicons name="arrow-undo" size={20} color="black" />
      </TouchableOpacity>
    </View>
  )

  const handleSendMessage = () => {
    if (newMessage.trim() && userData) {
      const message: MessageProp = {
        senderId: userData.username,
        content: newMessage,
        timestamp: Date.now(),
        message: newMessage,
        respondingTo: replyingTo ? replyingTo._id : null,
      }
      sendMessageMutation.mutate(message)
      setReplyingTo(null)
    }
  }

  const loadMoreMessages = () => {
    console.log('Loaded messages: ', allMessages.length)

    // Ensure there are more messages to load
    if (chatData?.totalMessages > allMessages.length) {
      const nextPage = pages.length
      setPages((prevPages) => [...prevPages, nextPage])

      // We need to refetch the messages with the new page
      messagesQueries.refetch()
    }

    console.log('Total messages: ', chatData?.totalMessages)
    console.log('Messages after load: ', allMessages.length)
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Chat header with members list */}
      <View
        style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#ccc' }}
      >
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
          {chatData?.name || 'Loading...'}
        </Text>
        {chatData && (
          <Text style={{ fontSize: 14 }}>
            Members:{' '}
            {chatData.members.map((member: any) => member.username).join(', ')}
          </Text>
        )}
      </View>

      {/* FlatList for messages */}
      <FlatList
        data={allMessages}
        keyExtractor={(item) => item._id}
        renderItem={renderMessage}
        inverted
        onEndReached={loadMoreMessages}
      />

      {/* Reply and message input section */}
      <View style={{ padding: 16, borderTopWidth: 1, borderTopColor: '#ccc' }}>
        {replyingTo && (
          <View style={{ marginBottom: 10 }}>
            <Text>Replying to: {replyingTo.message}</Text>
            <Button title="Cancel Reply" onPress={() => setReplyingTo(null)} />
          </View>
        )}
        <TextInput
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message"
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 10,
            marginBottom: 10,
          }}
        />
        <Button title="Send" onPress={handleSendMessage} />
      </View>
    </View>
  )
}

export default ChatPage
