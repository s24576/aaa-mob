import React from 'react'
import { View, Text } from 'react-native'
import { useSocket } from '../context/SocketProvider'

const NotificationScreen: React.FC = () => {
  const { receivedMessage, connectionStatus } = useSocket()

  return (
    <View>
      <Text>Connection Status: {connectionStatus}</Text>
      <Text>Received Message: {receivedMessage}</Text>
    </View>
  )
}

export default NotificationScreen
