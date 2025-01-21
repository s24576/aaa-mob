import React, { useContext, useEffect } from 'react'
import {
  View,
  Text,
  FlatList,
  Button,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native'
import { useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query'
import { UserContext } from '../context/UserContext'
import { useNavigation } from '@react-navigation/native'
import { UserContextType } from '../types/local/userContext'
import { getUserData } from '../api/user/getUserData'
import { deleteFriend } from '../api/profile/deleteFriend'
import { ProfileScreenProps } from '../App'
import { useSocket } from '../context/SocketProvider'
import Icon from 'react-native-vector-icons/Ionicons'
import styles from '../styles/BrowserStyles'

const FriendListPage = () => {
  const { userData, setUserData } = useContext(UserContext) as UserContextType
  const navigation = useNavigation<ProfileScreenProps['navigation']>()
  const { receivedMessage, memberAction } = useSocket()
  const queryClient = useQueryClient()

  const {
    data: userDataQuery,
    isLoading,
    error,
    refetch: refetchUserData,
  } = useQuery({
    queryKey: ['userData'],
    queryFn: getUserData,
  })

  useEffect(() => {
    if (receivedMessage || memberAction) {
      refetchUserData()
    }
  }, [receivedMessage, memberAction, refetchUserData])

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F5B800" />
      </View>
    )
  }
  if (error) {
    return <Text>Error: {error.message}</Text>
  }

  const handleFriendRequest = (item: {
    _id: string
    username: string
    username2: string
  }) => {
    if (!userData) return
    const usernameToSend: string =
      userData._id === item.username ? item.username2 : item.username
    navigation.navigate('LockInProfile', { username: usernameToSend })
  }

  const handleDeleteFriend = async (friendId: string) => {
    try {
      await deleteFriend(friendId)
      queryClient.invalidateQueries({ queryKey: ['userData'] })
    } catch (error) {
      console.error('Error deleting friend:', error)
    }
  }

  return (
    <ScrollView style={styles.friendListContainer}>
      <View style={{ paddingBottom: 20 }}>
        <TouchableOpacity
          style={styles.friendRequestsButton}
          onPress={() => navigation.navigate('FriendRequests')}
        >
          <Text style={styles.customButton2Text}>Friend Requests</Text>
        </TouchableOpacity>

        <Text style={styles.friendListHeader}>Friends List</Text>
        
        {userDataQuery?.friends?.length === 0 ? (
          <Text style={styles.emptyListText}>No friends added yet</Text>
        ) : (
          <FlatList
            scrollEnabled={false}
            data={userDataQuery?.friends}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={styles.friendItem}>
                <Text
                  style={styles.friendName}
                  onPress={() => handleFriendRequest(item)}
                >
                  {userData && userData._id === item.username
                    ? item.username2
                    : item.username}
                </Text>
                <TouchableOpacity
                  onPress={() => handleDeleteFriend(item._id)}
                  style={styles.declineRequestButton}
                >
                  <Icon name="trash-bin" size={24} color="#F5F5F5" />
                </TouchableOpacity>
              </View>
            )}
          />
        )}
      </View>
    </ScrollView>
  )
}

export default FriendListPage
