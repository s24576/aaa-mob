import React, { useState, useEffect, useContext } from 'react'
import { View, Text, FlatList, TextInput, Button, TouchableOpacity } from 'react-native'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRoute, useNavigation } from '@react-navigation/native'
import { getMessages } from '../api/messenger/getMessages'
import { getChatById } from '../api/messenger/getChatById'
import { sendMessage } from '../api/messenger/sendMessage'
import { addChatter } from '../api/messenger/addChatter'
import { leaveChat } from '../api/messenger/leaveChat'
import { MessageProp, Chat, Message } from '../types/messenger'
import { UserContext } from '../context/UserContext'
import { UserContextType } from '../types/local/userContext'
import { useSocket } from '../context/SocketProvider'
import Modal from 'react-native-modal'
import Checkbox from 'expo-checkbox'

const ChatPage: React.FC = () => {
  const route = useRoute()
  const navigation = useNavigation()
  const { chatId } = route.params as { chatId: string }
  const queryClient = useQueryClient()
  const [newMessage, setNewMessage] = useState('')
  const { userData } = useContext(UserContext) as UserContextType
  const { receivedMessage, messengerMessage } = useSocket()
  const [isAddFriendModalVisible, setAddFriendModalVisible] = useState(false)
  const [isLeaveChatModalVisible, setLeaveChatModalVisible] = useState(false)
  const [selectedFriends, setSelectedFriends] = useState<string[]>([])

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

  const sendMessageMutation = useMutation({
    mutationFn: (message: MessageProp) => sendMessage(chatId, message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', chatId] })
      setNewMessage('')
    },
  })

  const addChatterMutation = useMutation({
    mutationFn: ({ chatId, username }: { chatId: string, username: string }) => addChatter(chatId, username),
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

  useEffect(() => {
    if (messengerMessage) {
      refetchChatData()
      refetchMessages()
    }
  }, [messengerMessage, refetchChatData, refetchMessages])

  if (isChatLoading || isMessagesLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    )
  }

  if (chatError || messagesError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Error: {(chatError || messagesError)?.message}</Text>
      </View>
    )
  }

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
      <Text style={{ fontSize: 14 }}>
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
      sendMessageMutation.mutate(message)
    }
  }

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
    .map((friend) => (friend.username === userData.username ? friend.username2 : friend.username))
    .filter((friend) => !chatData.members.some((member: any) => member.username === friend))

  const handleFriendSelection = (username: string) => {
    setSelectedFriends((prev) =>
      prev.includes(username)
        ? prev.filter((name) => name !== username)
        : [...prev, username]
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{chatData.name}</Text>
        <Text style={{ fontSize: 14 }}>
          Members: {chatData.members.map((member: any) => member.username).join(', ')}
        </Text>
      </View>
      {chatData.privateChat === false && (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 16 }}>
          <Button title="Add Friend" onPress={toggleAddFriendModal} />
          <Button title="Leave Chat" onPress={toggleLeaveChatModal} />
        </View>
      )}
      <FlatList
        data={messagesData.content}
        keyExtractor={(item) => item._id}
        renderItem={renderMessage}
      />
      <View style={{ padding: 16, borderTopWidth: 1, borderTopColor: '#ccc' }}>
        <TextInput
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message"
          style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10 }}
        />
        <Button title="Send" onPress={handleSendMessage} />
      </View>
      <Modal isVisible={isAddFriendModalVisible}>
        <View style={{ padding: 20, backgroundColor: 'white', borderRadius: 10 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Add Friends to Chat</Text>
          <FlatList
            data={filteredFriends}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <Checkbox
                  value={selectedFriends.includes(item)}
                  onValueChange={() => handleFriendSelection(item)}
                />
                <Text style={{ marginLeft: 10 }}>{item}</Text>
              </View>
            )}
            ListEmptyComponent={<Text>No friends available</Text>}
          />
          <Button title="Add" onPress={handleAddFriendToChat} />
          <Button title="Cancel" onPress={toggleAddFriendModal} />
        </View>
      </Modal>
      <Modal isVisible={isLeaveChatModalVisible}>
        <View style={{ padding: 20, backgroundColor: 'white', borderRadius: 10 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Confirm Leave Chat</Text>
          <Text style={{ marginBottom: 20 }}>Are you sure you want to leave this chat?</Text>
          <Button title="Yes, Leave" onPress={handleLeaveChat} />
          <Button title="Cancel" onPress={toggleLeaveChatModal} />
        </View>
      </Modal>
    </View>
  )
}

export default ChatPage
