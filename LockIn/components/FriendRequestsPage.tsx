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
import { useTranslation } from 'react-i18next'

const FriendRequestsPage: React.FC = () => {
  const { t } = useTranslation()
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
      Alert.alert(t('success'), t('friendRequestSent'), [{ text: t('ok') }])
      refetchOutgoingRequests()
    } catch (error) {
      console.error(error)
      Alert.alert(t('error'), t('failedToSendRequest'), [{ text: t('ok') }])
    }
  }

  const handleRespondRequest = async (id: string, response: boolean) => {
    try {
      await respondFriendRequest({ requestId: id, response })
      Alert.alert(
        t('success'),
        response ? t('friendRequestAccepted') : t('friendRequestDeclined'),
        [{ text: t('ok'), style: 'cancel' }]
      )
      refetchIncomingRequests()
    } catch (error) {
      console.error(error)
      Alert.alert(
        t('error'),
        response ? t('failedToAcceptRequest') : t('failedToDeclineRequest'),
        [{ text: t('ok') }]
      )
    }
  }

  const handleCancelRequest = async (id: string) => {
    try {
      await cancelFriendRequest(id)
      Alert.alert(t('success'), t('friendRequestCanceled'), [{ text: t('ok') }])
      refetchOutgoingRequests()
    } catch (error) {
      console.error(error)
      Alert.alert(t('error'), t('failedToCancelRequest'), [{ text: t('ok') }])
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
        <Text>
          {t('error')}: {(incomingError || outgoingError)?.message}
        </Text>
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
          placeholder={t('searchUsername')}
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
          <Text style={styles.requestsSectionTitle}>
            {t('incomingRequests')}
          </Text>
          {incomingRequestsData?.content?.length === 0 ? (
            <Text style={styles.emptyListText}>{t('noIncomingRequests')}</Text>
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
          <Text style={styles.requestsSectionTitle}>
            {t('outgoingRequests')}
          </Text>
          {outgoingRequestsData?.content?.length === 0 ? (
            <Text style={styles.emptyListText}>{t('noOutgoingRequests')}</Text>
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
