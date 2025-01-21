import React, { useEffect, useState, useContext } from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Button,
  TextInput,
  ActivityIndicator,
} from 'react-native'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigation } from '@react-navigation/native'
import { getChats } from '../api/messenger/getChats'
import { createPublicChat } from '../api/messenger/createChat'
import { ChatPageScreenProps } from '../App'
import { useSocket } from '../context/SocketProvider'
import { UserContext } from '../context/UserContext'
import { UserContextType } from '../types/local/userContext'
import Modal from 'react-native-modal'
import Checkbox from 'expo-checkbox'
import { Chat } from '../types/messenger'
import { Ionicons } from '@expo/vector-icons'
import styles from '../styles/BrowserStyles'

const MessagesPage: React.FC = () => {
  const navigation = useNavigation<ChatPageScreenProps['navigation']>()
  const { receivedMessage, messengerMessage, memberAction } = useSocket()
  const { userData } = useContext(UserContext) as UserContextType
  const [isModalVisible, setModalVisible] = useState(false)
  const [selectedFriends, setSelectedFriends] = useState<string[]>([])
  const [chatName, setChatName] = useState('')
  const [page, setPage] = useState(0)
  const size = 4

  const {
    data: chatsData,
    isLoading,
    error,
    refetch: refetchChats,
  } = useQuery({
    queryKey: ['chats', page],
    queryFn: () => getChats(page, size),
  })

  const filteredFriends = userData?.friends.map((friend) =>
    friend.username === userData.username ? friend.username2 : friend.username
  )

  useEffect(() => {
    if (messengerMessage) {
      refetchChats()
    }
  }, [messengerMessage, refetchChats])

  useEffect(() => {
    if (memberAction) {
      refetchChats()
    }
  }, [memberAction, refetchChats])

  const toggleModal = () => {
    setModalVisible(!isModalVisible)
  }

  const handleCreateChat = async () => {
    if (chatName.trim() && selectedFriends.length > 0) {
      try {
        await createPublicChat({ name: chatName, members: selectedFriends })
        setChatName('')
        setSelectedFriends([])
        toggleModal()
        refetchChats()
      } catch (error) {
        console.error('Error creating public chat:', error)
      }
    }
  }

  const handleFriendSelection = (username: string) => {
    setSelectedFriends((prev) =>
      prev.includes(username)
        ? prev.filter((name) => name !== username)
        : [...prev, username]
    )
  }

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1)
  }

  const handlePreviousPage = () => {
    if (page > 0) {
      setPage((prevPage) => prevPage - 1)
    }
  }

  if (isLoading) {
    return (
      <View className="bg-wegielek">
        <ActivityIndicator size="large" color="#F5B800" />
      </View>
    )
  }

  if (error) {
    return (
      <View className=" justify-center items-center bg-wegielek">
        <Text className="text-bialas">Error: {error.message}</Text>
      </View>
    )
  }

  const handleChatPress = (chatId: string) => {
    navigation.navigate('ChatPage', { chatId })
  }

  const renderChat = ({ item }: { item: Chat }) => (
    <TouchableOpacity
      onPress={() => handleChatPress(item._id)}
      style={styles.chatItem}
    >
      <View style={styles.chatItemHeader}>
        <Text style={styles.chatTitle}>{item.name}</Text>
      </View>
      <Text style={styles.chatMembers}>
        Members: {item.members.map((member) => member.username).join(', ')}
      </Text>
      {item.lastMessage && (
        <Text style={styles.lastMessage}>
          Last message: {item.lastMessage.message}
        </Text>
      )}
    </TouchableOpacity>
  )

  const renderCreateChatModal = () => (
    <Modal
      isVisible={isModalVisible}
      onBackdropPress={toggleModal}
      backdropOpacity={0.9}
      style={styles.modalOverlay}
    >
      <View style={styles.modalWrapper}>
        <Text style={styles.modalTitle}>Create Public Chat</Text>
        <TextInput
          placeholder="Chat Name"
          value={chatName}
          onChangeText={setChatName}
          style={styles.modalInput}
          placeholderTextColor="#888"
        />
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
            onPress={handleCreateChat}
            style={styles.modalButtonPrimary}
            disabled={!chatName.trim() || selectedFriends.length === 0}
          >
            <Text style={styles.modalButtonText}>Create</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={toggleModal}
            style={styles.modalButtonSecondary}
          >
            <Text style={styles.modalButtonTextSecondary}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )

  return (
    <View style={styles.chatListContainer}>
      <TouchableOpacity onPress={toggleModal} style={styles.createChatButton}>
        <Text style={styles.createChatText}>Create Public Chat</Text>
      </TouchableOpacity>

      {/* Modal remains the same */}
      {renderCreateChatModal()}

      <FlatList
        data={chatsData?.content}
        keyExtractor={(item) => item._id}
        renderItem={renderChat}
        ListEmptyComponent={
          <Text style={styles.emptyListText}>No chats available</Text>
        }
      />

      {/* Pagination container */}
      <View style={styles.paginationContainer}>
        <TouchableOpacity onPress={handlePreviousPage} disabled={page === 0}>
          <Ionicons
            name="arrow-back"
            size={30}
            color={page === 0 ? '#888' : '#F5B800'}
          />
        </TouchableOpacity>
        <Text style={styles.pageNumber}>{page + 1}</Text>
        <TouchableOpacity onPress={handleNextPage}>
          <Ionicons name="arrow-forward" size={30} color="#F5B800" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default MessagesPage
