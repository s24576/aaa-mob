import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useSocket } from '../context/SocketProvider'
import { getNotifications } from '../api/profile/getNotifications'

const NotificationComponent: React.FC = () => {
  const { receivedMessage } = useSocket()
  const queryClient = useQueryClient()
  const [selectedNotification, setSelectedNotification] = useState<string | null>(null)

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
    Alert.alert('Notification', 'SOMETHING HAPPENED')
  }

  if (isLoading) {
    return <Text>Loading...</Text>
  }

  if (error) {
    return <Text>Error: {error.message}</Text>
  }

  return (
    <View className="p-5">
      <Text className="text-lg mb-3">Notifications:</Text>
      <FlatList
        data={notifications?.content}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="bg-gray-200 p-3 mb-2 rounded"
            onPress={() => handleNotificationClick(item.value)}
          >
            <Text>{item.value}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  )
}

export default NotificationComponent
