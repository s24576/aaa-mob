<<<<<<< HEAD
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
=======
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
>>>>>>> parent of 0e02280 (poczatek powiadomien)

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
<<<<<<< HEAD
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
=======
      <ScrollView>
        {notifications.map((notification, index) => (
          <View key={index} className="p-3 my-2 border border-gray-300 rounded">
            <Text className="font-bold">{notification.type}</Text>
            <Text>{notification.description}</Text>
          </View>
        ))}
      </ScrollView>
>>>>>>> parent of 0e02280 (poczatek powiadomien)
    </View>
  )
}

export default NotificationComponent
