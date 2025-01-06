import React, { useEffect, useState, useContext } from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Button,
  TextInput,
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

const MessagesPage: React.FC = () => {
  const navigation = useNavigation<ChatPageScreenProps['navigation']>()
  const queryClient = useQueryClient()
  const { receivedMessage, messengerMessage, memberAction } = useSocket()
  const { userData } = useContext(UserContext) as UserContextType
  const [isModalVisible, setModalVisible] = useState(false)
  const [selectedFriends, setSelectedFriends] = useState<string[]>([])
  const [chatName, setChatName] = useState('')
  const [page, setPage] = useState(0)

  const {
    data: chatsData,
    isLoading,
    error,
    refetch: refetchChats,
  } = useQuery({
    queryKey: ['chats', page],
    queryFn: () => getChats(page, 5),
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

  useEffect(() => {
    console.log('userData:', userData)
  }, [userData])

  useEffect(() => {
    console.log('Chats Data:', chatsData)
  }, [chatsData])

  useEffect(() => {
    console.log('Filtered Friends:', filteredFriends)
  }, [filteredFriends])

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

  const renderCreateChatModal = () => (
    <Modal isVisible={isModalVisible}>
      <View className="p-5 bg-white rounded">
        <Text className="text-lg font-bold mb-4">Create Public Chat</Text>
        <TextInput
          placeholder="Chat Name"
          value={chatName}
          onChangeText={setChatName}
          className="border p-2 mb-4"
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
              <Text className="ml-2">{item}</Text>
            </View>
          )}
          ListEmptyComponent={<Text>No friends available</Text>}
        />
        <Button title="Create" onPress={handleCreateChat} />
        <Button title="Cancel" onPress={toggleModal} />
      </View>
    </Modal>
  )

  return (
    <View className="">
      <Button title="Create Public Chat" onPress={toggleModal} />
      {renderCreateChatModal()}
      <FlatList
        data={chatsData?.content}
        keyExtractor={(item) => item._id}
        renderItem={renderChat}
        ListEmptyComponent={<Text>No chats available</Text>}
      />
      <View className="flex-row justify-between mt-2">
        <Button
          title="Previous Page"
          onPress={handlePreviousPage}
          disabled={page === 0}
        />
        <Button title="Next Page" onPress={handleNextPage} />
      </View>
    </View>
  )
}

export default MessagesPage
