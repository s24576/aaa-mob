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
      className="bg-wegielek p-2 pt-1 mb-4 border-2 border-solid border-zoltek rounded-lg"
    >
      <View>
        <Text className="text-lg font-bold text-zoltek">{item.name}</Text>
        <Text className="text-sm text-bialas">
          Members: {item.members.map((member) => member.username).join(', ')}
        </Text>
        {item.lastMessage && (
          <Text className="text-sm text-bialas">
            Last message: {item.lastMessage.message}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  )

  const renderCreateChatModal = () => (
    <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
      <View className="bg-wegielek rounded p-5">
        <Text className="text-lg font-boldd text-zoltek mb-2">
          Create Public Chat
        </Text>
        <TextInput
          placeholder="Chat Name"
          value={chatName}
          onChangeText={setChatName}
          className="border border-zoltek p-2 mb-4 text-bialas rounded"
          placeholderTextColor="#F5F5F5"
        />
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
            onPress={handleCreateChat}
            className="flex-1 mr-2 bg-zoltek p-3 rounded-lg items-center"
          >
            <Text className="text-wegielek">Create</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={toggleModal}
            className="flex-1 ml-2 bg-zoltek p-3 rounded-lg items-center"
          >
            <Text className="text-wegielek">Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )

  return (
    <View className="bg-wegielek h-full p-5">
      <View className="pb-4">
        <TouchableOpacity
          onPress={toggleModal}
          className="bg-zoltek p-2 w-2/3 rounded-lg items-center self-center"
        >
          <Text className="text-wegielek text-lg font-bold">
            Create Public Chat
          </Text>
        </TouchableOpacity>
      </View>
      {renderCreateChatModal()}
      <FlatList
        data={chatsData?.content}
        keyExtractor={(item) => item._id}
        renderItem={renderChat}
        ListEmptyComponent={
          <Text className="text-bialas">No chats available</Text>
        }
      />
      <View className="flex-row justify-between items-center mt-2 absolute bottom-0 left-0 right-0 bg-wegielek">
        <TouchableOpacity onPress={handlePreviousPage} disabled={page === 0}>
          <Ionicons name="arrow-back" size={30} color="#F5B800" />
        </TouchableOpacity>
        <Text className="text-bialas">{page + 1}</Text>
        <TouchableOpacity onPress={handleNextPage}>
          <Ionicons name="arrow-forward" size={30} color="#F5B800" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default MessagesPage
