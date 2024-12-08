import React, { useState } from 'react'
import { View, Text, Button } from 'react-native'
import useWebSocket from '../api/socket/useWebSocket' // Import the custom hook

const NotificationScreen: React.FC = () => {
  const [username, setUsername] = useState<string>('test1000')
  const { receivedMessage, connectionStatus } = useWebSocket(username)

  return (
    <View>
      <Text>Username: {username}</Text>
      <Text>Connection Status: {connectionStatus}</Text>
      <Text>Received Message: {receivedMessage}</Text>
      <Button title="Change Username" onPress={() => setUsername('user2')} />
    </View>
  )
}

export default NotificationScreen
