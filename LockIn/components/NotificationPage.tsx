import React, { useState, useEffect } from 'react'
import { View, Text, Button, Platform } from 'react-native'
import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'
import Constants from 'expo-constants' // Added Constants import

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
})

const NotificationComponent: React.FC = () => {
  const [expoPushToken, setExpoPushToken] = useState('')

  useEffect(() => {
    console.log('registering for notifs')
    registerForPushNotificationsAsync()
      .then((token) => {
        console.log('Token 1:', token)
        setExpoPushToken(token)
        console.log('Token 2:', expoPushToken)
      })
      .catch((err) => {
        console.log('Error:', err)
      })
  }, [])

  async function registerForPushNotificationsAsync() {
    let token

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('myNotificationChannel', {
        name: 'A channel is needed for the permissions prompt to appear',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      })
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync()
      let finalStatus = existingStatus
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync()
        finalStatus = status
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!')
        return
      }

      try {
        const projectId =
          Constants?.expoConfig?.extra?.eas?.projectId ??
          Constants?.easConfig?.projectId
        console.log('Project ID:', projectId)
        if (!projectId) {
          throw new Error('Project ID not found')
        }
        token = (
          await Notifications.getExpoPushTokenAsync({
            projectId,
          })
        ).data
        console.log(token)
      } catch (e) {
        token = `${e}`
      }
    } else {
      alert('Must use physical device for Push Notifications')
    }

    return token
  }

  const sendNotification = async () => {
    console.log('sending notif')

    const message = {
      to: expoPushToken,
      sound: 'default',
      title: 'Original Title',
      body: 'And here is the body!',
      data: { someData: 'goes here' },
    }

    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    })
  }

  return (
    <View className="p-5">
      <Text className="text-lg mb-3">Notifications:</Text>
      <Button title="Like" onPress={sendNotification} />
    </View>
  )
}

export default NotificationComponent
