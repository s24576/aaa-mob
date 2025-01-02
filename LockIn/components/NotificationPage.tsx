import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useSocket } from '../context/SocketProvider'

interface Notification {
  type: string
  description: string
}

const NotificationComponent: React.FC = () => {
  const { receivedMessage, connectionStatus, messengerMessage, memberEvent } =
    useSocket()
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const storedNotifications = await AsyncStorage.getItem('notifications')
        if (storedNotifications) {
          setNotifications(JSON.parse(storedNotifications))
        }
      } catch (error) {
        console.error('Failed to load notifications from storage:', error)
      }
    }

    loadNotifications()
  }, [])

  useEffect(() => {
    const saveNotifications = async (newNotifications: Notification[]) => {
      try {
        await AsyncStorage.setItem(
          'notifications',
          JSON.stringify(newNotifications)
        )
      } catch (error) {
        console.error('Failed to save notifications to storage:', error)
      }
    }

    if (receivedMessage) {
      setNotifications((prevNotifications) => {
        const updatedNotifications = [
          { type: 'Notification', description: receivedMessage },
          ...prevNotifications,
        ].slice(0, 20)
        saveNotifications(updatedNotifications)
        return updatedNotifications
      })
    }
  }, [receivedMessage])

  useEffect(() => {
    const saveNotifications = async (newNotifications: Notification[]) => {
      try {
        await AsyncStorage.setItem(
          'notifications',
          JSON.stringify(newNotifications)
        )
      } catch (error) {
        console.error('Failed to save notifications to storage:', error)
      }
    }

    if (messengerMessage) {
      const messageData = JSON.parse(messengerMessage)
      setNotifications((prevNotifications) => {
        const updatedNotifications = [
          {
            type: 'Messenger',
            description: `User: ${messageData.userId}, Message: ${messageData.message}`,
          },
          ...prevNotifications,
        ].slice(0, 20)
        saveNotifications(updatedNotifications)
        return updatedNotifications
      })
    }
  }, [messengerMessage])

  useEffect(() => {
    const saveNotifications = async (newNotifications: Notification[]) => {
      try {
        await AsyncStorage.setItem(
          'notifications',
          JSON.stringify(newNotifications)
        )
      } catch (error) {
        console.error('Failed to save notifications to storage:', error)
      }
    }

    if (memberEvent) {
      setNotifications((prevNotifications) => {
        const updatedNotifications = [
          { type: 'Member Event', description: memberEvent },
          ...prevNotifications,
        ].slice(0, 20)
        saveNotifications(updatedNotifications)
        return updatedNotifications
      })
    }
  }, [memberEvent])

  return (
    <View className="p-5">
      <Text className="text-lg mb-3">
        Connection Status: {connectionStatus}
      </Text>
      <Text className="text-lg mb-3">Notifications:</Text>
      <ScrollView>
        {notifications.map((notification, index) => (
          <View key={index} className="p-3 my-2 border border-gray-300 rounded">
            <Text className="font-bold">{notification.type}</Text>
            <Text>{notification.description}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

export default NotificationComponent
