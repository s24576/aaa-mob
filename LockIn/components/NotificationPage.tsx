import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView } from 'react-native'
import { Notifications } from 'react-native-notifications'

const NotificationComponent: React.FC = () => {
  const [notifications, setNotifications] = useState<string[]>([])

  useEffect(() => {
    const subscription =
      Notifications.events().registerNotificationReceivedForeground(
        (notification) => {
          const newNotification = notification.payload.body
          setNotifications((prev) => [...prev, newNotification])
        }
      )

    return () => {
      subscription.remove()
    }
  }, [])

  return (
    <View className="p-5">
      <Text className="text-lg mb-3">Notifications:</Text>
      <ScrollView>
        {notifications.map((notification, index) => (
          <Text key={index} className="mb-2">
            {notification}
          </Text>
        ))}
      </ScrollView>
    </View>
  )
}

export default NotificationComponent
