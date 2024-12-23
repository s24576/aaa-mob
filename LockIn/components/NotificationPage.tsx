import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView } from 'react-native'
import { useSocket } from '../context/SocketProvider'

const NotificationComponent: React.FC = () => {
  const { receivedMessage, connectionStatus, messengerMessage, memberEvent } =
    useSocket()
  const [notifications, setNotifications] = useState<string[]>([])

  useEffect(() => {
    if (receivedMessage) {
      setNotifications((prevNotifications) => {
        const updatedNotifications = [
          `Notification: ${receivedMessage}`,
          ...prevNotifications,
        ]
        return updatedNotifications.slice(0, 20)
      })
    }
  }, [receivedMessage])

  useEffect(() => {
    if (messengerMessage) {
      setNotifications((prevNotifications) => {
        const updatedNotifications = [
          `Messenger: ${messengerMessage}`,
          ...prevNotifications,
        ]
        return updatedNotifications.slice(0, 20)
      })
    }
  }, [messengerMessage])

  useEffect(() => {
    if (memberEvent) {
      setNotifications((prevNotifications) => {
        const updatedNotifications = [
          `Member Event: ${memberEvent}`,
          ...prevNotifications,
        ]
        return updatedNotifications.slice(0, 20)
      })
    }
  }, [memberEvent])

  return (
    <View className="flex-1 p-5">
      <Text className="text-lg mb-3">
        Connection Status: {connectionStatus}
      </Text>
      <ScrollView>
        {notifications.map((notification, index) => (
          <View key={index} className="p-3 my-2 border border-gray-300 rounded">
            <Text>{notification}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

export default NotificationComponent
