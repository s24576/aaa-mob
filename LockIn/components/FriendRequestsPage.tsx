import React, { useState, useEffect } from 'react'
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native'
import { ProfileScreenProps } from '../App'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getToFriendRequests } from '../api/profile/getToFriendRequests'
import { getFromFriendRequests } from '../api/profile/getFromFriendRequests'
import { sendFriendRequest } from '../api/profile/sendFriendRequest'
import { respondFriendRequest } from '../api/profile/respondFriendRequest'
import { cancelFriendRequest } from '../api/profile/cancelFriendRequest'
import { useSocket } from '../context/SocketProvider'
import Icon from 'react-native-vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'
import styles from '../styles/BrowserStyles'

const FriendRequestsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const queryClient = useQueryClient()
  const { receivedMessage, memberAction } = useSocket()
  const navigation = useNavigation<ProfileScreenProps['navigation']>()

  const {
    data: incomingRequestsData,
    isLoading: isIncomingLoading,
    error: incomingError,
    refetch: refetchIncomingRequests,
  } = useQuery({
    queryKey: ['incomingRequests'],
    queryFn: getToFriendRequests,
  })

  const {
    data: outgoingRequestsData,
    isLoading: isOutgoingLoading,
    error: outgoingError,
    refetch: refetchOutgoingRequests,
  } = useQuery({
    queryKey: ['outgoingRequests'],
    queryFn: getFromFriendRequests,
  })

  useEffect(() => {
    if (receivedMessage || memberAction) {
      refetchIncomingRequests()
      refetchOutgoingRequests()
    }
  }, [
    receivedMessage,
    memberAction,
    refetchIncomingRequests,
    refetchOutgoingRequests,
  ])

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
  }

  const handleSendRequest = async () => {
    if (!searchQuery.trim()) return
    try {
      await sendFriendRequest(searchQuery)
      Alert.alert('Success', 'Friend request sent!', [{ text: 'OK' }])
      refetchOutgoingRequests()
    } catch (error) {
      console.error(error)
      Alert.alert('Error', 'Failed to send friend request.', [{ text: 'OK' }])
    }
  }

  const handleRespondRequest = async (id: string, response: boolean) => {
    try {
      await respondFriendRequest({ requestId: id, response })
      Alert.alert(
        'Success',
        `Friend request ${response ? 'accepted' : 'declined'}!`,
        [{ text: 'OK', style: 'cancel' }]
      )
      refetchIncomingRequests()
    } catch (error) {
      console.error(error)
      Alert.alert(
        'Error',
        `Failed to ${response ? 'accept' : 'decline'} friend request.`,
        [{ text: 'OK' }]
      )
    }
  }

  const handleCancelRequest = async (id: string) => {
    try {
      await cancelFriendRequest(id)
      Alert.alert('Success', 'Friend request canceled!', [{ text: 'OK' }])
      refetchOutgoingRequests()
    } catch (error) {
      console.error(error)
      Alert.alert('Error', 'Failed to cancel friend request.', [{ text: 'OK' }])
    }
  }

  const navigateToProfile = (userId: string) => {
    navigation.navigate('LockInProfile', { username: userId })
  }

  if (isIncomingLoading || isOutgoingLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F5B800" />
      </View>
    )
  }

  if (incomingError || outgoingError) {
    return (
      <View className=" justify-center items-center bg-czarnuch">
        <Text>Error: {(incomingError || outgoingError)?.message}</Text>
      </View>
    )
  }

  return (
    <View style={styles.friendRequestsContainer}>
      <View style={styles.searchBarContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('FriendList')}
        >
          <Icon name="arrow-back" size={24} color="#F5B800" />
        </TouchableOpacity>
        <TextInput
          style={styles.searchInputFR}
          placeholder="Search username..."
          placeholderTextColor="#808080"
          value={searchQuery}
          onChangeText={handleSearchChange}
        />
        <TouchableOpacity
          onPress={handleSendRequest}
          disabled={!searchQuery.trim()}
          style={[
            styles.acceptRequestButton,
            !searchQuery.trim() && styles.searchButtonDisabled,
          ]}
        >
          <Icon
            name="send"
            size={24}
            color={!searchQuery.trim() ? '#808080' : '#F5F5F5'}
          />
        </TouchableOpacity>
      </View>

      <ScrollView className="mb-20">
        <View style={styles.requestsSection}>
          <Text style={styles.requestsSectionTitle}>Incoming Requests</Text>
          {incomingRequestsData?.content?.length === 0 ? (
            <Text style={styles.emptyListText}>No incoming requests</Text>
          ) : (
            <FlatList
              scrollEnabled={false}
              data={incomingRequestsData?.content}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <View style={styles.requestItem}>
                  <Text
                    style={styles.requestName}
                    onPress={() => navigateToProfile(item.from)}
                  >
                    {item.from}
                  </Text>
                  <View style={styles.requestActions}>
                    <TouchableOpacity
                      style={styles.acceptRequestButton}
                      onPress={() => handleRespondRequest(item._id, true)}
                    >
                      <Icon name="checkmark" size={24} color="#F5F5F5" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.declineRequestButton}
                      onPress={() => handleRespondRequest(item._id, false)}
                    >
                      <Icon name="close" size={24} color="#F5F5F5" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          )}
        </View>

        <View style={styles.requestsSection}>
          <Text style={styles.requestsSectionTitle}>Outgoing Requests</Text>
          {outgoingRequestsData?.content?.length === 0 ? (
            <Text style={styles.emptyListText}>No outgoing requests</Text>
          ) : (
            <FlatList
              scrollEnabled={false}
              data={outgoingRequestsData?.content}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <View style={styles.requestItem}>
                  <Text
                    style={styles.requestName}
                    onPress={() => navigateToProfile(item.to)}
                  >
                    {item.to}
                  </Text>
                  <TouchableOpacity
                    style={styles.declineRequestButton}
                    onPress={() => handleCancelRequest(item._id)}
                  >
                    <Icon name="close" size={24} color="#F5F5F5" />
                  </TouchableOpacity>
                </View>
              )}
            />
          )}
        </View>
      </ScrollView>
    </View>
  )
}

export default FriendRequestsPage
