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
import Modal from 'react-native-modal'
import Checkbox from 'expo-checkbox'
import { addChatter } from '../api/messenger/addChatter'
import { leaveChat } from '../api/messenger/leaveChat'
import { useSocket } from '../context/SocketProvider'

interface MemberAction {
  chatId: string
  action: boolean
}

const ChatPage: React.FC = () => {
  const route = useRoute()
  const navigation = useNavigation()
  const { chatId } = route.params as { chatId: string }
  const queryClient = useQueryClient()
  const [newMessage, setNewMessage] = useState('')
  const { userData } = useContext(UserContext) as UserContextType
  const [replyingTo, setReplyingTo] = useState<Message | null>(null)
  const [pages, setPages] = useState<number[]>([0])
  const size = 10
  const isFirstLoad = useRef(true)
  const [isInitialDataLoaded, setIsInitialDataLoaded] = useState(false)
  const [allMessages, setAllMessages] = useState<Message[]>([])
  const [isAddFriendModalVisible, setAddFriendModalVisible] = useState(false)
  const [isLeaveChatModalVisible, setLeaveChatModalVisible] = useState(false)
  const [selectedFriends, setSelectedFriends] = useState<string[]>([])
  const { memberAction } = useSocket()

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

  // Merge new messages with existing messages
  useEffect(() => {
    if (messagesQueries.data) {
      // Reset messages when refetching
      setAllMessages(messagesQueries.data)
    }
  }, [messagesQueries.data])

  const { data: chatData, isLoading: isChatLoading } = useQuery({
    queryKey: ['chat', chatId],
    queryFn: () => getChatById(chatId),
  })

  const sendMessageMutation = useMutation({
    mutationFn: (message: MessageProp) => sendMessage(chatId, message),
    onSuccess: () => {
      setNewMessage('')
      queryClient.invalidateQueries({ queryKey: ['messages', chatId] })
      queryClient.invalidateQueries({ queryKey: ['chat', chatId] })
    },
  })

  const addChatterMutation = useMutation({
    mutationFn: ({ chatId, username }: { chatId: string; username: string }) =>
      addChatter(chatId, username),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat', chatId] })
    },
  })

  const leaveChatMutation = useMutation({
    mutationFn: (chatId: string) => leaveChat(chatId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chats'] })
      navigation.goBack()
    },
  })

  const toggleAddFriendModal = () => {
    setAddFriendModalVisible(!isAddFriendModalVisible)
  }

  const toggleLeaveChatModal = () => {
    setLeaveChatModalVisible(!isLeaveChatModalVisible)
  }

  const handleAddFriendToChat = () => {
    selectedFriends.forEach((friend) => {
      addChatterMutation.mutate({ chatId, username: friend })
    })
    setSelectedFriends([])
    toggleAddFriendModal()
  }

  const handleLeaveChat = () => {
    leaveChatMutation.mutate(chatId)
  }

  const filteredFriends = userData?.friends
    .map((friend) =>
      friend.username === userData.username ? friend.username2 : friend.username
    )
    .filter(
      (friend) =>
        chatData &&
        chatData.members &&
        !chatData.members.some((member: any) => member.username === friend)
    )

  const handleFriendSelection = (username: string) => {
    setSelectedFriends((prev) =>
      prev.includes(username)
        ? prev.filter((name) => name !== username)
        : [...prev, username]
    )
  }

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
  useEffect(() => {
    console.log('allMessages:', allMessages)
  }, [allMessages])
  const loadMoreMessages = () => {
    if (chatData?.totalMessages > allMessages.length) {
      const nextPage = Math.max(...pages) + 1
      setPages([...pages, nextPage])
    }

    console.log('Total messages: ', chatData?.totalMessages)
    console.log('Messages after load: ', allMessages.length)
  }

  // Refresh chat rooms and current chat when memberAction is received
  useEffect(() => {
    if (memberAction && memberAction.includes(chatId)) {
      queryClient.invalidateQueries({ queryKey: ['chat', chatId] })
      queryClient.invalidateQueries({ queryKey: ['messages', chatId] })
    }
  }, [memberAction, queryClient, chatId])

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
      {chatData?.privateChat === false && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 16,
          }}
        >
          <Button title="Add Friend" onPress={toggleAddFriendModal} />
          <Button title="Leave Chat" onPress={toggleLeaveChatModal} />
        </View>
      )}
      {/* Loading indicator */}
      {messagesQueries.isLoading && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            padding: 10,
            backgroundColor: '#f5f5f5',
            zIndex: 1,
            alignItems: 'center',
          }}
        >
          <ActivityIndicator size="small" color="#0000ff" />
          <Text>Loading messages...</Text>
        </View>
      )}

      {/* FlatList for messages */}
      <FlatList
        data={allMessages}
        keyExtractor={(item, index) => `${item._id}-${index}`} // Ensure unique keys
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
      <Modal isVisible={isAddFriendModalVisible}>
        <View
          style={{ padding: 16, backgroundColor: 'white', borderRadius: 8 }}
        >
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>
            Add Friend to Chat
          </Text>
          <FlatList
            data={filteredFriends}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 8,
                }}
              >
                <Checkbox
                  value={selectedFriends.includes(item)}
                  onValueChange={() => handleFriendSelection(item)}
                />
                <Text style={{ marginLeft: 8 }}>{item}</Text>
              </View>
            )}
            ListEmptyComponent={<Text>No friends available</Text>}
          />
          <Button title="Add" onPress={handleAddFriendToChat} />
          <Button title="Cancel" onPress={toggleAddFriendModal} />
        </View>
      </Modal>
      <Modal isVisible={isLeaveChatModalVisible}>
        <View
          style={{ padding: 16, backgroundColor: 'white', borderRadius: 8 }}
        >
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>
            Leave Chat
          </Text>
          <Text>Are you sure you want to leave this chat?</Text>
          <Button title="Leave" onPress={handleLeaveChat} />
          <Button title="Cancel" onPress={toggleLeaveChatModal} />
        </View>
      </Modal>
    </View>
  )
}

export default ChatPage
