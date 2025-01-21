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
import styles from '../styles/BrowserStyles'
import Icon from 'react-native-vector-icons/Ionicons'

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
  const { memberAction, refreshMessages, setRefreshMessages } = useSocket()
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
      backdropOpacity={0.9}
    >
      <View style={styles.modalWrapper}>
        <Text style={styles.modalTitle}>Chat Members</Text>
        <View style={styles.modalListContainer}>
          <FlatList
            data={chatData?.members}
            keyExtractor={(item) => item.username}
            numColumns={2}
            columnWrapperStyle={{
              justifyContent: 'center',
            }}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleMemberPress(item.username)}
                style={styles.modalItemContainer}
              >
                <Text style={styles.modalItemText}>{item.username}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyListText}>No members available</Text>
            }
          />
        </View>
        <View style={styles.modalButtons}>
          <TouchableOpacity
            onPress={toggleAddFriendModal}
            style={styles.modalButtonPrimary}
          >
            <Text style={styles.modalButtonText}>Add Friend</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={toggleLeaveChatModal}
            style={styles.modalButtonSecondary}
          >
            <Text style={styles.modalButtonTextSecondary}>Leave Chat</Text>
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
      style={[
        styles.messageItem,
        item.userId === userData?.username
          ? styles.messageOwn
          : styles.messageOther,
      ]}
    >
      {item.respondingTo && (
        <View style={styles.replyContainer}>
          <Text style={styles.replyText}>
            Replying to:{' '}
            {
              allMessages.find((msg: Message) => msg._id === item.respondingTo)
                ?.message
            }
          </Text>
        </View>
      )}
      <View className="flex-row items-center">
        <Text style={styles.messageText}>
          {item.userId}: {item.message}
        </Text>
        <TouchableOpacity onPress={() => setReplyingTo(item)} className="ml-2">
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
    if (memberAction) {
      queryClient.invalidateQueries({ queryKey: ['chat', chatId] })
      queryClient.invalidateQueries({ queryKey: ['messages', chatId] })
    }
  }, [memberAction, queryClient, chatId])

  useEffect(() => {
    if (refreshMessages) {
      queryClient.invalidateQueries({ queryKey: ['messages', chatId] })
      setRefreshMessages(false)
    }
  }, [refreshMessages, queryClient, chatId])

  const renderAddFriendModal = () => (
    <Modal
      isVisible={isAddFriendModalVisible}
      onBackdropPress={toggleAddFriendModal}
      backdropOpacity={0.9}
    >
      <View style={styles.modalWrapper}>
        <Text style={styles.modalTitle}>Add Friend to Chat</Text>
        <View style={styles.modalListContainer}>
          <FlatList
            data={filteredFriends}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <View style={styles.checkboxContainer}>
                <Checkbox
                  value={selectedFriends.includes(item)}
                  onValueChange={() => handleFriendSelection(item)}
                  style={styles.checkbox}
                />
                <Text style={styles.modalItemText}>{item}</Text>
              </View>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyListText}>No friends available</Text>
            }
          />
        </View>
        <View style={styles.modalButtons}>
          <TouchableOpacity
            onPress={handleAddFriendToChat}
            style={styles.modalButtonPrimary}
          >
            <Text style={styles.modalButtonText}>Add</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={toggleAddFriendModal}
            style={styles.modalButtonSecondary}
          >
            <Text style={styles.modalButtonTextSecondary}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )

  const renderLeaveChatModal = () => (
    <Modal
      isVisible={isLeaveChatModalVisible}
      onBackdropPress={toggleLeaveChatModal}
      backdropOpacity={0.9}
    >
      <View style={styles.modalWrapper}>
        <Text style={styles.modalTitle}>Leave Chat</Text>
        <Text style={styles.modalConfirmText}>
          Are you sure you want to leave this chat?
        </Text>
        <View style={styles.modalButtons}>
          <TouchableOpacity
            onPress={handleLeaveChat}
            style={styles.modalButtonPrimary}
          >
            <Text style={styles.modalButtonText}>Leave</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={toggleLeaveChatModal}
            style={styles.modalButtonSecondary}
          >
            <Text style={styles.modalButtonTextSecondary}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )

  return (
    <View style={styles.messageContainer}>
      <View style={styles.chatHeader}>
        <View className="flex-row items-center">
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('Messages')}
          >
            <Icon name="arrow-back" size={24} color="#F5B800" />
          </TouchableOpacity>
          <Text style={styles.chatTitle}>{chatData?.name || 'Loading...'}</Text>
        </View>
        {chatData && (
          <TouchableOpacity onPress={toggleMembersModal}>
            <Text style={styles.chatMembers}>
              Members:{' '}
              {chatData.members
                .map((member: any) => member.username)
                .join(', ')}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {renderMembersModal()}
      {renderAddFriendModal()}
      {renderLeaveChatModal()}
      {/* Loading indicator */}
      {messagesQueries.isLoading && (
        <View className="bg-wegielek">
          <ActivityIndicator size="large" color="#F5B800" />
        </View>
      )}
      {/* FlatList for messages */}
      <FlatList
        style={styles.messagesList}
        data={allMessages}
        keyExtractor={(item, index) => `${item._id}-${index}`} // Ensure unique keys
        renderItem={renderMessage}
        inverted
        onEndReached={loadMoreMessages}
      />
      {/* Reply and message input section */}
      <View className="flex-row items-center justify-center w-20%">
        {replyingTo && (
          <View style={styles.replyContainer}>
            <Text style={styles.replyText}>
              Replying to: {replyingTo.message}
            </Text>
            <TouchableOpacity onPress={() => setReplyingTo(null)}>
              <Ionicons name="close" size={20} color="#888" />
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message"
          placeholderTextColor="#888"
          style={styles.messageInput}
        />
        <TouchableOpacity
          onPress={handleSendMessage}
          style={[
            styles.sendButton,
            !newMessage.trim() && styles.sendButtonDisabled,
          ]}
          disabled={!newMessage.trim()}
        >
          <Ionicons
            name="send"
            size={24}
            color={!newMessage.trim() ? '#888' : '#131313'}
          />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default ChatPage
