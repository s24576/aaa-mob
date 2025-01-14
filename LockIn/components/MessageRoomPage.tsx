import React, { useState, useContext, useEffect, useRef } from 'react'
import {
  View,
  Text,
  FlatList,
  TextInput,
  Button,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import { ProfileScreenProps } from '../App'
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

const ChatPage: React.FC = () => {
  const route = useRoute()
  const navigation = useNavigation<ProfileScreenProps['navigation']>()
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
  const [isMembersModalVisible, setMembersModalVisible] = useState(false)

  const toggleMembersModal = () => {
    setMembersModalVisible(!isMembersModalVisible)
  }

  const handleMemberPress = (username: string) => {
    navigation.navigate('LockInProfile', { username })
  }

  const renderMembersModal = () => (
    <Modal
      isVisible={isMembersModalVisible}
      onBackdropPress={toggleMembersModal}
    >
      <View className="bg-wegielek rounded p-5">
        <Text className="text-lg font-bold text-zoltek mb-2">Chat Members</Text>
        <FlatList
          data={chatData?.members}
          keyExtractor={(item) => item.username}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleMemberPress(item.username)}
              className="p-2 mb-2 bg-wegielek w-max border border-zoltek rounded m-1"
            >
              <Text className="text-bialas">{item.username}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text className="text-bialas">No members available</Text>
          }
          contentContainerStyle={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        />
        <View className="flex-row flex-wrap justify-center mt-4">
          <TouchableOpacity
            onPress={toggleAddFriendModal}
            className="flex-1 m-2 bg-zoltek p-3 rounded-lg items-center"
          >
            <Text className="text-wegielek">Add Friend</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={toggleLeaveChatModal}
            className="flex-1 m-2 bg-zoltek p-3 rounded-lg items-center"
          >
            <Text className="text-wegielek">Leave Chat</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )

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

  const renderMessage = ({ item, index }: { item: Message; index: number }) => (
    <View
      style={{
        padding: 16,
        borderBottomWidth: index === allMessages.length - 1 ? 0 : 1,
        borderBottomColor: '#ccc',
      }}
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
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text
          className="text-bialas flex-1"
          style={{
            color: item.userId === userData?.username ? '#F5B800' : '#FFFFFF',
          }}
        >
          {item.userId}: {item.message}
        </Text>
        <TouchableOpacity
          onPress={() => setReplyingTo(item)}
          style={{ padding: 10 }}
        >
          <Ionicons name="arrow-undo" size={20} color="#F5B800" />
        </TouchableOpacity>
      </View>
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
    <View className="bg-wegielek h-full p-5">
      {/* Chat header with members list */}
      <View className="pb-4 border-b border-zoltek">
        <Text className="text-lg font-bold text-zoltek">
          {chatData?.name || 'Loading...'}
        </Text>
        {chatData && (
          <TouchableOpacity onPress={toggleMembersModal}>
            <Text className="text-sm text-bialas">
              Members:{' '}
              {chatData.members
                .map((member: any) => member.username)
                .join(', ')}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {renderMembersModal()}
      {/* Loading indicator */}
      {messagesQueries.isLoading && (
        <View className="bg-wegielek">
          <ActivityIndicator size="large" color="#F5B800" />
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
      <View className="pt-4 border-t border-zoltek">
        {replyingTo && (
          <View className="mb-2 flex-row justify-between items-center">
            <Text className="text-bialas flex-1">
              Replying to: {replyingTo.message}
            </Text>
            <TouchableOpacity
              onPress={() => setReplyingTo(null)}
              className="bg-wegielek border border-zoltek p-2 rounded-lg items-center ml-2"
            >
              <Text className="text-zoltek">Cancel Reply</Text>
            </TouchableOpacity>
          </View>
        )}
        <View className="flex-row items-center">
          <TextInput
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type a message"
            className="border border-zoltek p-2 text-bialas rounded flex-1"
            placeholderTextColor="#F5F5F5"
          />
          <TouchableOpacity onPress={handleSendMessage} className="ml-2">
            <Ionicons
              name="send"
              size={24}
              color={!newMessage.trim() ? '#A9A9A9' : '#F5B800'}
            />
          </TouchableOpacity>
        </View>
      </View>
      <Modal isVisible={isAddFriendModalVisible}>
        <View className="bg-wegielek rounded p-5">
          <Text className="text-lg font-bold text-zoltek mb-2">
            Add Friend to Chat
          </Text>
          <FlatList
            data={filteredFriends}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <View className="flex-row items-center mb-2">
                <Checkbox
                  value={selectedFriends.includes(item)}
                  onValueChange={() => handleFriendSelection(item)}
                />
                <Text className="ml-2 text-bialas">{item}</Text>
              </View>
            )}
            ListEmptyComponent={
              <Text className="text-bialas">No friends available</Text>
            }
          />
          <View className="flex-row justify-between mt-4">
            <TouchableOpacity
              onPress={handleAddFriendToChat}
              className="flex-1 mr-2 bg-zoltek p-3 rounded-lg items-center"
            >
              <Text className="text-wegielek">Add</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={toggleAddFriendModal}
              className="flex-1 ml-2 bg-zoltek p-3 rounded-lg items-center"
            >
              <Text className="text-wegielek">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal isVisible={isLeaveChatModalVisible}>
        <View className="bg-wegielek rounded p-5">
          <Text className="text-lg font-bold text-zoltek mb-2">Leave Chat</Text>
          <Text className="text-bialas">
            Are you sure you want to leave this chat?
          </Text>
          <View className="flex-row justify-between mt-4">
            <TouchableOpacity
              onPress={handleLeaveChat}
              className="flex-1 mr-2 bg-zoltek p-3 rounded-lg items-center"
            >
              <Text className="text-wegielek">Leave</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={toggleLeaveChatModal}
              className="flex-1 ml-2 bg-zoltek p-3 rounded-lg items-center"
            >
              <Text className="text-wegielek">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default ChatPage
