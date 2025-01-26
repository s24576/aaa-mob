import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useSocket } from '../context/SocketProvider'
import { getNotifications } from '../api/profile/getNotifications'
import { useNavigation } from '@react-navigation/native'
import { ProfileScreenProps } from '../App'
import styles from '../styles/BrowserStyles'
import { useTranslation } from 'react-i18next'

const NotificationComponent: React.FC = () => {
  const { receivedMessage } = useSocket()
  const queryClient = useQueryClient()
  const [selectedNotification, setSelectedNotification] = useState<
    string | null
  >(null)
  const navigation = useNavigation<ProfileScreenProps['navigation']>()
  const { t } = useTranslation()

  const {
    data: notifications,
    isLoading,
    error,
    refetch: refetchNotifications,
  } = useQuery({
    queryKey: ['notifications'],
    queryFn: getNotifications,
  })

  useEffect(() => {
    if (receivedMessage) {
      refetchNotifications()
    }
  }, [receivedMessage, refetchNotifications])

  const handleNotificationClick = (message: string) => {
    setSelectedNotification(message)
    navigation.navigate('FriendRequests')
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F5B800" />
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error.message}</Text>
      </View>
    )
  }

  const EmptyNotifications = () => (
    <Text style={styles.emptyListText}>{t('noNotifications')}</Text>
  )

  return (
    <View style={styles.notificationsContainer}>
      <Text style={styles.notificationsHeader}>{t('notifications')}</Text>
      <FlatList
        data={notifications?.content}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.notificationItem}
            onPress={() => handleNotificationClick(item.value)}
          >
            <Text style={styles.notificationText}>{item.value}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={EmptyNotifications}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

export default NotificationComponent
